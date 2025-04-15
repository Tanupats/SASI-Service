var express = require("express");
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/:id', async (req, res) => {
    try {

        const result = await prisma.billsdetail.findMany({ where: { bills_id: req.params.id } })
        if (result) {
            res.send(result)
        }

    } catch (error) {
        res.status(500).send({ error: "Error", details: error.message });
    }
})

router.post('', async (req, res) => {
    console.log(req.body)
    try {

        const result = await prisma.billsdetail.create({ data: req.body })
        if (result) {
            res.send(result)
        }

    } catch (error) {
        res.status(500).send({ error: "Error", details: error.message });
    }

})

router.put('/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    const result = await prisma.billsdetail.update({ where: { id: id }, data: req.body })
    if (result) {
        res.send(result)
    }
})

router.delete('/:bills_id', async (req, res) => {
    const id = req.params.bills_id
    const result = await prisma.billsdetail.deleteMany({ where: { bills_id: id } })
    if (result) {
        res.send(result)
    }
})

router.delete('/remove/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    try {
        const result = await prisma.billsdetail.delete({ where: { id: id } })
        if (result) {
            res.send(result)
        }
    } catch (error) {
        res.status(500).send({ error: "Error", details: error.message });
    }

})

/**
 * @swagger
 * /billsdetails/{billId}:
 *   get:
 *     tags:
 *       - Bills details
 *     summary: getBissDetails
 *     description: This is an example route
 *     parameters:
 *       - name: billId
 *         in: path
 *         required: true
 *         description: The ID of the bill
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *
 */
/**
 * @swagger
 * /billsdetails/{billId}:
 *   delete:
 *     tags:
 *       - Bills details
 *     summary: DelteBilssDetailById
 *     description: This is an example route
 *     parameters:
 *       - name: billId
 *         in: path
 *        
 *         description: The bills_id of the Bills details
 *         schema:
 *           type: String
 *     responses:
 *       200:
 *         description: Success
 *
 */
/**
 * @swagger
 * /billsdetails/remove/{id}:
 *   delete:
 *     tags:
 *       - Bills details
 *     summary: Delte BilssDetail ById
 *     description: This is an example route
 *     parameters:
 *       - name: id
 *         in: path
 *        
 *         description: The id of the Bills details
 *         schema:
 *           type: Number
 *     responses:
 *       200:
 *         description: Success
 *
 */

module.exports = router;