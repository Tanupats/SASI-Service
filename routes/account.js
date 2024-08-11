var express = require("express");
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


router.get('', async (req, res) => {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const result = await prisma.account.findMany({
        where: {
            date_account: {
                gte: startOfDay.toISOString(),
                lte: endOfDay.toISOString()
            }
        },
    });

    if (result.length > 0) {
        res.send(result);
    } else {
        res.send([]);
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
        },
    });
    res.send(result)
})

router.post('/', async (req, res) => {
    const ressult = await prisma.account.create({ data: req.body })
    if (ressult) {
        res.send(ressult)
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
        res.status(500).send({ error: "Error deleting account", details: error.message });
    }
});

module.exports = router;