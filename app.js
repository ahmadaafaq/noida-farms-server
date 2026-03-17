// all imports will be here 
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import express from 'express';
import moment from 'moment-timezone';
import mongoose from 'mongoose';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import sharp from 'sharp';
// import bodyParser from 'body-parser';
import PDFDocument from 'pdfkit';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import admin from 'firebase-admin';
import './UserDetails.js';
// import { adminSet, buildAdminRouter } from "./config/setup.js";
const router = express.Router();
import { fileURLToPath } from "url";
import * as AdminJSExpress from "@adminjs/express";
import * as AdminJSMongoose from "@adminjs/mongoose";
import session from "express-session";
// import MongoDBStore from "connect-mongodb-session";
import MongoStore from "connect-mongo";

import AdminJS from "adminjs";
import { dark, light, noSidebar } from "@adminjs/themes";
// import MongoStore from 'connect-mongo';
let serviceAccount = null;
try {
  const accountModule = await import('./noidaFarmsNotificationKey.json', { with: { type: 'json' } });
  serviceAccount = accountModule.default;
} catch (error) {
  console.log('⚠️ noidaFarmsNotificationKey.json not found. Notifications/Firebase Admin might fail if not configured via ENV.');
}
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Register the adapter once
AdminJS.registerAdapter(AdminJSMongoose);


const JWT_SECRET =
  'hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jdsds039[]]pou89ywe';
// const JWT_SECRET = process.env.JWT_SECRET;
const app = express();
app.use(cors());

// ✅ Global safety net – stops MongoDB / session DNS errors from crashing the process
process.on('unhandledRejection', (reason) => {
  console.error('⚠️  Unhandled promise rejection (server keeps running):', reason?.message || reason);
});

// ✅ Step 1: Connect to MongoDB
// const mongoUrl = process.env.mongoUrl;
const mongoUrl = 'mongodb+srv://root:GXkg9RvCMEYOw7nY@arogyaa.l0qed.mongodb.net/NoidaFarms';;
mongoose.connect(mongoUrl, { serverSelectionTimeoutMS: 5000 }).then(() => console.log("✅ Database connected")).catch((e) => console.log("❌ Database connection error:", e?.message));

// ✅ Step 2: (Optional) Import models after DB connection
const User = mongoose.model("UserInfo");
const Farmhouse = mongoose.model("FarmHouses");
const Order = mongoose.model("Order");
const Bank_Details = mongoose.model("Bank_Details");
const Transaction = mongoose.model("Transactions");
const AgentAndAdmin = mongoose.model("AgentAndAdmin");
const AuthFlag = mongoose.model("AuthFlag");
const LegalCompliance = mongoose.model("LegalCompliance");

const COOKIE_PASSWORD = process.env.COOKIE_PASSWORD;



// const MongoStore = MongoStore(session);
// const sessionStore = new MongoStore({
//   uri: mongoUrl,
//   collection: "sessions",
// });

const sessionStore = MongoStore.create({
  mongoUrl: mongoUrl,
  collectionName: "sessions",
});

const adminSet = new AdminJS({
  resources: [
    { resource: User },
    { resource: Farmhouse },
    { resource: Order },
    { resource: Bank_Details },
    { resource: Transaction },
    { resource: AgentAndAdmin },
    { resource: AuthFlag },
    { resource: LegalCompliance },
  ],
  rootPath: "/admin",
  pages: {
    SendNotification: {
      label: 'Send Notification',
      component: false, // or true if you use a custom React component
      handler: async (request, response, context) => {
        // this function runs when you call it via API or button
        if (request.method === 'post') {
          const { title, message } = request.payload

          // your logic (example)
          console.log('Notification:', title, message)

          return {
            message: `✅ Notification sent successfully: ${title}`,
          }
        }

        return {
          message: 'Send a notification via POST request',
        }
      },
    },
    BookByAdmin: {
      label: 'Book Farmhouse',
      component: true, // or true if you use a custom React component
      handler: async (request, response, context) => {
        // this function runs when you call it via API or button
        if (request.method === 'post') {
          const { title, message } = request.payload

          // your logic (example)
          console.log('Notification:', title, message)

          return {
            message: `✅ Notification sent successfully: ${title}`,
          }
        }

        return {
          message: 'Send a notification via POST request',
        }
      },
    },
  },
  branding: {
    companyName: "Noida Farms",
    withMadeWithLove: false,
  },
  defaultTheme: dark.id,
  availableThemes: [dark, light, noSidebar],
});

// Authentication for admin panel
const authenticate = async (email, password) => {
  // ✅ Replace this logic with your actual admin login validation
  const admin = await AgentAndAdmin.findOne({ email });
  // if (await bcrypt.compare(password, user.password) return admin;
  const match = await bcrypt.compare(password, admin.password);
  if (match) {
    return admin;
  }
  return null;
};



// Build and mount admin router
const startAdmin = async () => {
  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    adminSet,
    {
      authenticate,
      cookiePassword: COOKIE_PASSWORD,
      cookieName: "adminjs",
    },
    null, // ⚠️ Important - don't inject external middlewares
    {
      resave: false,
      saveUninitialized: false,
      store: sessionStore,
      secret: COOKIE_PASSWORD,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      },
    }
  );

  // ✅ Mount AdminJS BEFORE parsers
  app.use(adminSet.options.rootPath, adminRouter);
};


// ================================
// 🚀 Start Admin & App
// ================================
await startAdmin();

// ================================
// 🧩 Middleware & Logger
// ================================
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ✅ Now add parsers AFTER admin router
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ================================
// 🧩 Test Routes (your APIs go below)
// ================================
app.get("/", (req, res) => {
  res.send({ status: "Server running ✅" });
});

app.get("/ABHISHEK", (req, res) => {
  res.send({ status: "ABHISHEK BHAI HAI KYA 😎" });
});

// Example API
app.post("/api/example", async (req, res) => {
  const data = req.body;
  res.json({ message: "Example API working", data });
});

// ================================
// 🧩 Start Server
// ================================
const PORT = process.env.PORT || 5002;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  console.log(`🛠️ AdminJS at http://localhost:${PORT}${adminSet.options.rootPath}`);
});

// ✅ 2. THEN setup parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));


// ✅ Step 3: Connect to MongoDB
// const mongoUrl = process.env.mongoUrl;
// mongoose
//   .connect(mongoUrl)
//   .then(() => console.log("✅ Database connected"))
//   .catch((e) => console.log("❌ Database connection error:", e));

// ✅ Step 4: Start server
// const PORT = process.env.PORT || 5002;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
//   console.log("✅ NoidaFarms app.js loaded");
// });

// ✅ Step 4: Setup AdminJS AFTER express.json and cors
// const startAdmin = async () => {
//   const adminRouter = await buildAdminRouter();
//   app.use(adminSet.options.rootPath, adminRouter);
// };
// startAdmin();

// ✅ Step 5: Basic test routes
// app.get("/", (req, res) => {
//   res.send({ status: "now it start" });
// });

// app.get("/ABHISHEK", (req, res) => {
//   res.send({ status: "ABHISHEK BHAI HAI KYA" });
// });

// // ✅ Step 6: (Optional) Import models after DB connection
// const User = mongoose.model("UserInfo");
// const Farmhouse = mongoose.model("FarmHouses");
// const Order = mongoose.model("Order");
// const Bank_Details = mongoose.model("Bank_Details");
// const Transaction = mongoose.model("Transactions");
// const AgentAndAdmin = mongoose.model("AgentAndAdmin");
// const AuthFlag = mongoose.model("AuthFlag");
// const LegalCompliance = mongoose.model("LegalCompliance");
// app.use(cors());
// // 1️⃣ Mount AdminJS router first
// // app.use(adminSet.options.rootPath, adminRouter);

// // 2️⃣ Then regular middleware
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ limit: '10mb', extended: true }));

// // app.use(express.json({limit: '10mb'}));
// // app.use(express.urlencoded({limit: '10mb', extended: true}));
// // app.use(bodyParser.json());
// const PORT = process.env.PORT || 5002;
// app.listen(PORT, () => {
//   console.log(`Server running on port: ${PORT}`);
//   console.log("🚀 NEW CODE UPDATED - NoidaFarms app.js loaded");

// });
// const startAdmin = async () => {
//   const adminRouter = await buildAdminRouter();
//   app.use(adminSet.options.rootPath, adminRouter); // ⚠️ must use adminSet, not admin
// };
// startAdmin();

// // startAdmin();
// app.use(express.json());
// // // mongo url to access database
// const mongoUrl =
//   'mongodb+srv://root:GXkg9RvCMEYOw7nY@arogyaa.l0qed.mongodb.net/NoidaFarms';
// // // secret key
// const JWT_SECRET =
//   'hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jdsds039[]]pou89ywe';
// // to connect mongoose use this step
// mongoose.connect(mongoUrl).then(() => {console.log('database connceted');}).catch(e => {
//     console.log(e, 'hey');});
// const User = mongoose.model('UserInfo');
// const Farmhouse = mongoose.model('FarmHouses');
// const Order = mongoose.model('Order');
// const Bank_Details = mongoose.model('Bank_Details');
// const Transaction = mongoose.model('Transactions');
// const AgentAndAdmin = mongoose.model('AgentAndAdmin');
// const AuthFlag = mongoose.model('AuthFlag');
// const LegalCompliance = mongoose.model('LegalCompliance');
// app.get('/', (req, res) => {
//   res.send({status: 'now it start'});

// });
// app.get('/ABHISHEK', (req, res) => {
//   res.send({status: 'ABHISHEK BHAI HAI KYA'});
// });

// creating api name:  register

// async function migrateUsers() {
//   try {
//     await mongoose.connect(mongoUrl)
//       .then(() => {
//     console.log('database connceted migration');
//   })

//     const result = await User.updateMany(
//        {},
//       {
//         $set: {
//           role: "user",
//           isActive: true,
//           isBanned: false,
//           isAdult: true,
//         }
//       }
//     );

//     console.log("✅ Migration complete:", result);
//     mongoose.disconnect();
//   } catch (err) {
//     console.error("❌ Migration error:", err);
//   }
// }

// migrateUsers();



app.post('/register', async (req, res) => {
  const { name, lastName, email, phoneNumber, password } = req.body;

  try {
    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (existingUser) {
      const emailExists = existingUser.email === email;
      const phoneExists = existingUser.phoneNumber === phoneNumber;

      let message = '';
      if (emailExists && phoneExists) {
        message = 'Email and phone number already exist';
      } else if (emailExists) {
        message = 'Email already exists';
      } else if (phoneExists) {
        message = 'Phone number already exists';
      }
      return res.status(400).send({ status: 'error', message });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      name,
      lastName,
      email,
      phoneNumber,
      password: hashedPassword,
    });
    return res.send({ status: 'ok', message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 11000 && error.keyPattern) {
      const fields = Object.keys(error.keyPattern);
      let message = '';
      if (fields.includes('email') && fields.includes('phoneNumber')) {
        message = 'Email and phone number already exist';
      } else if (fields.includes('email')) {
        message = 'Email already exists';
      } else if (fields.includes('phoneNumber')) {
        message = 'Phone number already exists';
      } else {
        message = 'Duplicate value detected';
      }
      return res.status(400).send({ status: 'error', message });
    }
    return res.status(500).send({ status: 'error', message: 'Server error' });
  }
});


app.post('/login-user', async (req, res) => {
  try {
    const { email, password } = req.body;

    let OldUser = await User.findOne({ email: email });

    // ✅ Check in User collection first
    if (OldUser) {
      const isMatch = await bcrypt.compare(password, OldUser.password);
      if (!isMatch) {
        return res.status(401).send({
          status: 'PasswordInvalid',
          data: 'Invalid password!',
        });
      }

      const token = jwt.sign({ email }, JWT_SECRET);
      return res.status(201).send({
        status: 'ok',
        data: {
          token,
          UserID: OldUser._id,
          userType: 'user',
          UserAllDetails: OldUser,
        },
      });
    }

    // ✅ If not found in User, check Admin/Agent collection
    OldUser = await AgentAndAdmin.findOne({ email: email });
    if (!OldUser) {
      return res.status(404).send({
        status: 'NotFoundEmail',
        data: 'User/Admin not found. Please check your email ID.',
      });
    }

    const isMatch = await bcrypt.compare(password, OldUser.password);
    if (!isMatch) {
      return res.status(401).send({
        status: 'PasswordInvalid',
        data: 'Invalid password!',
      });
    }

    const token = jwt.sign({ email }, JWT_SECRET);
    return res.status(201).send({
      status: 'ok',
      data: {
        token,
        UserID: OldUser._id,
        userType: 'admin', // You can also store role inside OldUser.role if needed
        UserAllDetails: OldUser,
      },
    });

  } catch (err) {
    console.error(err);
    return res.status(500).send({
      status: 'error',
      data: 'Something went wrong. Please try again later.',
    });
  }
});


// code for get data 'userdata' from database and api
app.post('/userdata', async (req, res) => {
  const { token } = req.body;
  // console.log('we are inside getdata api 1',token);
  try {
    // console.log("we are inside try of getdata api 2")
    const user = jwt.verify(token, JWT_SECRET);
    // console.log("we are inside try of getdata api 2",user.phoneNumber)
    const useremail = user.email;
    // const mobile = user.mobile;
    const usermobile = user.phoneNumber;
    // console.log(useremail ,'1')
    // console.log(usermobile , '2')
    if (useremail) {
      // console.log(useremail, '3')
      User.findOne({ email: useremail }).then(data => {
        // console.log(data.data)
        return res.send({ status: 'ok', data: data });
        // console.log('we are inside try of getdata api 3');
      });

    }
    if (usermobile) {
      // console.log(usermobile, '4')
      User.findOne({ phoneNumber: usermobile }).then(data => {
        // console.log(data.data)
        return res.send({ status: 'ok', data: data });
        // console.log('we are inside try of getdata api 3');
      });

    }
    // User.findOne({email: useremail}).then(data => {
    //   // console.log(data.data)
    //   return res.send({status: 'ok', data: data});
    //   // console.log('we are inside try of getdata api 3');
    // });
  } catch (error) {
    // console.log('we are inside catch of getdata api');
    return res.send({ error: 'error here' });
  }
});
app.post('/update-user', async (req, res) => {
  const { name, lastName, email, phoneNumber, image, gender, address, dob } =
    req.body;
  try {
    await User.updateOne(
      { email: email },
      {
        $set: {
          name, lastName, email, phoneNumber, image, gender, address, dob,
        },
      },
    );
    res.send({ status: 'Ok', data: 'Updated' });
  } catch (error) {
    return res.send({ error: error });
  }
});


// ─── AWS S3 Client ────────────────────────────────────────────────────────────
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const S3_BUCKET = process.env.AWS_S3_BUCKET;
const S3_REGION = process.env.AWS_REGION || 'ap-south-1';

// ─── Helper: build public S3 URL from a key ───────────────────────────────────
const getS3Url = (key) =>
  `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${key}`;

// ─── Multer-S3 storage for farmhouse images ───────────────────────────────────
// NOTE: No `acl` option — modern S3 buckets have ACLs disabled by default.
// Grant public read via your bucket policy instead (see .env comments).
const farmhouseStorage = multerS3({
  s3: s3Client,
  bucket: S3_BUCKET,
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `farmhouse-images/${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage: farmhouseStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB per file
});

// API route for image upload (farmhouse photos → S3)
app.post("/uploadImages", upload.array("images", 35), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // Each file uploaded by multer-s3 has a `location` field = full public S3 URL
    const imagePaths = req.files.map((file) => ({ uri: file.location }));

    res.status(200).json({
      message: "Images uploaded successfully",
      imagePaths,
    });
  } catch (error) {
    console.error('Upload to S3 failed:', error);
    res.status(500).json({ message: "Error uploading images", error: error.message });
  }
});

// 13/12/2024
// create a new farmhouse
app.post('/createFarmhouse', async (req, res) => {
  const { addressDetails, location, UserID } = req.body;
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const newFarmhouse = new Farmhouse({
      userId: UserID,
      address: {
        houseNumber: addressDetails.houseNumber,
        areaName: addressDetails.areaName,
        city: addressDetails.city,
        state: addressDetails.state,
        pinCode: addressDetails.pinCode,
        country: addressDetails.country,
        coordinates: {
          latitude: location?.latitude,
          longitude: location?.longitude,
        },
      },
    });
    const savedFarmhouse = await newFarmhouse.save();
    res
      .status(201)
      .json({ message: 'Farmhouse created', farmhouseId: savedFarmhouse._id });
  } catch (error) {
    // console.error('Error creating farmhouse:', error);
    res.status(500).json({ message: 'Error creating farmhouse', error });
  }
});
// update farmhouse details
app.patch('/updateFarmhouse/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const updatedFarmhouse = await Farmhouse.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true },
    );

    if (!updatedFarmhouse) {
      return res.status(404).json({ message: 'Farmhouse not found' });
    }

    res
      .status(200)
      .json({ message: 'Farmhouse updated successfully', updatedFarmhouse });
  } catch (error) {
    // console.error('Error updating farmhouse:', error);
    res.status(500).json({ message: 'Error updating farmhouse', error });
  }
});
// finalizing farmhouses
app.patch('/finalizeFarmhouse/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const finalizedFarmhouse = await Farmhouse.findByIdAndUpdate(
      id,
      { $set: { status: 'completed' } },
      { new: true },
    );

    if (!finalizedFarmhouse) {
      return res.status(404).json({ message: 'Farmhouse not found' });
    }
    res
      .status(200)
      .json({ message: 'Farmhouse finalized successfully', finalizedFarmhouse });
  } catch (error) {
    // console.error('Error finalizing farmhouse:', error);
    res.status(500).json({ message: 'Error finalizing farmhouse', error });
  }
});
// ====18/12/2024 this finds all the information about farmhouse and show in last at the time of cinfirmation
app.get('/farmhouse/:id', async (req, res) => {
  const { id } = req.params;
  // console.log('/farmhouse/:id');
  try {
    const farmhouse = await Farmhouse.findById(id);
    if (!farmhouse) {
      return res.status(404).json({ message: 'Farmhouse not found' });
    }
    res
      .status(200)
      .json({ message: 'Farmhouse retrieved successfully', farmhouse });
  } catch (error) {
    // console.error('Error fetching farmhouse details:', error);
    res.status(500).json({ message: 'Error fetching farmhouse details', error });
  }
});
// 23/12/2-24
// get all user accounts
app.get('/AllUsers', async (req, res) => {
  // console.log('inside Axios');
  try {
    const users = await User.find();
    // console.log('Fetched users:', users);
    res
      .status(200)
      .json({ message: 'Users retrieved successfully', data: users });
  } catch (error) {
    // console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error });
  }
});
// find all farmhouse in admin and home
app.get('/farmhouses', async (req, res) => {
  try {
    // console.log('farmhouses admin')
    // Fetch all farmhouses
    const farmhouses = await Farmhouse.find().sort({ createdAt: -1 });
    // Respond with the farmhouse data
    res.status(200).json({
      message: 'Farmhouses fetched successfully',
      data: farmhouses,
    });
  } catch (error) {
    // console.error('Error fetching farmhouses:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
});

// find all farmhouse in home that is appproved
app.get('/farmhousesForHome', async (req, res) => {
  try {
    // console.log('farmhouses admin')
    // Fetch all farmhouses
    const farmhouses = await Farmhouse.find({ status: 'completed' }).sort({
      createdAt: -1,
    });
    // Respond with the farmhouse data
    res.status(200).json({
      message: 'Farmhouses fetched successfully',
      data: farmhouses,
    });
  } catch (error) {
    // console.error('Error fetching farmhouses:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
});
app.get('/farmhousesById', async (req, res) => {
  try {
    // console.log('farmhousesById');
    const { userId } = req.query;
    const query = userId ? { userId } : {};
    const farmhouses = await Farmhouse.find(query);
    res
      .status(200)
      .json({ message: 'Farmhouses fetched successfully', data: farmhouses });
  } catch (error) {
    // console.error('Error fetching farmhouses:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
});

// 3/01/2025 farmhouse approved ?
// Update farmhouse approval status
app.patch('/updateApproval/:id', async (req, res) => {
  const { id } = req.params;
  const { approvalStatus } = req.body;
  if (!id) {
    // console.log('Update inside if');
    return res.status(400).json({ message: 'Farmhouse ID is required' });
  }
  if (!approvalStatus) {
    return res.status(400).json({ message: 'Approval status is required' });
  }

  try {
    // console.log('inside try');
    const updatedFarmhouse = await Farmhouse.findByIdAndUpdate(
      id,
      { $set: { approved: approvalStatus } },
      { new: true },
    );

    if (!updatedFarmhouse) {
      return res.status(404).json({ message: 'Farmhouse not found' });
    }

    res.status(200).json({
      message: 'Approval status updated successfully',
      updatedFarmhouse,
    });
  } catch (error) {
    // console.error('Error updating approval status:', error);
    res.status(500).json({ message: 'Error updating approval status', error });
  }
});
// 13/01/2025 download invoic
app.post('/generate-pdf', (req, res) => {
  const { orderDetails, customerDetails } = req.body;
  const doc = new PDFDocument({
    margin: 40,
    size: 'A4',
    bufferPages: true
  });

  const buffers = [];
  const logoPath = path.join(__dirname, '../src/assets/app_images/logo_nf.png');
  const darkGreen = '#244f26';
  const lightGreen = '#00E676';
  const black = '#000'

  // Generate invoice details
  const invoiceNumber = `INV-${new Date().getTime().toString().slice(-6)}`;
  const invoiceDate = new Date().toLocaleDateString('en-IN');
  const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN');

  // Collect buffer data
  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => {
    const pdfData = Buffer.concat(buffers);
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfData);
  });

  // //   // Draw colored stripe on left side
  function drawLeftStripe() {
    const halfHeight = doc.page.height / 4;
    doc.save();
    doc.rect(0, 0, 30, halfHeight).fill('#00E676'); // light green top half
    doc.rect(0, halfHeight, 30, halfHeight * 3).fill('#244f26'); // dark green bottom half
    doc.restore();
  }


  drawLeftStripe();
  doc.on('pageAdded', drawLeftStripe);

  // ===== HEADER SECTION =====
  const headerY = 40;

  // Logo
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 60, headerY, { width: 80 });
  }

  // Invoice title and details (right-aligned)
  doc.font('Helvetica-Bold')
    .fillColor(darkGreen)
    .fontSize(20)
    .text('INVOICE', 420, headerY, { align: 'right' });

  doc.fontSize(10)
    .fillColor('black')
    //  .text(`Invoice No: ${invoiceNumber}`, { align: 'right' })
    //  .text(`Download Date: ${invoiceDate}`, { align: 'right' })
    //  .text(`Due Date: ${dueDate}`, { align: 'right' })
    .moveDown(0.5);

  // Company info
  doc.font('Helvetica-Bold').text('Noida Farms', { align: 'right' });
  doc.font('Helvetica')
    .text('Headquarter: Delhi, India', { align: 'right' })
    //  .text('GSTIN: 06AABC06063D12Q | PAN: AADCM5146R', { align: 'right' })
    .text('contact@noidafarms.com', { align: 'right' })
    .text('+91 9876543210', { align: 'right' });

  // Draw header separator line
  doc.moveDown(0.5);
  drawLine(doc, darkGreen);

  // ===== TWO-COLUMN LAYOUT =====
  const columnWidth = 240;
  const startY = doc.y;

  // Left Column: Customer Details
  doc.font('Helvetica-Bold').fillColor(darkGreen).text('BILL TO:', 60, startY);
  doc.font('Helvetica').fillColor('black')
    .text(`${customerDetails.name || ''} ${customerDetails.lastName || ''}`, 60, startY + 20)
    .text(`Phone: ${customerDetails.phoneNumber || 'N/A'}`, 60, startY + 35)
    .text(`Email: ${customerDetails.email || 'N/A'}`, 60, startY + 50)
    .text(`Address: ${customerDetails.city || ''}, ${customerDetails.state || ''}`, 60, startY + 65);

  // Right Column: Booking Details
  doc.font('Helvetica-Bold').fillColor(darkGreen).text('BOOKING DETAILS:', 320, startY);
  doc.font('Helvetica').fillColor('black')
    .text(`Booking ID: ${orderDetails.id || 'N/A'}`, 320, startY + 20)
    .text(`Farmhouse: ${orderDetails.farmhouse_name || 'N/A'}`, 320, startY + 35)
    .text(`Location: ${orderDetails.location || 'N/A'}`, 320, startY + 50)
    .text(`Booking Date: ${new Date(orderDetails.created_at).toLocaleDateString('en-IN') || 'N/A'}`, 320, startY + 65)
    .text(`Check-in: ${new Date(orderDetails.check_in_date).toLocaleDateString('en-IN') || 'N/A'}`, 320, startY + 80)
    .text(`Guests: ${orderDetails.number_of_guests || 'N/A'}`, 320, startY + 95)
    .text(`Status: ${orderDetails.booking_status || 'N/A'}`, 320, startY + 110);

  doc.y = Math.max(startY, doc.y);
  drawLine(doc, darkGreen);

  // ===== CHARGES TABLE =====
  doc.font('Helvetica-Bold').fillColor(darkGreen).fontSize(14).text('CHARGES SUMMARY', 220).moveDown(0.5);

  // Table headers
  const tableTop = doc.y;
  doc.font('Helvetica-Bold')
    .fillColor('white')
    .rect(60, tableTop, 480, 20).fill(darkGreen)
    .fillColor('white')
    .text('Description', 70, tableTop + 5)
    .text('Amount', 450, tableTop + 5);

  // Table rows
  let currentY = tableTop + 30;
  doc.font('Helvetica').fillColor(black).text('Base Booking Charges', 70, currentY).text(orderDetails.total_price, 470, currentY);

  // Additional services
  if (orderDetails.services && orderDetails.services.length > 0) {
    orderDetails.services.forEach(service => {
      currentY += 20;
      // doc.font('Helvetica').fillColor(black).text(`Service: $(service)`,(service), 70, currentY).text('TBD', 470, currentY);
      doc.font('Helvetica').fillColor(black).text(`Service: ${service}`, 70, currentY).text('TBD', 470, currentY);
    });
  }

  // Fixed charges
  currentY += 20;
  doc.font('Helvetica').fillColor(black).text('Cleaning Fee', 70, currentY).text('500', 470, currentY);
  currentY += 20;
  doc.font('Helvetica').fillColor(black).text('Security Deposit:', 70, currentY).text('5000', 470, currentY);

  currentY += 20;
  doc.font('Helvetica-Bold').fillColor(darkGreen)
    .text('GST (18%)', 70, currentY + 5)
    .text(calculateGST(orderDetails.total_price), 470, currentY + 5,);

  // Total row
  currentY += 30;
  doc.rect(60, currentY, 480, 30).fill(lightGreen)
    .font('Helvetica-Bold').fillColor('white')
    .text('TOTAL AMOUNT', 70, currentY + 10)
    .text(orderDetails.total_price || 0, 470, currentY + 10,);

  doc.y = currentY + 40;
  drawLine(doc, darkGreen);

  // ===== PAYMENT INFORMATION =====
  // doc.font('Helvetica-Bold').fillColor(darkGreen).text('PAYMENT DETAILS').moveDown(0.5);
  doc.font('Helvetica-Bold').fillColor(darkGreen).fontSize(14).text('PAYMENT DETAILS', 60).moveDown(0.5);
  const paymentY = doc.y;
  doc.font('Helvetica').fontSize(10).fillColor(black)
    .text(`Payment Method: ${orderDetails.payment?.method || 'Cash'}`, 60, paymentY)
    .text(`Transaction ID: ${orderDetails.payment?.transaction_id || 'N/A'}`, 60, paymentY + 20)
    .text(`Payment Date: ${new Date(orderDetails.payment?.payment_date).toLocaleDateString('en-IN') || 'N/A'}`, 60, paymentY + 40)
    .text(`Payment Status: ${orderDetails.payment?.status || 'Pending'}`, 320, paymentY)
    .text(`Amount Paid: ${orderDetails.payment?.amount_paid || 0}`, 320, paymentY + 20)
    .text(`Pending Amount: ${(orderDetails.total_price || 0) - (orderDetails.payment?.amount_paid || 0)}`, 320, paymentY + 40);

  doc.y = paymentY + 60;
  drawLine(doc, darkGreen);

  // ===== FOOTER SECTION =====
  // doc.font('Helvetica-Bold').fillColor(darkGreen).text('IMPORTANT NOTES').moveDown(0.3);
  doc.font('Helvetica-Bold').fillColor(darkGreen).fontSize(14).text('IMPORTANT NOTES', 60).moveDown(0.5);
  doc.font('Helvetica').fontSize(10).fillColor(black)
    .text('• Only Uttar Pradesh alcohol permitted. Outside alcohol strictly prohibited', 60)
    .text('• Booking token amount (5000) is non-refundable')
    .text('• Date changes not permitted after confirmation')
    .text('• 100% payment required 48 hours before event')
    .text('• Damage deposit will be refunded within 7 business days after inspection')
    .moveDown();

  doc.fontSize(8).fillColor('gray').text('This is a computer generated invoice and does not require a physical signature');
  doc.text('Noida Farms • GSTIN: 06AABC06063D12Q • PAN: AADCM5146R • CIN: U63090DL2012PTC231770');
  doc.text('Registered Office: 19th Floor, Epitome Building, DLF Cybercity, Gurgaon, Haryana 122001');

  // End PDF
  doc.end();

  // Helper function to draw lines
  function drawLine(doc, color) {
    doc.strokeColor(color)
      .lineWidth(1)
      .moveTo(60, doc.y)
      .lineTo(540, doc.y)
      .stroke()
      .moveDown(1);
  }

  // Helper function for table rows
  function addTableRow(doc, description, amount, x, y) {
    doc.font('Helvetica')
      .fillColor('black')
      .text(description, x + 10, y + 5)
      .text(amount, x + 430, y + 5, { align: 'right' });
  }

  // Helper function to calculate GST
  function calculateGST(amount) {
    const gst = (amount * 0.18).toFixed(2);
    return + gst;
  }
});
// 27/01/2025 api for bookings
// const razorpay = new Razorpay({
//   key_id: 'rzp_test_cwICPGGLhKqFG6', 
//   key_secret: 'SCZj4segvf6oE8qJGcihGmIT', 
// });
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.post('/api/bookings', async (req, res) => {
  try {
    const { user_id, farmhouse_id, imagesfordb, farmhouse_name, location, price_per_night, check_in_date, BookFor, number_of_guests, services, special_requests, total_price } = req.body;
    const newOrder = new Order({
      user_id, farmhouse_id, imagesfordb, farmhouse_name, location, price_per_night, total_price, check_in_date: new Date(check_in_date), BookFor, number_of_guests, services, special_requests,
      payment: { razorpay_payment_id: null, status: 'Pending', amount_paid: 0, payment_date: null },
      booking_status: 'Pending',
    });
    await newOrder.save();
    const razorpayOrder = await razorpay.orders.create({
      amount: total_price * 100,
      currency: 'INR',
      receipt: `${newOrder._id}`,
      payment_capture: 1,
    });
    res.status(201).json({
      message: 'Booking created successfully',
      order_id: newOrder._id,
      razorpay_order_id: razorpayOrder.id,
      total_price,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Failed to create booking', details: err.message });
    console.error('Error during booking creation:', err);

  }
});

app.post('/api/bookings/payment/callback', async (req, res) => {
  try {
    const { order_id, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    const order = await Order.findById(order_id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    // ✅ Fetch full payment details from Razorpay
    const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);
    // console.log(paymentDetails,'payments')
    // ✅ Save transaction
    const transaction = new Transaction({
      order: order._id,
      user: order.user_id,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,

      amount: paymentDetails.amount / 100,
      currency: paymentDetails.currency,
      status: paymentDetails.status,
      method: paymentDetails.method,
      bank: paymentDetails.bank,
      wallet: paymentDetails.wallet,
      vpa: paymentDetails.vpa,
      captured: paymentDetails.captured,

      email: paymentDetails.email,
      contact: paymentDetails.contact,
      fee: paymentDetails.fee,
      tax: paymentDetails.tax,

      error_code: paymentDetails.error_code,
      error_description: paymentDetails.error_description,
      raw_response: paymentDetails
    });

    await transaction.save();

    order.payment.razorpay_payment_id = razorpay_payment_id;
    order.payment.status = paymentDetails.status === "captured" ? "Success" : "Failed";
    order.payment.amount_paid = paymentDetails.amount / 100;
    order.payment.payment_date = new Date(paymentDetails.created_at * 1000);
    order.booking_status = paymentDetails.status === "captured" ? "Confirmed" : "Failed";

    await order.save();

    res.status(200).json({
      message: "Payment recorded successfully",
      transaction,
      booking_status: order.booking_status,
    });
  } catch (err) {
    console.error("Error in callback:", err);
    res.status(500).json({ error: "Failed to update payment status", details: err.message });
  }
});



// app.post('/api/bookings/payment/callback', async (req, res) => {
//   try {
//     const {razorpay_payment_id, order_id} = req.body;
//     const order = await Order.findById(order_id);
//     if (!order) {
//       return res.status(404).json({error: 'Order not found'});
//     }
//     // Update payment and booking details
//     order.payment.razorpay_payment_id = razorpay_payment_id;
//     order.payment.status = 'Success';
//     order.payment.amount_paid = order.total_price;
//     order.payment.payment_date = new Date();
//     order.booking_status = 'Confirmed';
//     order.updated_at = new Date();
//     await order.save();
//     res.status(200).json({
//       message: 'Payment status updated successfully',
//       payment_status: 'Success',
//       booking_status: 'Confirmed',
//     });
//   } catch (err) {
//     res.status(500).json({
//       error: 'Failed to update payment status',
//       details: err.message,
//     });
//   }
// });
//  get all order for checking bookings
app.get('/orders/:farmhouseIdForCheckBooking', async (req, res) => {
  const { farmhouseIdForCheckBooking } = req.params;
  try {
    // const orders = await Order.find({booking_status:"Confirmed"})
    const orders = await Order.find({ booking_status: "Confirmed", farmhouse_id: farmhouseIdForCheckBooking })
      .select(
        'check_in_date',
      )
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Failed to fetch orders', details: err.message });
  }
});
//  get all order
app.get('/Admin/Allorders', async (req, res) => {
  // const {farmhouseIdForCheckBooking }= req.params;
  try {
    // const orders = await Order.find({booking_status:"Confirmed"})
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Failed to fetch orders', details: err.message });
  }
});

app.get('/orders/UserByOrder/:user_id', async (req, res) => {
  // console.log('helo')
  try {
    const { user_id } = req.params;
    const orders = await Order.find({ user_id })
      .select(
        'farmhouse_name location check_in_date check_out_date booking_status created_at total_price price_per_night imagesfordb',
      )
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Failed to fetch orders', details: err.message });
  }
});
// to fetch order details from orders by using order id
app.get('/api/bookings/:order_id', async (req, res) => {
  try {
    const { order_id } = req.params;
    const order = await Order.findById(order_id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Failed to fetch order details', details: err.message });
  }
});
// code for forget password
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587, // Common SMTP port for email services
  secure: false, // Set to true for port 465
  auth: {
    user: 'aj95608710@gmail.com',
    pass: 'evkt gwmz mafr vcex',
  },
});
app.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User doesn't exist!" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    user.resetPasswordToken = otp;
    user.resetPasswordExpires = Date.now() + 600000;
    await user.save();
    await transporter.sendMail({
      to: email,
      subject: 'Password Reset Request',
      text: `Enter this otp for verification: ${otp}`,
    });
    res.json({ message: 'OTP send to you registered mail.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
// otp verification
app.post('/OptVerification', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({
      email: email,
      resetPasswordToken: otp,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
// password reset
app.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({
      email: email,
      resetPasswordToken: otp,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    user.password = encryptedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
// wharsapp loging
app.post('/Whatsapp-Login', async (req, res) => {
  try {
    // console.log("1")
    const { PNnumber } = req.body;
    if (!PNnumber) {
      return res.status(400).send({ error: 'Phone number is required' });
    }
    // console.log("2")
    const OldUser = await User.findOne({ phoneNumber: PNnumber });
    // console.log("3")
    if (!OldUser) {
      // console.log("4")
      return res.status(200).send({ data: 'User not exist' });
    }
    const token = jwt.sign(
      { id: OldUser._id, phoneNumber: PNnumber },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
    // console.log("5")
    return res.status(200).send({
      status: 'ok',
      data: {
        token,
        UserID: OldUser._id,
        userType: 'user',
        UserAllDetails: OldUser,
      },
    });
    // console.log("6")
  } catch (error) {
    // console.log("7")
    return res.status(500).send({ error: 'Internal server error' });
  }
});
// new registration using whatsapp 

app.post('/NewRegister', async (req, res) => {
  const { name, PNumber, gender, isAdult } = req.body;
  if (!name || !PNumber || !gender || typeof isAdult === 'undefined') {
    return res.status(400).send({ status: 'error', data: 'Missing required fields.' });
  }
  try {
    const newUser = await User.create({
      name: name.trim(),
      phoneNumber: PNumber.trim(),
      gender,
      isAdult,
      ActiveUser: 'Active user',
    });
    const token = jwt.sign(
      { id: newUser._id, phoneNumber: newUser.phoneNumber },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.status(200).send({
      status: 'ok',
      data: {
        message: 'User created and logged in successfully',
        token,
        UserID: newUser._id,
        userType: 'user',
        UserAllDetails: newUser,
      },
    });
  } catch (error) {
    console.error(error.message, 'error.message');
    let message = error.message;
    if (message.includes('duplicate key error')) {
      message = 'Phone number or email already exists.';
    }
    res.status(500).send({ status: 'error', data: message });
  }
});

// cancel booking 
app.put('/bookings/cancel/:order_id', async (req, res) => {
  // console.log('1');
  try {
    // console.log('2');
    const { order_id } = req.params;
    // console.log('3');
    const order = await Order.findById(order_id);
    if (!order) {
      // console.log('4');
      return res.status(404).json({ message: 'Booking not found' });
    }
    if (order.booking_status === 'Cancelled') {
      // console.log('5');
      return res.status(400).json({ message: 'Booking already cancelled' });
    }
    // console.log('6');
    order.booking_status = 'Cancelled';
    order.updated_at = new Date();
    // console.log('7');
    await order.save();
    // console.log('8');
    return res.status(200).json({ message: 'Booking cancelled successfully', order });
  } catch (error) {
    // console.log('10', error);
    return res.status(500).json({ message: 'Something went wrong', error });
  }
});
// order refund :
// const axios = require('axios');
app.post('/bookings/refund/:orderId', async (req, res) => {
  const { orderId } = req.params;
  try {
    const booking = await Order.findOne({ _id: orderId });
    if (!booking) { return res.status(404).json({ message: 'Booking not found' }) }
    if (booking.booking_status !== 'Cancelled') { return res.status(400).json({ message: 'Booking is not cancelled. Cannot refund.' }) }
    const paymentid = booking.payment.razorpay_payment_id
    // console.log(paymentid,'paymentid')
    const refundResponse = await axios.post(`https://api.razorpay.com/v1/payments/${paymentid}/refund`,
      { amount: booking.total_price * 100 },
      {
        auth: {
          username: 'rzp_test_cwICPGGLhKqFG6',
          password: 'SCZj4segvf6oE8qJGcihGmIT',
        },
      });
    // console.log('7')
    booking.refund_status = 'Refunded';
    booking.updated_at = new Date();
    await booking.save();
    res.status(200).json({ message: 'Refund processed successfully', refund: refundResponse.data });
  } catch (error) {
    // console.error('Refund Error:', error?.response?.data || error.message);
    res.status(400).json({ message: 'Failed to process refund', error: error?.response?.data });
  }
});
// deactivate account code api
app.put('/DeactiveUser', async (req, res) => {
  const { phoneNumberuser } = req.body;
  try {
    // Find the user by phone number
    const user = await User.findOne({ phoneNumber: phoneNumberuser });
    if (!user) {
      return res.status(404).json({ error: 'User not found to deactivate' });
    }
    // Update user status
    user.ActiveUser = 'Deactive user'; // Or use a boolean: user.isActive = false;
    await user.save();
    res.status(200).json({ message: 'User deactivated successfully' });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to deactivate user. Try again later.',
      details: error.message,
    });
  }
});
app.put('/activeUser', async (req, res) => {
  const { PNnumber } = req.body;
  // console.log('Received activation for:', PNnumber);
  if (!PNnumber) {
    return res.status(400).send({ error: 'Phone number is required' });
  }
  try {
    const user = await User.findOne({ phoneNumber: PNnumber });
    // console.log(user,'user')
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.ActiveUser = 'Active user'; // Match what you use in deactivate logic
    await user.save();
    // console.log('User activated:', user);
    res.status(200).json({ message: 'User activated successfully' });
  } catch (error) {
    console.error('Activation error:', error);
    res.status(500).json({
      error: 'Failed to activate user. Try again later.',
      details: error.message,
    });
  }
});
// for check availability 
app.get('/:id/availability', async (req, res) => {
  try {
    const { id } = req.params; // Farmhouse ID
    const { month } = req.query; // YYYY-MM format
    if (!month) {
      return res.status(400).json({ error: "Month is required (YYYY-MM)" });
    }
    // Fetch all bookings for this farmhouse in the selected month
    const bookings = await Order.find({
      farmhouse_id: id,
      booking_date: {
        $gte: new Date(`${month}-01`),
        $lt: new Date(`${month}-31`)
      }
    });
    // Organize bookings by date
    const availability = {};
    bookings.forEach(booking => {
      const dateKey = booking.booking_date.toISOString().split("T")[0];
      if (!availability[dateKey]) {
        availability[dateKey] = [];
      }
      availability[dateKey].push(booking.booking_type); // 'day' | 'night' | 'full'
    });
    // Create final availability response
    const response = {};
    for (let day = 1; day <= 31; day++) {
      const dateStr = `${month}-${String(day).padStart(2, '0')}`;
      if (!availability[dateStr]) {
        response[dateStr] = "Available"; // ✅ No bookings on this date
      } else if (availability[dateStr].includes("full")) {
        response[dateStr] = "Not Available"; // ❌ Fully booked
      } else if (availability[dateStr].includes("day")) {
        response[dateStr] = "Available (Night Only)"; // 🔵 Night available
      } else if (availability[dateStr].includes("night")) {
        response[dateStr] = "Available (Day Only)"; // 🟡 Day available
      }
    }
    return res.json(response);
  } catch (error) {
    console.error("Error fetching availability:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// google auth
app.post('/Google-Login', async (req, res) => {
  try {
    const { email, name, image } = req.body;
    // console.log('email:', email , 'name :' , name);

    if (!email) {
      return res.status(400).json({ status: 'error', message: 'Email is required' });
    }

    let user = await User.findOne({ email: email });
    // console.log("user :", user);

    if (!user) {
      const userData = {
        email,
        name,
        ActiveUser: 'Active user',
        image,
        // phoneNumber: ' ',
        // phoneNumber: null,

        isAdult: true,
      };
      user = await User.create(userData);
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      status: 'ok',
      data: {
        message: 'Login successful',
        token,
        UserID: user._id,
        userType: user.userType || 'user',
        UserAllDetails: user,
      },
    });

  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

// GET /api/farmhouses?userId=...
app.get('/vendor/get/farmhouses', async (req, res) => {
  try {
    // console.log('yesitcall')
    const { userId } = req.query;
    // console.log(userId,'userid')
    if (!userId) return res.status(400).json({ message: 'Missing userId' });
    const farmhouses = await Farmhouse.find({ userId: userId });
    res.status(200).json({ farmhouses });
    // console.log('done')
  } catch (error) {
    console.error('Error fetching farmhouses:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});
// POST /api/bookings/by-farmhouses
app.post('/vendor/get/bookings', async (req, res) => {
  try {
    // const { farmhouseIds, startDate, endDate } = req.query;
    const { farmhouseIds, startDate, endDate } = req.body;
    // console.log(farmhouseIds,'id')
    if (!farmhouseIds || !Array.isArray(farmhouseIds) || farmhouseIds.length === 0) {
      return res.status(400).json({ message: 'farmhouseIds array is required' });
    }
    const query = {
      farmhouse_id: { $in: farmhouseIds },
    };
    if (startDate && endDate) {
      query.check_in_date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    const bookings = await Order.find(query).sort({ check_in_date: -1 });
    // console.log(bookings,'bookings')
    res.status(200).json({ bookings });
  } catch (error) {
    console.error('Error filtering bookings:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// update farmhouse 
app.post('/UpdateFarmhouseVendor', async (req, res) => {
  try {
    const { farmhouseId, formData } = req.body;

    if (!farmhouseId || !formData) {
      return res.status(400).json({ message: 'Missing data' });
    }

    const updatedFarmhouse = await Farmhouse.findByIdAndUpdate(
      farmhouseId,
      { $set: formData },
      { new: true }
    );
    // console.log(updatedFarmhouse,'updatedFarmhouse')

    if (!updatedFarmhouse) {
      return res.status(404).json({ message: 'Farmhouse not found' });
    }

    res.status(200).json({ message: 'Farmhouse updated successfully', updatedFarmhouse });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// add Account details
app.post('/vendor/addaccountdetails', async (req, res) => {
  try {
    const { userId, bankName, accountName, accountNumber, IfscCodeNumber } = req.body;
    if (!userId || !bankName || !accountName || !accountNumber || !IfscCodeNumber) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const userExists = await Bank_Details.findOne({ userId });
    if (userExists) {
      return res.status(400).json({ message: 'User already has bank details. Use update instead.' });
    }
    const accExists = await Bank_Details.findOne({ accountNumber });
    if (accExists) {
      return res.status(409).json({ message: 'Account number already exists' });
    }
    const newBank = new Bank_Details({ userId, bankName, accountName, accountNumber, IfscCodeNumber, });
    await newBank.save();
    res.status(201).json({ message: 'Bank details added successfully', Bank_Details: newBank });
  } catch (error) {
    console.error('Add error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// fetch details
app.get('/api/GetBankDetails/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    // console.log(userId,'userid')
    const bank = await Bank_Details.findOne({ userId });
    if (!bank) {
      return res.status(404).json({ message: 'No bank details found' });
    }
    res.status(200).json({ message: 'Success', Bank_Details: bank });
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// updates details
app.put('/api/UpdateBankDetails', async (req, res) => {
  // console.log('print')
  const { bankId, payload } = req.body;
  // console.log(bankId, payload,'print')
  try {
    if (!bankId || !payload) {
      return res.status(400).json({ message: 'Missing data' });
    }
    // Optional: Check if the updated account number already exists in another record
    const exists = await Bank_Details.findOne({
      accountNumber: payload.accountNumber,
      _id: { $ne: bankId },
    });
    if (exists) {
      return res.status(409).json({ message: 'Account number already in use by another user' });
    }
    const updatedBank = await Bank_Details.findByIdAndUpdate(
      bankId,
      { $set: payload },
      { new: true }
    );
    if (!updatedBank) {
      return res.status(404).json({ message: 'Bank details not found' });
    }
    res.status(200).json({ message: 'Bank details updated successfully', updatedBank });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// farmhouse book using admin panel

app.post('/BookhstmhouseUsingAdminpanel', async (req, res) => {

  try {
    const formData = req.body
    const newOrder = new Order({
      farmhouse_id: formData.FarmhouseData.farmhouseId,
      imagesfordb: formData.FarmhouseData.imagedb,
      farmhouse_name: formData.FarmhouseData.farmHouseName,
      location: formData.FarmhouseData.location,
      price_per_night: formData.formData.Amount,
      total_price: formData.formData.Amount,
      check_in_date: formData.formData.date,
      number_of_guests: formData.formData.guests,
      special_requests: formData.formData.specialRequests,
      payment: 'Cash',
      booking_status: 'Confirmed',
      UserName: formData.formData.fullName,
      PhoneNumber: formData.formData.phone,
      userEmail: formData.formData.email,
      recieverName: formData.formData.receiverName,
    })
    await newOrder.save();
    res.status(200).json({
      message: 'Success',
      date: 'today'
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: "getting error during boooking farmhouse", error: error })
  }

})

app.post('/generate-new-invoice', (req, res) => {
  // console.log('hel')
  const booking = req.body.BookingsDetailspage;

  const doc = new PDFDocument({ margin: 40, size: 'A4', bufferPages: true });
  const buffers = [];

  const logoPath = path.join(__dirname, '../src/assets/app_images/logo_nf.png');
  const darkGreen = '#244f26';
  const lightGreen = '#00E676';
  const black = '#000';

  const invoiceNumber = `INV-${new Date().getTime().toString().slice(-6)}`;
  const invoiceDate = new Date().toLocaleDateString('en-IN');
  const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN');

  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => {
    const pdfData = Buffer.concat(buffers);
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfData);
  });

  // Draw Left Stripe
  function drawLeftStripe() {
    const halfHeight = doc.page.height / 4;
    doc.save();
    doc.rect(0, 0, 30, halfHeight).fill(lightGreen);
    doc.rect(0, halfHeight, 30, halfHeight * 3).fill(darkGreen);
    doc.restore();
  }

  drawLeftStripe();
  doc.on('pageAdded', drawLeftStripe);

  // ===== HEADER =====
  const headerY = 40;
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 60, headerY, { width: 80 });
  }

  doc.font('Helvetica-Bold').fillColor(darkGreen).fontSize(20).text('INVOICE', 420, headerY, { align: 'right' });

  doc.fontSize(10).fillColor('black');
  doc.font('Helvetica-Bold').text('Noida Farms', { align: 'right' });
  doc.font('Helvetica')
    .text('Headquarter: Delhi, India', { align: 'right' })
    .text('contact@noidafarms.com', { align: 'right' })
    .text('+91 9876543210', { align: 'right' });

  doc.moveDown(0.5);
  drawLine(doc, darkGreen);

  // ===== BILL TO / BOOKING INFO =====
  const startY = doc.y;
  doc.font('Helvetica-Bold').fillColor(darkGreen).text('BILL TO:', 60, startY);
  doc.font('Helvetica').fillColor(black)
    .text(booking.UserName || 'N/A', 60, startY + 20)
    .text(`Phone: ${booking.PhoneNumber}`, 60, startY + 35)
    .text(`Email: ${booking.userEmail}`, 60, startY + 50);

  doc.font('Helvetica-Bold').fillColor(darkGreen).text('BOOKING DETAILS:', 320, startY);
  doc.font('Helvetica').fillColor(black)
    // .text(`Booking ID: ${booking._id}`, 320, startY + 20)
    .text(`Farmhouse: ${booking.farmhouse_name}`, 320, startY + 25)
    .text(`Location: ${booking.location}`, 320, startY + 40)
    .text(`Booking Date: ${formatDate(booking.created_at)}`, 320, startY + 75)
    .text(`Check-in: ${formatDate(booking.check_in_date)}`, 320, startY + 90)
    .text(`Guests: ${booking.number_of_guests}`, 320, startY + 105)
    .text(`Status: ${booking.booking_status}`, 320, startY + 115);

  doc.y = Math.max(startY, doc.y);
  drawLine(doc, darkGreen);

  // ===== CHARGES TABLE =====
  doc.font('Helvetica-Bold').fillColor(darkGreen).fontSize(14).text('CHARGES SUMMARY', 220).moveDown(0.5);
  const tableTop = doc.y;

  doc.rect(60, tableTop, 480, 20).fill(darkGreen);
  doc.fillColor('white').font('Helvetica-Bold')
    .text('Description', 70, tableTop + 5)
    .text('Amount', 450, tableTop + 5);

  let currentY = tableTop + 30;
  doc.font('Helvetica').fillColor(black)
    .text('Base Booking Charges', 70, currentY)
    .text(booking.total_price.toFixed(2), 470, currentY);

  currentY += 20;
  doc.text('Cleaning Fee', 70, currentY).text('500.00', 470, currentY);

  currentY += 20;
  doc.text('Security Deposit', 70, currentY).text('5000.00', 470, currentY);

  currentY += 20;
  const gstAmount = calculateGST(booking.total_price);
  doc.font('Helvetica-Bold').fillColor(darkGreen)
    .text('GST (18%)', 70, currentY)
    .text(gstAmount, 470, currentY);

  currentY += 30;
  doc.rect(60, currentY, 480, 30).fill(lightGreen);
  doc.fillColor('white').font('Helvetica-Bold')
    .text('TOTAL AMOUNT', 70, currentY + 10)
    .text((booking.total_price).toFixed(2), 470, currentY + 10);

  doc.y = currentY + 40;
  drawLine(doc, darkGreen);

  // ===== NOTES =====
  doc.font('Helvetica-Bold').fillColor(darkGreen).fontSize(14).text('IMPORTANT NOTES', 60).moveDown(0.5);
  doc.font('Helvetica').fontSize(10).fillColor(black)
    .text('• Only Uttar Pradesh alcohol permitted. Outside alcohol strictly prohibited')
    .text('• Booking token amount (5000) is non-refundable')
    .text('• Date changes not permitted after confirmation')
    .text('• 100% payment required 48 hours before event')
    .text('• Damage deposit will be refunded within 7 business days after inspection')
    .moveDown();

  doc.fontSize(8).fillColor('gray')
    .text('This is a computer generated invoice and does not require a physical signature')
    .text('Noida Farms • GSTIN: 06AABC06063D12Q • PAN: AADCM5146R • CIN: U63090DL2012PTC231770')
    .text('Registered Office: 19th Floor, Epitome Building, DLF Cybercity, Gurgaon, Haryana 122001');

  doc.end();

  // ==== HELPERS ====
  function drawLine(doc, color) {
    doc.strokeColor(color).lineWidth(1).moveTo(60, doc.y).lineTo(540, doc.y).stroke().moveDown(1);
  }

  function calculateGST(amount) {
    return (amount * 0.18).toFixed(2);
  }

  function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN');
  }
});


// transaction fetch 

app.get('/Admin/Transaction', async (req, res) => {
  try {
    // const { status, search, page = 1, limit = 20 } = req.query;
    // const query = {};

    // status filter
    // if (status) query.status = status;

    // simple text search on common fields
    // if (search) {
    //   query.$or = [
    //     { razorpay_payment_id: new RegExp(search, "i") },
    //     { razorpay_order_id: new RegExp(search, "i") },
    //     { email: new RegExp(search, "i") },
    //     { contact: new RegExp(search, "i") },
    //   ];
    // }
    // 
    // const skip = (page - 1) * limit;

    const transactions = await Transaction.find()
      // .populate("order", "_id")
      // .populate("user", "_id name email phoneNumber")
      .sort({ created_at: -1 })
    // .skip(Number(skip))
    // .limit(Number(limit));

    // Normalize data
    // const result = transactions.map(tx => {
    // const date = tx.created_at || (tx.raw_response?.created_at ? new Date(tx.raw_response.created_at * 1000) : null);
    // const amountInRupees = tx.amount >= 1000 ? tx.amount / 100 : tx.amount; 
    // adjust this logic if you confirm your DB stores paise vs rupees

    //   return {
    //     id: tx._id,
    //     orderId: tx.order?._id || tx.raw_response?.order_id,
    //     user: tx.user ? {
    //       id: tx.user._id,
    //       name: tx.user.name,
    //       email: tx.user.email,
    //       phone: tx.user.phoneNumber
    //     } : tx.user,
    //     paymentId: tx.razorpay_payment_id,
    //     status: tx.status,
    //     amount: amountInRupees,
    //     date,
    //   };
    // });

    res.status(200).json({ data: transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Failed to fetch transactions", error });
  }
});
// register agent and admin 
app.post("/register-agent", async (req, res) => {
  const { fullName, phone, email, password, permissions } = req.body;
  try {
    const existingUser = await AgentAndAdmin.findOne({
      $or: [{ email }, { phoneNumber: phone }],
    });

    if (existingUser) {
      const emailExists = existingUser.email === email;
      const phoneExists = existingUser.phoneNumber === phone;
      let message = "";
      if (emailExists && phoneExists) {
        message = "With this Email and phone number Agent already exist";
      } else if (emailExists) {
        message = "Email already exists";
      } else if (phoneExists) {
        message = "Phone number already exists";
      }
      return res.status(400).json({ status: "error", message });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await AgentAndAdmin.create({
      name: fullName,
      phoneNumber: phone,
      email,
      password: hashedPassword,
      role: "agent",
      isAdult: true,
      permissions: permissions || {},
    });



    return res.json({ status: "ok", message: "Agent registered successfully" });
  } catch (error) {
    console.error("Agent registration error:", error);

    // Handle MongoDB duplicate key errors
    if (error.code === 11000 && error.keyPattern) {
      const fields = Object.keys(error.keyPattern);
      let message = "";
      if (fields.includes("email") && fields.includes("phoneNumber")) {
        message = "Email and phone number already exist";
      } else if (fields.includes("email")) {
        message = "Email already exists";
      } else if (fields.includes("phoneNumber")) {
        message = "Phone number already exists";
      } else {
        message = "Duplicate value detected";
      }
      return res.status(400).json({ status: "error", message });
    }

    return res.status(500).json({ status: "error", message: "Server error" });
  }
});

// admin and agent login
app.post('/administrativeLogin', async (req, res) => {
  const { email, password } = req.body;
  const OldUser = await AgentAndAdmin.findOne({ email: email });
  // const LoginDetails = OldUser;

  if (!OldUser) {
    return res.status(404).send({
      status: 'NotFoundEmail',
      data: "Agent not found. Please check you email ID again",
    });
  }

  if (await bcrypt.compare(password, OldUser.password)) {
    const token = jwt.sign({ email }, JWT_SECRET);
    return res.status(201).send({
      status: 'ok',
      data: {
        token,
        UserID: OldUser._id,
        userType: 'admin',
        UserAllDetails: OldUser,
        // details: OldUser,
      },
    });
  }

  return res.status(401).send({
    status: 'PasswordInvalid',
    data: "Password Invalid"
  })

})
// fetch all admin and agents
app.post('/AllAdmin/AndAgents/Fetch', async (req, res) => {
  const AllAdmin = await AgentAndAdmin.find();
  res.status(201).send({
    message: 'all admin and agents fetched',
    data: AllAdmin,
  })
})

// push notification setup 

if (!admin.apps.length && serviceAccount) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    console.log('⚠️ Failed to initialize Firebase admin:', error.message);
  }
} else if (!serviceAccount) {
  console.log('⚠️ Skipping Firebase Admin initialization because noidaFarmsNotificationKey.json is missing.');
}

//  update fcm token
app.post("/update-fcm-token", async (req, res) => {
  const { userId, fcmToken, role } = req.body;
  // console.log(userId,'userid',role,'role',fcmToken,'fcmToken')
  try {
    let model = role === "user" ? User : AgentAndAdmin;
    const user = await model.findById(userId);
    if (!user) { return res.status(404).json({ success: false, message: "User not found" }); }
    user.fcmToken = fcmToken;
    await user.save();
    res.json({ success: true, message: "FCM token updated" });
  } catch (error) {
    console.error("Error updating token:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

function chunkArray(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}
//  
app.post('/send-notification', async (req, res) => {
  try {
    const { sender, title, body, imageUrl, logoUrl } = req.body;
    if (!title || !body) {
      return res.status(400).json({ success: false, message: 'Title and body are required' });
    }
    // 1) Fetch tokens from both collections
    const [adminsAgents, users] = await Promise.all([
      AgentAndAdmin.find({ fcmToken: { $exists: true, $ne: '' } }).select('fcmToken'),
      User.find({ fcmToken: { $exists: true, $ne: '' } }).select('fcmToken'),
    ]);

    const tokensRaw = [
      ...adminsAgents.map(a => a.fcmToken),
      ...users.map(u => u.fcmToken),
    ].filter(Boolean);

    // 2) Deduplicate tokens
    const tokens = Array.from(new Set(tokensRaw));

    if (!tokens.length) {
      return res.status(400).json({ success: false, message: 'No device tokens found' });
    }

    // 3) Chunk tokens (FCM limit is 500 tokens per multicast call)
    const CHUNK_SIZE = 500;
    const chunks = chunkArray(tokens, CHUNK_SIZE);

    let totalSuccess = 0;
    let totalFailure = 0;
    const tokensToRemove = new Set(); // gather tokens that are definitely invalid

    // 4) Send each chunk
    for (const chunk of chunks) {
      //   const message = {
      //     notification: { title, body ,image: imageUrl,},
      //     android: {notification: {imageUrl: imageUrl || undefined,icon: logoUrl || undefined}},
      //     data: {sender,imageUrl,logoUrl: logoUrl || "",},
      //     tokens: chunk,
      //   };
      const message = {
        notification: { title, body, image: imageUrl || undefined },
        data: { sender, imageUrl: imageUrl || "", logoUrl: logoUrl || "" },
        tokens: chunk,
      };
      // sendEachForMulticast is the up-to-date API for batch sends
      const response = await admin.messaging().sendEachForMulticast(message);

      totalSuccess += response.successCount || 0;
      totalFailure += response.failureCount || 0;

      // Collect tokens that failed with invalid/unregistered codes for cleanup
      response.responses.forEach((r, idx) => {
        if (!r.success) {
          const err = r.error;
          // remove tokens that are clearly invalid/unregistered
          if (err && (
            err.code === 'messaging/registration-token-not-registered' ||
            err.code === 'messaging/invalid-registration-token' ||
            err.code === 'messaging/invalid-argument'
          )) {
            tokensToRemove.add(chunk[idx]);
          } else {
            // For transient errors you may not want to remove the token,
            // but you should log it for debugging. We'll log below.
            console.warn('FCM send error for token:', chunk[idx], err?.code || err?.message || err);
          }
        }
      });
    } // end for each chunk

    // 5) Remove invalid tokens from both collections (optional cleanup)
    if (tokensToRemove.size > 0) {
      const badTokens = Array.from(tokensToRemove);
      await Promise.all([
        User.updateMany({ fcmToken: { $in: badTokens } }, { $unset: { fcmToken: "" } }),
        AgentAndAdmin.updateMany({ fcmToken: { $in: badTokens } }, { $unset: { fcmToken: "" } }),
      ]);
      console.log('Removed invalid fcm tokens count:', badTokens.length);
    }

    // 6) Return summary
    return res.json({
      success: true,
      totalTargets: tokens.length,
      successCount: totalSuccess,
      failureCount: totalFailure,
      removedInvalidTokens: tokensToRemove.size,
    });
  } catch (error) {
    console.error('Error in /send-notification:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});


// ─── Multer-S3 storage for notification images ───────────────────────────────
const notificationStorage = multerS3({
  s3: s3Client,
  bucket: S3_BUCKET,
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key: (req, file, cb) => {
    // Preserve "small" vs "large" naming convention expected by the Telegram bot
    const name = file.originalname.includes('logo') ? 'small.jpg' : 'large.jpg';
    cb(null, `notification-images/${name}`);
  },
});
const uploadImg = multer({ storage: notificationStorage });

app.post("/UploadNotificationImages",
  uploadImg.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      // multer-s3 stores the full public URL in `req.file.location`
      const url = req.file.location;
      res.json({ url });
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({ error: "Upload failed", details: err.message });
    }
  }
);


// authflag check

app.get("/api/v1/auth-methods", async (req, res) => {
  const flags = await AuthFlag.find({});
  res.json({ flags });
});

// Update (toggle enable + dummy config)
app.put("/api/v1/auth-methods/:key", async (req, res) => {
  const { key } = req.params;
  const { enabled, config } = req.body;

  const updated = await AuthFlag.findOneAndUpdate(
    { key },
    { $set: { enabled, config } },
    { new: true, upsert: true }
  );

  res.json({ flag: updated });
});

app.post("/api/legal/compliance", async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const updatedDoc = await LegalCompliance.findOneAndUpdate(
      { title },
      { content, lastUpdated: Date.now() },
      { new: true, upsert: true }
    );

    res.json({ message: "Document saved successfully", data: updatedDoc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save document" });
  }
});

app.get("/api/legal/compliance/:title", async (req, res) => {
  try {
    const { title } = req.params;
    const doc = await LegalCompliance.findOne({ title });
    if (!doc) return res.status(404).json({ error: "Document not found" });
    res.json(doc);
  } catch (error) {
    console.log(error, "getting error during fetching legal compliance")
    res.status(500).json({ error: "Failed to fetch document" });
  }
})