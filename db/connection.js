const mysql = require('mysql2/promise');
require('dotenv').config();


const db = mysql.createPool({
    host: process.env.DB_HOST,      
    user: process.env.DB_USER,      
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME    
});


(async () => {
    try {
        const connection = await db.getConnection();
        console.log('Database connected successfully!');
        connection.release();  
    } catch (error) {
        console.error('Error connecting to the database:', error.message);
    }
})();

module.exports = db;
