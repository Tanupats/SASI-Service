const mysql = require("mysql2");
require('dotenv').config()
const connection = mysql.createConnection(process.env.DATABASE_URL);
connection.connect((err) => {
    if (err) {
        console.log("Connect Erro", err);
        return;

    }
    console.log("connect succesFully");
});

module.exports = connection;
