const mysql = require("mysql");
require('dotenv').config()
const connection = mysql.createConnection(process.env.API_KEY);
connection.connect((err) => {
    if (err) {
        console.log("Connect Erro", err);
        return;

    }
    console.log("connect succesFully");
});

module.exports = connection;
