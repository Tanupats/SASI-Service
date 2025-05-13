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
 * 
/**
 * @swagger
 * /foodmenu/getByShop/{shop_id}:
 *   get:
 *     tags:
 *       - Food Menu
 *     summary: Get food menu by shop
 *     description: This route returns the food menu for a specific shop identified by shop_id, with optional filters through query parameters
 *     parameters:
 *       - name: shop_id
 *         in: path
 *         required: true
 *         description: The ID of the shop to retrieve the food menu for
 *         schema:
 *           type: string
 *       - name: menutype
 *         in: query
 *         required: false
 *         description: The category of food to filter the menu (optional)
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
 * /foodmenu/{type_id}:
 *   get:
 *     tags:
 *       - Food Menu
 *     summary: Get food menu by MenuType 
 *     description: This route returns the food menu for a specific shop identified by shop_id
 *     parameters:
 *       - name: type_id
 *         in: path
 *         required: true
 *         description: The ID of the shop to retrieve the food menu for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Invalid shop ID
 */

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

/**
 * @swagger
 * /foodmenu/{id}:
 *   put:
 *     tags:
 *       - Food Menu
 *     summary: updateFoodMenu
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
 *               shop_id:
 *                 type: string
 *                 
 *     responses:
 *       200:
 *         description: Success
 */


router.get('/', async (req, res) => {
    const food = await prisma.foodmenu.findMany()
    res.send(food)
})

router.get('/getByShop/:shop_id', jwtMiddleware, async (req, res) => {
    const { menutype } = req.query;
    const shopId = req.params.shop_id;

    if (shopId && menutype) {
        // ดึงข้อมูลที่ตรงทั้ง shop_id และ TypeID
        const food = await prisma.foodmenu.findMany({
            where: { shop_id: shopId, TypeID: parseInt(menutype) }
        });
        res.send(food);
    } else if (shopId) {
        const limit = parseInt(req.query.limit) || 10; // จำนวนรายการที่ต้องการ เช่น 10
        const offset = parseInt(req.query.offset) || 0; // เริ่มที่รายการที่เท่าไร เช่น 0
        const food = await prisma.foodmenu.findMany({
          where: { shop_id: shopId },
          skip: offset,
          take: limit,
        });
        res.send(food);
    } else {
        // กรณีที่ไม่มีค่า shopId ส่งกลับข้อความผิดพลาด
        res.status(400).send({ error: 'shop_id is required' });
    }
});

//ดึงเมนูจากร้านค้า
router.get('/shop/:shop_id', async (req, res) => {
    const { menutype } = req.query;
    const shopId = req.params.shop_id;

    if (shopId && menutype) {
        // ดึงข้อมูลที่ตรงทั้ง shop_id และ TypeID
        const food = await prisma.foodmenu.findMany({
            where: { shop_id: shopId, TypeID: parseInt(menutype) }
        });
        res.send(food);
    } else if (shopId) {
        // ดึงข้อมูลตาม shop_id เท่านั้นหาก menutype ไม่มีค่า
        const food = await prisma.foodmenu.findMany({
            where: { shop_id: shopId }
        });
        res.send(food);
    } else {
        // กรณีที่ไม่มีค่า shopId ส่งกลับข้อความผิดพลาด
        res.status(400).send({ error: 'shop_id is required' });
    }
});

router.get('/:type_id', async (req, res) => {
    const food = await prisma.foodmenu.findMany({ where: { TypeID: parseInt(req.params.type_id) } })
    res.send(food);
})

router.post('/', jwtMiddleware, async (req, res) => {
    try {
        const result = await prisma.foodmenu.create({ data: req.body })
        if (result) {
            res.send(result)
        }
    } catch (error) {
        res.status(500).send({
            msg: 'Failed to create food menu',
            error: error.message || 'An unknown error occurred',
        });
    }
})

router.put('/:id', jwtMiddleware, async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const result = await prisma.foodmenu.update({
            where: { id: id },
            data: req.body,
        });

        res.status(200).send({ data: result, msg: 'Updated food menu successfully' });
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
        const result = await prisma.foodmenu.delete({ where: { id: id } })
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
