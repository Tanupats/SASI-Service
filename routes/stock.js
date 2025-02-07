var express = require("express");
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const validateJwt = require("../libs/validationJWT.js");
// Middleware สำหรับตรวจสอบ JWT

const jwtMiddleware = async (req, res, next) => {
    const response = await validateJwt(req.headers.apikey);
    if (response.status) {
        // ถ้าผ่านการตรวจสอบ JWT
        next(); // ดำเนินการต่อไปยัง handler ต่อไป
    } else {
        // ถ้าไม่ผ่านการตรวจสอบ JWT
        res.status(401).send(response); // ส่งผลลัพธ์กลับไปโดยไม่ไป handler ต่อไป
    }
};
/**
 * @swagger
 * /stock:
 *   get:
 *     tags:
 *       - stock
 *     summary: get stock product
 *     description: This is an example route
 *     responses:
 *       200:
 *         description: Success
 */
/**
 * 
/**
 * @swagger
 * /stock/getByProduct/{product_id}:
 *   get:
 *     tags:
 *       - stock
 *     summary: Get stock by product_id
 *     description: This route returns the food menu for a specific shop identified by shop_id, with optional filters through query parameters
 *     parameters:
 *       - name: product_id
 *         in: path
 *         required: true
 *         description: The ID of the shop to retrieve the food menu for
 *         schema:
 *           type: string
 *       
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Invalid shop ID
 */


/**
 * @swagger
 * /stock/{id}:
 *   get:
 *     tags:
 *       - stock
 *     summary: Get stock by stock id 
 *     description: This route returns the food menu for a specific shop identified by shop_id
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the shop to retrieve the food menu for
 *         schema:
 *           type: Number
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Invalid stock id
 */

/**
 * @swagger
 * /stock:
 *   post:
 *     tags:
 *       - stock
 *     summary: create stock
 *     description: This is an example route
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "pork"
 *               product_id:
 *                 type: Number
 *                 example: 1
 *               shop_id:
 *                 type: string
 *                 example: "123shop"
 *               stock_quantity:
 *                 type: Number
 *                 example: 0
 *     responses:
 *       200:
 *         description: Success
 */

/**
 * @swagger
 * /stock/{id}:
 *   put:
 *     tags:
 *       - stock
 *     summary: update stock product
 *     description: This is an example route
 *     parameters:
 *       - name: id
 *         in: path
 *         
 *         description: The id of the FoodMenu
 *         schema:
 *           type: Number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
  *               name:
 *                 type: string
 *                 example: "pork"
 *               product_id:
 *                 type: Number
 *                 example: 1
 *               stock_quantity:
 *                 type: Number
 *                 example: 0
 *     responses:
 *       200:
 *         description: Success
 */


router.get('/', async (req, res) => {
    const food = await prisma.stockProduct.findMany()
    res.send(food)
})

router.get('/getByProduct/:shop_id', jwtMiddleware, async (req, res) => {
    const { menutype } = req.query;
    const shopId = req.params.shop_id;

    if (shopId && menutype) {
        // ดึงข้อมูลที่ตรงทั้ง shop_id และ TypeID
        const food = await prisma.stockProduct.findMany({
            where: { shop_id: shopId, TypeID: parseInt(menutype) }
        });
        res.send(food);
    } else if (shopId) {
        // ดึงข้อมูลตาม shop_id เท่านั้นหาก menutype ไม่มีค่า
        const food = await prisma.stockProduct.findMany({
            where: { shop_id: shopId }
        });
        res.send(food);
    } else {
        // กรณีที่ไม่มีค่า shopId ส่งกลับข้อความผิดพลาด
        res.status(400).send({ error: 'shop_id is required' });
    }
});

router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const result = await prisma.stockProduct.findUnique({ where: { id:id } })
        res.send(result)
    } catch (error) {
        res.status(500).send({
            error: error.message || 'An unknown error occurred',
        });
    }
})

router.post('/', async (req, res) => {
    try {
        const result = await prisma.stockProduct.create({ data: req.body })
        if (result) {
            res.send(result)
        }
    } catch (error) {
        res.status(500).send({
            error: error.message || 'An unknown error occurred',
        });
    }
})

router.put('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const result = await prisma.stockProduct.update({
            where: { id: id },
            data: req.body,
        });

        res.status(200).send(result);
    } catch (error) {
        res.status(500).send({
            msg: 'Failed to update food menu',
            error: error.message || 'An unknown error occurred',
        });
    }
});

router.delete('/:id', jwtMiddleware, async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const result = await prisma.stockProduct.delete({ where: { id: id } })
        if (result) {
            res.send({ data: result, msg: 'deleted foodMenu' })
        }
    } catch (error) {
        res.status(500).send({
            msg: 'Failed to delete food menu',
            error: error.message || 'An unknown error occurred',
        });
    }
})

module.exports = router;
