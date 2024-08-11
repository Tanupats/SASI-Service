var express = require("express");
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('', async (req, res) => {
   
    const result = await prisma.menu_type.findMany();
    
    res.send(result)
   
});





module.exports = router;