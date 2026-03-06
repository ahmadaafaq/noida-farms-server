// // import mongoose
// // const mongoose = require('mongoose');
// // const moment = require('moment-timezone');

import mongoose ,{Schema} from 'mongoose';
import moment from 'moment-timezone';


// =============== User Schema ===============
const UserDetailSchema = new mongoose.Schema(
  {
    name: String,
    lastName: String,
    email: { type: String, unique: true, sparse: true, default: undefined },
    phoneNumber: { type: String, unique: true, sparse: true, default: undefined },
    password: String,
    image: String,
    gender: String,
    address: String,
    dob: String,
    ActiveUser: String,
    isAdult: Boolean,
    isActive: { type: Boolean, default: true },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    fcmToken: { type: String, default: "" },

    role: {
      type: String,
      enum: ["user", "agent", "farmOwner", "admin"],
      default: "user",
    },
    isBanned: { type: Boolean, default: false },
  },
  {
    collection: "UserInfo",
  }
);

export const UserInfo = mongoose.model("UserInfo", UserDetailSchema);


// =============== Farmhouse Schema ===============
const FarmhouseSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "UserInfo" },
    address: {
      houseNumber: String,
      areaName: String,
      city: String,
      state: String,
      pinCode: String,
      country: String,
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    basicDetails: {
      guests: Number,
      bedrooms: Number,
      beds: Number,
      bathrooms: Number,
    },
    amenities: [String],
    images: [{ uri: String }],
    description: { title: String, body: String },
    pricing: [
      {
        type: { type: String, enum: ["dayFare", "nightFare", "fullDayFare"] },
        fare: Number,
      },
    ],
    status: { type: String, enum: ["pending", "completed"], default: "pending" },
    approved: { type: String, enum: ["pending", "approved"], default: "pending" },
  },
  {
    timestamps: true,
    collection: "FarmHouses",
  }
);

export const FarmHouses = mongoose.model("FarmHouses", FarmhouseSchema);


// =============== Order Schema ===============
const OrderSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "UserInfo" },
    farmhouse_id: { type: mongoose.Schema.Types.ObjectId, ref: "FarmHouses" },
    imagesfordb: { type: String },
    farmhouse_name: { type: String },
    UserName: { type: String },
    PhoneNumber: { type: String },
    userEmail: { type: String },
    receiverName: { type: String },
    location: { type: String },
    price_per_night: { type: Number },
    total_price: { type: Number },
    check_in_date: { type: Date },
    BookFor: { type: String, enum: ["dayFare", "nightFare", "fullDayFare"] },
    number_of_guests: { type: Number },
    services: [String],
    special_requests: { type: String },
    payment: {
      razorpay_payment_id: String,
      status: { type: String, enum: ["Pending", "Success", "Failed"] },
      amount_paid: Number,
      payment_date: Date,
    },
    booking_status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
    },
    created_at: {
      type: String,
      default: () => moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"),
    },
    updated_at: {
      type: String,
      default: () => moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"),
    },
  },
  { collection: "Order" }
);

export const Order = mongoose.model("Order", OrderSchema);


// =============== Bank Schema ===============
const BankSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "UserInfo", required: true },
    bankName: { type: String, required: true, trim: true },
    accountName: { type: String, required: true, trim: true },
    accountNumber: { type: String, required: true, unique: true, trim: true },
    IfscCodeNumber: { type: String, required: true, trim: true },
  },
  { collection: "Bank_Details", timestamps: true }
);

export const BankDetails = mongoose.model("Bank_Details", BankSchema);

// =============== Transaction Schema ===============
const transactionSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "UserInfo", required: true },
    razorpay_payment_id: { type: String, required: true },
    razorpay_order_id: { type: String, required: true },
    razorpay_signature: String,
    amount: Number,
    currency: String,
    status: String,
    method: String,
    bank: String,
    wallet: String,
    vpa: String,
    captured: Boolean,
    email: String,
    contact: String,
    fee: Number,
    tax: Number,
    error_code: String,
    error_description: String,
    raw_response: Object,
    created_at: { type: Date, default: Date.now },
  },
  { collection: "Transactions" }
);

export const Transactions = mongoose.model("Transactions", transactionSchema);

// =============== Agent/Admin Schema ===============
const AgentAdminSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, sparse: true, default: undefined },
    phoneNumber: { type: String, unique: true, sparse: true, default: undefined },
    password: String,
    isAdult: Boolean,
    isActive: { type: Boolean, default: true },
    role: { type: String, enum: ["agent", "admin"], default: "agent" },
    isBanned: { type: Boolean, default: false },
    fcmToken: { type: String, default: "" },

    permissions: {
      users: { type: Boolean, default: false },
      farmhouses: { type: Boolean, default: false },
      bookings: { type: Boolean, default: false },
      bookFarmhouse: { type: Boolean, default: false },
      payment: { type: Boolean, default: false },
      analytics: { type: Boolean, default: false },
      addAgent: { type: Boolean, default: false },
      allAgents: { type: Boolean, default: false },
      communicationMarketing: { type: Boolean, default: false },
      supportSecurity: { type: Boolean, default: false },
    },
  },
  { collection: "AgentAndAdmin", timestamps: true }
);

export const AgentAndAdmin = mongoose.model("AgentAndAdmin", AgentAdminSchema);


// =============== AuthFlag Schema ===============
const AuthFlagSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    enabled: { type: Boolean, default: true },
    description: { type: String },
    rolloutPercentage: { type: Number, default: 100, min: 0, max: 100 },
    config: { type: Schema.Types.Mixed },
  },
    {
    collection: 'AuthFlag',
  },
  { timestamps: true }
);

mongoose.model("AuthFlag", AuthFlagSchema);


const LegalComplianceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    lastUpdated: { type: Date, default: Date.now }
  },
  { collection: "LegalCompliance", timestamps: true }
);

mongoose.model("LegalCompliance", LegalComplianceSchema);
