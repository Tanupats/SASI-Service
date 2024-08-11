var express = require("express");
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', (req, res) => {
    res.send({ msg: 'hello is bills routes' })
})

router.post('/', async (req, res) => {
    const result = await prisma.bills.create({ data: req.body })
    if (result) {
        res.send(result)
    }
})

router.put('/', async (req, res) => {
    const result = await prisma.bills.update( { where: { id: req.params.id }, data: req.body })
    if (result) {
        res.send(result)
    }
})

router.delete('/:id', async (req, res) => {
    const result = await prisma.bills.update( { where: { id: req.params.id  }, data: req.body })
    if (result) {
        res.send(result)
    }
})

module.exports = router;