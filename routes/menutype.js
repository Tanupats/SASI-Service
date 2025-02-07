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
 * /menutype/{shop_id}:
 *   get:
 *     tags:
 *       - MenuType
 *     summary: Get MenuType by ShopId 
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
/**
 * @swagger
 * /menutype:
 *   get:
 *     tags:
 *       - MenuType
 *     summary: Get all MenuType 
 *     description: This route returns the food menu for a specific shop identified by shop_id
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Invalid shop ID
 */
/**
 * @swagger
 * /menutype:
 *   post:
 *     tags:
 *       - MenuType
 *     summary: create Menutype
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
 *                 example: "ข้าวผัด"
 *               shop_id:
 *                 type: string
 *                 example: ""
 *             
 *     responses:
 *       200:
 *         description: Success
 */
/**
/**
 * @swagger
 * /menutype/{id}:
 *   put:
 *     tags:
 *       - MenuType
 *     summary: update Menutype
 *     description: menutype
 *     parameters:
 *       - name: id
 *         in: path
 *         
 *         description: The id of the menutype
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
 *                 example: ""
 *             
 *     responses:
 *       200:
 *         description: Success
 */
/**
 * @swagger
 * /menutype/{id}:
 *   delete:
 *     tags:
 *       - MenuType
 *     summary: Delte menutype ById
 *     description: This is an example route
 *     parameters:
 *       - name: id
 *         in: path
 *         
 *         description: The id of the MenuType
 *         schema:
 *           type: Number
 *     responses:
 *       200:
 *         description: Success
 *
 */

router.post('', jwtMiddleware, async (req, res) => {
    const result = await prisma.menu_type.create({ data: req.body });
    if (result) {
        res.send(result)
    }
});

router.delete('/:id', jwtMiddleware, async (req, res) => {
    const result = await prisma.menu_type.delete({ where: { id: parseInt(req.params.id) } });
    if (result) {
        res.send(result)
    }
});

router.get('', async (req, res) => {
    const result = await prisma.menu_type.findMany();
    res.send(result)
});

router.get('/:shop_id', jwtMiddleware, async (req, res) => {
    const shopId = req.params.shop_id;
    const result = await prisma.menu_type.findMany({ where: { shop_id: shopId } });

    res.send(result)

});

router.put('/:id', jwtMiddleware, async (req, res) => {
    const shopId = parseInt(req.params.id);
    try {
        const result = await prisma.menu_type.update({
            where: { id: shopId },
            data: req.body, // ตรวจสอบให้แน่ใจว่า `req.body` มีข้อมูลที่ถูกต้อง
        });

        res.status(200).send({
            data: result,
            msg: 'Menu type updated successfully',
        });
    } catch (error) {
        res.status(500).send({
            msg: 'Failed to update menu type',
            error: error.message || 'An unknown error occurred',
        });
    }
});





module.exports = router;