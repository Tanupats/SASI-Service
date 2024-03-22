const express = require("express");
let cors = require("cors");

const app = express();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
app.use(cors());
app.use(express.json());
app.use('/files', express.static('files'));
const connection = require("./connection.js");
var foodRouter = require('./routes/food.js');
app.use('/app',foodRouter);
app.listen(3000, () => {
    console.log("server runnig is port 3000");
});

app.get("/", async (req, res) => {

    res.json({ message: "SASI-NewServices V1.0" });

});



//create services 
app.post("/newService", async (req, res) => {

    const { pathName, methods, dataModel,queryData,params,fields } = req.body;
    let todo = [pathName, methods, dataModel,queryData,params,fields];
    connection.query(
        "INSERT INTO services (pathName, methods,dataModel,queryData,params,fields) value (?,?,?,?,?,?)",
        todo,
        (err) => {
            if (err) {
                return res.status(400).send();
            }
            res.status(200)
                .json({ message: "create service sucess" });
        }
    );


});