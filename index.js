const express = require("express");
let cors = require("cors");
const fs = require('fs');
const app = express();
app.use(cors());
app.use(express.json());
app.use('/files', express.static('files'));
var postRouter = require('./routes/foodmenu.js');
var accountRouter = require('./routes/account.js');
var menuTypeRouter = require('./routes/menutype.js');
var shopRouter = require('./routes/shop.js');
var userRounter = require('./routes/user.js');
app.use('/foodmenu', postRouter);
app.use('/account', accountRouter);
app.use('/menutype', menuTypeRouter);
app.use('/shop', shopRouter);
app.use('/bills', require('./routes/bills.js'));
app.use('/billsdetails', require('./routes/billsdetails.js'));
app.use('/user', userRounter);

const { swaggerUi, swaggerSpec } = require('./swagger');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
const multer = require('multer');
const path = require('path');
let uniqueName="";
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
require("dotenv").config()
const port = process.env.PORT;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secretKey = process.env.ACCESS_TOKEN_SECRET;

async function hashPassword(password) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}


const validateJwt = async (apikey) => {
    const { userId } = await jwt.verify(apikey, secretKey);
    if (userId !== null) {
        console.log(userId)
        return { msg: 'Authen OK', status: true }
    }
}

// API สำหรับการอัพโหลดไฟล์
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    res.send({filename:uniqueName});
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

app.post('/auth/signin', async (req, res) => {
    //email and password
    const email = req.body.email
    const password = req.body.password

    //find user exist or not
    const user = await prisma.users.findFirst({ where: { email: email } })

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



app.get('/auth', async (req, res) => {
    const resPonse = await validateJwt(req.headers.apikey)
    res.send(resPonse)
})

app.get('/', (req, res) => {
    res.send({ message: "HELLO SASI API" })
})


app.listen(port, () => {
    console.log("server runnig is port ", port);
});
