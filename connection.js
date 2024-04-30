const mysql = require("mysql2");
require('dotenv').config()
const connection = mysql.createConnection(process.env.API_KEY);
//const  connection = mysql.createConnection({host:"localhost",user:'root',password:'',database:'sasirest'});
connection.connect((err) => {
    if (err) {
      
        console.log("Connect Erro", err);
        return;

    }
    console.log("connect succesFully");
});

module.exports = connection;
