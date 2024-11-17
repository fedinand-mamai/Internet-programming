// Import necessary modules
const mysql = require('mysql2/promise');
require('dotenv').config();  // Load environment variables for security

// Database connection configuration
const dbConfig = {
    host: 'localhost',  // Use 'localhost' for clarity
    user: 'root',
    password: process.env.DB_PASSWORD,  // Get password securely from environment variables
    database: 'obituary_platform',
    port: 3307  // Custom port
};

// Initialize MySQL connection pool for better performance
const pool = mysql.createPool(dbConfig);

// Test the connection and handle errors
async function testConnection() {
    try {
        const connection = await pool.getConnection();  // Get a connection from the pool
        console.log('Successfully connected to the MySQL database.');
        connection.release();  // Release the connection back to the pool
    } catch (error) {
        console.error(`Error connecting to the database: ${error.message}`);
    }
}

// Export the pool for use in querying the database elsewhere
module.exports = { pool, testConnection };

// Example usage of querying the database
async function queryDatabase(query) {
    try {
        const [rows] = await pool.execute(query);  // Execute a query using async/await
        console.log('Query Results:', rows);
        return rows;
    } catch (error) {
        console.error('Error executing query:', error.message);
    }
}

// Initialize connection test
testConnection();
