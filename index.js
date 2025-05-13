const express = require("express");
let cors = require("cors");
const fs = require('fs');
const app = express();

// ตั้งค่า CORS แบบเจาะจง origin
const corsOptions = {
  origin: "*", // หรือใช้ array ได้ถ้ามีหลายโดเมน
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
};

app.use(cors(corsOptions));

// ให้รองรับ preflight request
app.options("*", cors(corsOptions));
app.use(express.json());
app.use('/files', express.static('files'));
var postRouter = require('./routes/foodmenu.js');
var accountRouter = require('./routes/account.js');
var menuTypeRouter = require('./routes/menutype.js');
var shopRouter = require('./routes/shop.js');
var userRounter = require('./routes/user.js');
var reportRounter = require('./routes/report.js');
app.use('/foodmenu', postRouter);
app.use('/account', accountRouter);
app.use('/menutype', menuTypeRouter);
app.use('/shop', shopRouter);
app.use('/bills', require('./routes/bills.js'));
app.use('/billsdetails', require('./routes/billsdetails.js'));
app.use('/user', userRounter);
app.use('/report', reportRounter);
app.use('/stock', require('./routes/stock.js'));

app.set('view engine', 'ejs');
const { swaggerUi, swaggerSpec } = require('./swagger');
const validateJwt = require("./libs/validationJWT.js");
require("dotenv").config()

const swaggerOptions = {
  swaggerOptions: {
    spec: swaggerSpec,
    requestInterceptor: (request) => {
      const token = localStorage.getItem("token"); // Get the token from localStorage
      if (token) {
        request.headers["apikey"] = `${token}`; // Set the token in headers
        return request;

      } else {
        window.location.href = '/';

      }

    },
  },
};

app.use('/documents', swaggerUi.serve, swaggerUi.setup(null, swaggerOptions));
const multer = require('multer');
const path = require('path');
let uniqueName = "";
// ตั้งค่า Multer สำหรับการจัดการไฟล์
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'files'); // ตั้งค่าที่เก็บไฟล์
  },
  filename: function (req, file, cb) {
    uniqueName = Date.now() + path.extname(file.originalname); // ตั้งชื่อไฟล์
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const port = process.env.PORT;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secretKey = process.env.ACCESS_TOKEN_SECRET;

async function hashPassword(password) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

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
 * /user/me:
 *   get:
 *     tags:
 *       - auth
 *     summary: get user profile
 *     description: user profile
 *     responses:
 *       200:
 *         description: Success
 *
 */


// API สำหรับการอัพโหลดไฟล์
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.send({ filename: uniqueName });
});

// API สำหรับการดึงไฟล์ภาพ
app.get('/images/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'files', req.params.filename);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('Image not found.');
  }
});


app.post('/auth/sigup', async (req, res) => {
  const { name, email, password, department } = req.body;
  const hasassword = await hashPassword(password);

  let body = { name: name, email: email, password: hasassword, department: department }
  const result = await prisma.users.create({ data: body })
  if (result) {
    res.send(result);
  }
})

app.get('/migrate', async (req, res) => {
  try {
    const result = await prisma.$queryRaw`SELECT * FROM _prisma_migrations`;
    const serializedResult = result.map(row => {
      return Object.fromEntries(
        Object.entries(row).map(([key, value]) =>
          typeof value === 'bigint' ? [key, value.toString()] : [key, value]
        )
      );
    });
    res.json(serializedResult);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


app.post('/auth/signin', async (req, res) => {
  //email and password
  const email = req.body.email
  const password = req.body.password

  //find user exist or not
  const user = await prisma.users.findFirst({ where: { email: email } })
  console.log(user)
  //if user not exist than return status 400
  if (!user) {
    return res.status(400).json({ msg: "User not exist" })
  }

  bcrypt.compare(password, user.password, async (err, data) => {
    if (err) throw err
    if (data) {
      const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '24h' });
      return res.status(200).json({ msg: "Login success", token: token, ...user })
    } else {
      return res.status(401).json({ msg: "Invalid credencial" })
    }
  })
})


app.get('/user/me', async (req, res) => {
  const resPonse = await validateJwt(req.headers.apikey);
  const user = await prisma.users.findFirst({ where: { id: resPonse.userId } });
  const shop = await prisma.shop.findFirst({ where: { user_id: String(resPonse.userId) } });
  if (user) {
    res.send({ ...user, shop });
  }
})



app.get('/queues', async (req, res) => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  try {
    const getQueu = await prisma.bills.findMany({
      where: {
        statusOrder: "รับออเดอร์แล้ว",
        Date_times: {
          gte: startOfDay,
          lte: endOfDay,
        }
      }
    });

    res.send({ queues: getQueu?.length || 0 });
  } catch (error) {
    res.status(500).send({ error: 'An error occurred' });
  }
});

app.get('/queueNumber', async (req, res) => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  try {
    const getQueu = await prisma.bills.findMany({
      where: {
        Date_times: {
          gte: startOfDay,
          lte: endOfDay,
        }
      }
    });

    res.send({ queueNumber: getQueu?.length + 1 });
  } catch (error) {
    res.status(500).send({ error: 'An error occurred' });
  }
});

app.get('/', (req, res) => {
  res.render('login', { message: null });

})

/**
 * @swagger
 * /users:
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

app.get('/users', jwtMiddleware, async (req, res) => {
  const result = await prisma.users.findMany()
  if (result) {
    res.send(result);
  }
})

async function startServer() {
  try {
    app.listen(port, () => {
      console.log("server runnig is port ", port);
    });
    // ทดสอบการเชื่อมต่อฐานข้อมูล
    await prisma.$connect();
    console.log("✅ Connected to the database successfully");

  } catch (error) {
    console.error("❌ Failed to connect to the database:", error);
    process.exit(1); // ปิดโปรแกรมถ้าเชื่อมไม่ได้
  }
}

startServer();
