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
const dayjs = require('dayjs');
router.get('/reportByMounth',jwtMiddleware, async (req, res) => {
    try {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

        const result = await prisma.bills.aggregate({
            _sum: {
                amount: true,
            },
            where: {
                Date_times: {
                    gte: startOfMonth,
                    lte: endOfMonth,
                },
            },
        });

        res.send({ totalAmount: parseFloat(result._sum.amount) });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving monthly sales total");
    }
});


router.post('/searchByDate',jwtMiddleware, async (req, res) => {
    let { startDate} = req.body;

    // กำหนดช่วงเวลาให้ครอบคลุมทั้งวันสำหรับ startDate และ endDate
    const startOfDay = dayjs(startDate).startOf('day').toDate();
    const endOfDay = dayjs(startDate).endOf('day').toDate();

    try {
        // ดึงข้อมูลบิลทั้งหมดในช่วงวันที่
        const bills = await prisma.bills.findMany({
            where: {
                Date_times: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
        });

        // คำนวณยอดรวมของ amount ในช่วงวันที่เดียวกัน
        const totalAmount = await prisma.bills.aggregate({
            _count: true,
            _sum: {
                amount: true,
            },
            where: {
                Date_times: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
        });

        res.send({
            total_bill: totalAmount?._count,
            data: bills,
            total: totalAmount?._sum?.amount || 0
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving monthly sales total");
    }
});


router.get('', jwtMiddleware, async (req, res) => {
    const { status, shop_id, sortBy, sortOrder } = req.query;
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    try {
        // Prepare the order by condition
        const orderBy = sortBy && sortOrder 
            ? { [sortBy]: sortOrder.toLowerCase() === 'desc' ? 'desc' : 'asc' }
            : undefined;

        const whereCondition = {
            Date_times: {
                gte: startOfDay,
                lte: endOfDay
            },
            shop_id: shop_id,
            ...(status && { statusOrder: status }) // Add status if it exists
        };

        const result = await prisma.bills.findMany({
            where: whereCondition,
            orderBy: orderBy
        });

        if (result) {
            res.send(result);
        } else {
            res.status(404).send({ message: 'No records found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'An error occurred while fetching the data' });
    }
});



router.get('/myorder', async (req, res) => {
    const { messengerId } = req.query;
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    const result = await prisma.bills.findMany({
        where: {
            Date_times: {
                gte: startOfDay,
                lte: endOfDay
            },
            messengerId: messengerId
        }
    });
    if (result) {
        res.send(result);
    }

});


router.post('', jwtMiddleware,async (req, res) => {
    console.log(req.body)
    try {
        const result = await prisma.bills.create({ data: req.body })
        if (result) {
            res.send(result)
        }
    } catch (error) {
        res.status(500).send({ error: "Error", details: error.message });
    }
})

router.put('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const result = await prisma.bills.update({ where: { id: id }, data: req.body })
    if (result) {
        res.send(result)
    }
})

router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const result = await prisma.bills.delete({ where: { id: id } })
    if (result) {
        res.send(result)
    }
})

/**
 * @swagger
 * /bills:
 *   get:
 *     tags:
 *       - Bills
 *     summary: GetAllBills
 *     description: This is an example route
 *     responses:
 *       200:
 *         description: Success
 *
 */

/**
 * @swagger
 * /bills/searchByDate:
 *   post:
 *     tags:
 *       - Bills
 *     summary: get bills form date 
 *     description: This is an example route
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startDate:
 *                 type: string
 *                 example: "2024-11-07"
 *               endDate:
 *                 type: string
 *                 example: "2024-11-07"             
 *     responses:
 *       200:
 *         description: Success
 */


/**
 * @swagger
 * /bills/reportByMounth:
 *   get:
 *     tags:
 *       - Bills
 *     summary: reportByMounth
 *     description: 
 *     responses:
 *       200:
 *         description: Success
 *
 */
/**
 * @swagger
 * /bills/{id}:
 *   delete:
 *     tags:
 *       - Bills
 *     summary: DelteBilssById
 *     description: This is an example route
 *     parameters:
 *       - name: id
 *         in: path
 *         
 *         description: The id of the bills
 *         schema:
 *           type: Number
 *     responses:
 *       200:
 *         description: Success
 *
 */

module.exports = router;