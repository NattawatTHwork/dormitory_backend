require('dotenv').config()
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dormitory'
});
// const connection = mysql.createConnection(process.env.DATABASE_URL);

module.exports = connection;
