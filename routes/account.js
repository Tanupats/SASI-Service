var express = require("express");
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const dayjs = require('dayjs');

router.get('', async (req, res) => {
    // รับวันที่จาก query parameter
    const dateParam = req.query.date;

    // ถ้ามีการส่งวันที่เข้ามาให้ใช้วันที่นั้น หากไม่ให้ใช้วันที่ปัจจุบัน
    const date = dateParam ? new Date(dateParam) : new Date();
    const startOfDay = dayjs(date).startOf('day').toDate();
    const endOfDay = dayjs(date).endOf('day').toDate();

    try {
        // ใช้ Prisma เพื่อค้นหาข้อมูล
        const result = await prisma.account.findMany({
            where: {
                date_account: {
                    gte: startOfDay,
                    lte: endOfDay
                },
                shop_id: req.query.shop_id
            },
        });

        // ส่งผลลัพธ์กลับไป
        res.send(result.length > 0 ? result : []);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'An error occurred while fetching data.' });
    }
});

router.get('/outcome', async (req, res) => {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    const result = await prisma.account.aggregate({
        _sum: {
            total: true,
        },
        where: {
            date_account: {
                gte: startOfDay,
                lte: endOfDay,
            },
            shop_id: req.query.shop_id
        },
    });
    res.send(result)
})

//รายจ่ายวันที่ปัจจุบัน
router.get('/outcome-mounth', async (req, res) => {
    // วันที่ปัจจุบัน
    const today = new Date();

    // วันที่เริ่มต้นของเดือนปัจจุบัน
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // วันที่สิ้นสุดของเดือนปัจจุบัน
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

    try {
        const result = await prisma.account.aggregate({
            _sum: {
                total: true, // คำนวณผลรวมของฟิลด์ total
            },
            where: {
                date_account: {
                    gte: startOfMonth, // มากกว่าหรือเท่ากับวันที่เริ่มต้นของเดือน
                    lte: endOfMonth,   // น้อยกว่าหรือเท่ากับวันที่สิ้นสุดของเดือน
                },
                shop_id: req.query.shop_id
            },
        });

        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'An error occurred while fetching data.' });
    }
});

//สรุปรายการสั่งซื้อบ่อย 
router.get('/report', async (req, res) => {

    const today = new Date();

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

    try {
        const rawData = await prisma.account.groupBy({
            by: ['listname'], // จัดกลุ่มตาม listname
            _sum: {
                quantity: true, // รวมค่า quantity ในแต่ละกลุ่ม
            },
            where: {
                date_account: {
                    gte: startOfMonth, // กรองข้อมูลตั้งแต่ต้นเดือน
                    lte: endOfMonth,   // กรองข้อมูลจนถึงสิ้นเดือน
                },
            },
        });

        //ปรับข้อมูลให้อยู่ในรูปแบบที่ต้องการ
        const formattedData = rawData.map(item => ({
            listname: item.listname,
            count: item._sum.quantity || 0, // รวมค่า quantity ในแต่ละ listname (แทน null ด้วย 0)
        }));

        // ส่งผลลัพธ์กลับ
        res.send(formattedData);

    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'An error occurred while fetching data.' });
    }
});


router.post('/', async (req, res) => {
    const ressult = await prisma.account.create({ data: req.body })
    if (ressult) {
        res.send(ressult)
    }
})

router.put('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const ressult = await prisma.account.update({ where: { account_id: id }, data: req.body })
        if (ressult) {
            res.send(ressult)
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }

})

router.delete('/:id', async (req, res) => {
    try {
        const accountId = parseInt(req.params.id, 10); // ตรวจสอบให้แน่ใจว่าค่า id เป็นตัวเลข
        const result = await prisma.account.delete({
            where: {
                account_id: accountId
            }
        });
        res.send({ message: "deleted", data: result });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

/**
 * @swagger
 * /account/report:
 *   get:
 *     tags:
 *       - Account
 *     summary: สรุปรายการสั่งซื้อรายเดือน
 *     description: ข้อมูลเดือนปัจจุบัน
 *     responses:
 *       200:
 *         description: Success
 *
 */

module.exports = router;