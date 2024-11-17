document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('obituaryForm');
    const contentInput = document.getElementById('content');
    const contentCount = document.getElementById('contentCount');

    // Update character count in real-time
    contentInput.addEventListener('input', () => {
        const count = contentInput.value.length;
        contentCount.textContent = `${count} characters`;
    });

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors(); // Reset any previous errors

        if (validateForm()) {
            submitForm();
        }
    });

    // Form validation logic
    function validateForm() {
        let isValid = true;

        // Validation rules for form fields
        const validationRules = [
            { id: 'name', check: (value) => value.trim().length >= 2, errorMessage: 'Name must be at least 2 characters long' },
            { id: 'date_of_birth', check: (value) => !isNaN(new Date(value).getTime()), errorMessage: 'Please enter a valid date of birth' },
            { id: 'date_of_death', check: (value) => {
                const dob = new Date(document.getElementById('date_of_birth').value);
                const dod = new Date(value);
                return !isNaN(dod.getTime()) && dod >= dob && dod <= new Date();
            }, errorMessage: 'Date of death must be a valid date, after the date of birth, and not in the future' },
            { id: 'content', check: (value) => value.trim().length >= 50, errorMessage: 'Content must be at least 50 characters long' },
            { id: 'author', check: (value) => value.trim().length >= 2, errorMessage: 'Author name must be at least 2 characters long' },
        ];

        // Validate each field based on its rules
        validationRules.forEach(({ id, check, errorMessage }) => {
            const field = document.getElementById(id);
            if (!check(field.value)) {
                showError(id, errorMessage);
                isValid = false;
            }
        });

        return isValid;
    }

    // Show error message for a specific field
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(`${fieldId}Error`);
        field.classList.add('error');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    // Clear all error messages
    function clearErrors() {
        document.querySelectorAll('.error-message').forEach(error => {
            error.style.display = 'none';
            error.textContent = '';
        });

        document.querySelectorAll('.error').forEach(field => {
            field.classList.remove('error');
        });
    }

    // Submit the form asynchronously
    async function submitForm() {
        try {
            const formData = new FormData(form);
            const response = await fetch('/submit_obituary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(Object.fromEntries(formData)),
            });

            const data = await response.json();

            if (response.ok) {
                showNotification('success', 'Obituary submitted successfully');
                form.reset();
                setTimeout(() => window.location.href = '/view_obituaries', 2000);
            } else {
                handleErrorResponse(data);
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('error', 'An error occurred while submitting the form');
        }
    }

    // Handle errors from the server response
    function handleErrorResponse(data) {
        showNotification('error', data.message || 'Error submitting obituary');
        if (data.errors) {
            data.errors.forEach(error => {
                showNotification('error', error);
            });
        }
    }

    // Create and show notification
    function showNotification(type, message) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => notification.remove(), 5000);
    }
});
