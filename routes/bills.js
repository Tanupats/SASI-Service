var express = require("express");
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('', async (req, res) => {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    
    const result = await prisma.bills.findMany({
        where: {
            Date_times: {
                gte: startOfDay,
                lte: endOfDay
            }
        }
    });

    if(result){
         res.send(result);
    }
});

router.post('', async (req, res) => {
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

router.put('', async (req, res) => {
    const result = await prisma.bills.update({ where: { id: req.params.id }, data: req.body })
    if (result) {
        res.send(result)
    }
})

router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const result = await prisma.bills.delete({ where: { id: id }})
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