var express = require("express");
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
/**
 * @swagger
 * /foodmenu:
 *   get:
 *     tags:
 *       - Food Menu
 *     summary: getFoodMenu
 *     description: This is an example route
 *     responses:
 *       200:
 *         description: Success
 */
/**
/**
 * @swagger
 * /foodmenu:
 *   post:
 *     tags:
 *       - Food Menu
 *     summary: createFoodMenu
 *     description: This is an example route
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 example: "sa001"
 *               foodname:
 *                 type: string
 *                 example: "menu"
 *               Price:
 *                 type: Decimal
 *                 example: 50.00
 *     responses:
 *       200:
 *         description: Success
 */
// code     String   @db.VarChar(255)
// foodname String   @db.VarChar(225)
// Price    Decimal? @db.Decimal(10, 2)
// img      String   @db.Text
// TypeID   Int
// status   Int      @default(1)

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
