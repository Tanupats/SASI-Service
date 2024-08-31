var express = require("express");
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
/**
 * @swagger
 * /shop:
 *   get:
 *     tags:
 *       - Shop
 *     summary: getShop
 *     description: getAllShop
 *     responses:
 *       200:
 *         description: Success
 */
/**
 * @swagger
 * /shop/shop-user/{id}:
 *   get:
 *     tags:
 *       - Shop
 *     summary: Get a shop by user
 *     description: Retrieve a shop using its id.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: id of the user to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Shop not found
 */

router.get('/', async (req, res) => {
    const result = await prisma.shop.findMany()
    if (result) {
        res.send(result)
    }
})
router.get('/shop-user/:id', async (req, res) => {
    const result = await prisma.shop.findMany({where:{user_id:req.params.id}})
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

router.post('/', async (req, res) => {
    const result = await prisma.shop.create({ data: req.body })
    if (result) {
        res.send(result)
    }
})

module.exports = router;