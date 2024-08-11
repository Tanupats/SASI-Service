var express = require("express");
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', (req, res) => {
    res.send({ msg: 'hello is shop routes' })
})

router.post('/', async (req, res) => {
    const result = await prisma.shop.create({ data: req.body })
    if (result) {
        res.send(result)
    }
})

router.post('/', async (req, res) => {
    const result = await prisma.shop.create({ data: req.body })
    if (result) {
        res.send(result)
    }
})

module.exports = router;