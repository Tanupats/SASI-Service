const mysql = require("mysql");
const connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "sasirest",
});
        connection.connect((err) => {
    if (err) {
        console.log("Connect Erro", err);
        return;
        
    }
    console.log("connect succesFully");
});

module.exports = connection;
