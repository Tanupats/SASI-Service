var express = require("express");
var router = express.Router();
const connection = require("../connection.js");

// router.get("*", async (req, res, next) => {
//     let path = req.path;
//     console.log(path)


//     connection.query("SELECT * FROM `services` WHERE pathName=? AND methods='GET'", [path], (err, result) => {
//         if (err) {
//             console.log(err)
//         }


//         let { queryData, params } = { ...result[0] };

//         console.log(params)
//         //get parameter from path 

//         connection.query(queryData, (err, result) => {
//             if (err) {
//                 console.log(err)
//             }
//             res.send(result);
//         });

//     });
// });
let Rotepaths = "/:pathName"
router.post("/setService",(req,res)=>{

})

router.get(Rotepaths, async (req, res, next) => {
 
    let param = req.query;
    console.log(param);


    
    
    // connection.query("SELECT * FROM `services` WHERE pathName=? AND methods='GET'", [path], (err, result) => {
    //     if (err) {
    //         console.log(err)
    //     }


    //     let { queryData, params } = { ...result[0] };

    //     //console.log(params)
    //     //get parameter from path 

    //     connection.query(queryData, (err, result) => {
    //         if (err) {
    //             console.log(err)
    //         }
    //         res.send(result);
    //     });
    // });
});


module.exports = router; 