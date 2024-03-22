var express = require("express");
var router = express.Router();
const connection = require("../connection.js");

router.get("*", async (req, res, next) => {
    let path = req.path;
    console.log(path)
    //GET path form url to 
    connection.query("SELECT * FROM services WHERE pathName=? AND methods='GET'", [path], (err, result) => {
        if(result.length>0){      
        let { queryData, params } = { ...result[0] };
        //get parameter from path 
        if (params !== "") {
            console.log("have parameter is")
           
            let para = "";
          

            for (const key in req.query) {
                para=req.query[key];
              }
              
            connection.query(queryData, [para], (err, result) => {
                if (err) {
                    console.log(err)
                }
                res.send(result);
            });
        }else{
            connection.query(queryData,(err, result) => {
                if (err) {
                    console.log(err)
                }

                res.send(result);
            });
        }
    }else {       
        res.send({message:"services not found "+path});
    }
    });
});


//POST
router.post("*", async (req,res) => {

    let path = req.path;
    let body = req.body;
    //GET path form url to 
    connection.query("SELECT * FROM services WHERE pathName=? AND methods='POST'", [path], (err, result) => {
        if(result.length>0){      
        let { queryData,fields,dataModel} = { ...result[0] };


        let bodyPost =[];    
        //get body from post
        for (let key in body) {
            console.log(key + ': ' + body[key]);
            bodyPost.push(body[key])
          }
          console.log(bodyPost)
            connection.query(queryData,bodyPost,(err) => {
                if (err) {
                    console.log(err)
                }
                res.send({message:"Insert Data success In Table "+dataModel});
            });
       
    }else {       
        res.send({message:"cant NOT POST path"+path});
    }
    });
});








module.exports = router; 