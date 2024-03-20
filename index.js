const express = require("express");
let cors = require("cors");

const app = express();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
app.use(cors());
app.use(express.json());
app.use('/files', express.static('files'));



var foodRouter = require('./routes/food.js');
app.use('/food',foodRouter);


app.listen(3000, () => {
    console.log("server runnig is port 3000");
});

app.get("/", async (req, res) => {
    res.json({ message: "SASI-NewServices V1.0" });

});

app.get("/app/:path/:method", async (req, res) => {

    res.json({ message: "demo-service" });

});

//create services 
app.post("/newService", async (req, res) => {

    const { pathName, methods, dataModel } = req.body;
    let todo = [pathName, methods, dataModel];
    connection.query(
        "INSERT INTO services (pathName, methods,dataModel) value (?,?,?)",
        todo,
        (err) => {
            if (err) {
                return res.status(400).send();
            }
            res.status(200)
                .json({ message: "create service sucess" });
        }
    );
    //save file for service create
// Data which will write in a file.
let data = "Learning how to write in a file."
 
// Write data in 'Output.txt' .
fs.writeFile('Output.txt', data, (err) => {
 
    // In case of a error throw err.
    if (err) throw err;
})

});