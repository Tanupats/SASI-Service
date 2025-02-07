var express = require("express");
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
/**
 * @swagger
 * /report/count-order-type:
 *   get:
 *     tags:
 *       - report
 *     summary: getReportByOrderType 
 *     description: get all today 
 *     responses:
 *       200:
 *         description: Success
 */
/**/

router.get('/count-order-type', async (req, res) => {
  // วันที่เริ่มต้นของวันปัจจุบัน (เวลา 00:00)
  const { startDate } = req.query;
  // แปลง startDate และ endDate จาก string เป็น Date
  const start = new Date(startDate);
  const end = new Date(startDate);

  // ตั้งค่าเวลาเป็น 00:00 สำหรับ startDate และสิ้นสุดที่ 23:59:59 สำหรับ endDate
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  // นับจำนวนและคำนวณยอดขายรวมในแต่ละประเภท
  const dineInResult = await prisma.bills.aggregate({
    _count: true,
    _sum: {
      amount: true
    },
    where: {
      ordertype: 'เสิร์ฟในร้าน',
      Date_times: {
        gte: start, // ตั้งแต่ startDate เวลา 00:00
        lte: end // จนถึง endDate เวลา 23:59:59
      }
    }
  });

  const takeawayResult = await prisma.bills.aggregate({
    _count: true,
    _sum: {
      amount: true
    },
    where: {
      ordertype: 'สั่งกลับบ้าน',
      Date_times: {
        gte: start, // ตั้งแต่วันนี้เวลา 00:00
        lt: end // จนถึงก่อนวันพรุ่งนี้เวลา 00:00
      }
    }
  });

  const pickupResult = await prisma.bills.aggregate({
    _count: true,
    _sum: {
      amount: true
    },
    where: {
      ordertype: 'รับเอง',
      Date_times: {
        gte: start, // ตั้งแต่วันนี้เวลา 00:00
        lt: end // จนถึงก่อนวันพรุ่งนี้เวลา 00:00
      }
    }
  });

  // คำนวณผลรวมทั้งหมด
  const totalCount = dineInResult._count + takeawayResult._count + pickupResult._count;
  const totalAmount = (parseInt(dineInResult._sum.amount)  ) + (parseInt(takeawayResult._sum.amount) ) + (parseInt(pickupResult._sum.amount) );

  // ส่งผลลัพธ์กลับ
  res.send({
    dineInCount: dineInResult._count,
    dineInTotalAmount:  parseInt( dineInResult._sum.amount || 0),
    takeawayCount: parseInt( takeawayResult._count) ,
    takeawayTotalAmount: takeawayResult._sum.amount || 0,
    pickupCount: pickupResult._count,
    pickupTotalAmount: pickupResult._sum.amount || 0,
    totalCount,
    totalAmount
  });
});

module.exports = router;
