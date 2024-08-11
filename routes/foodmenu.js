var express = require("express");
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
router.get('/', async (req, res) => {
    const food = await prisma.foodmenu.findMany()
    res.send(food)
})

router.get('/:type_id', async (req, res) => {
    const food = await prisma.foodmenu.findMany({ where: { TypeID: parseInt(req.params.type_id) } })
    res.send(food)
})

router.post('/', async (req, res) => {
    const result = await prisma.foodmenu.create({ data: req.body })
    if (result) {
        res.send(result)
    }
})

router.put('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const result = await prisma.foodmenu.update({ where: { id: id }, data: req.body })
    if (result) {
        res.send({ data: result, msg: 'updated foodMenu' })
    }
})
router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const result = await prisma.foodmenu.delete({ where: { id: id }})
    if (result) {
        res.send({ data: result, msg: 'deleted foodMenu' })
    }
})

module.exports = router;
