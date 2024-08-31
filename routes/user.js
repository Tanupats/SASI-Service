var express = require("express");
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
/**
 * @swagger
 * /user:
 *   get:
 *     tags:
 *       - users
 *     summary: getusers
 *     description: This is an example route
 *     responses:
 *       200:
 *         description: Success
 */
/**/

router.get('/', async (req, res) => {
    const result = await prisma.users.findMany()
    if (result) {
        res.send(result);
    }
})

module.exports = router;