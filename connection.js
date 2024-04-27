const mysql = require("mysql2");
const connection = mysql.createConnection('mysql://qhlqn7jo1fq72j6vektp:pscale_pw_ltFNGMaNkhxwVqvdknU6n9UBcTpniYzu3PjZkwCOoRj@aws.connect.psdb.cloud/sasi_delivery?ssl={"rejectUnauthorized":true}');
connection.connect((err) => {
    if (err) {
        console.log("Connect Erro", err);
        return;

    }
    console.log("connect succesFully");
});

module.exports = connection;
