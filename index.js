const express = require("express");
let cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
app.use('/files', express.static('files'));
const connection = require("./connection.js");
var foodRouter = require('./routes/app.js');
app.use('/app',foodRouter);
let port = 4000;

app.listen(port, () => {
    console.log("server runnig is port 3000");
});

app.get('/',(req,res)=>{
    res.send({message:"HELLO API"})
})

//create services 
app.post("/newservices", async (req, res) => {

    const {pathName, methods,dataModel,queryData,params,fields } = req.body;
    let todo = [pathName, methods,dataModel,queryData,params,fields];
    connection.query(
        "INSERT INTO services (pathName, methods,dataModel,queryData,params,fields) VALUES (?,?,?,?,?,?)",
        todo,
        (err) => {
            if (err) {
                return res.status(400).send(err);
            }
            res.status(200)
                .json({ message: "create services sucess" });
        }
    );
});
