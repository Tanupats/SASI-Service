const mysql = require("mysql");
const connection = mysql.createConnection({
    host: "aws.connect.psdb.cloud",
    user: "qhlqn7jo1fq72j6vektp",
    password: "pscale_pw_ltFNGMaNkhxwVqvdknU6n9UBcTpniYzu3PjZkwCOoR",
    database: "sasi_delivery",
});
        connection.connect((err) => {
    if (err) {
        console.log("Connect Erro", err);
        return;
        
    }
    console.log("connect succesFully");
});

module.exports = connection;
