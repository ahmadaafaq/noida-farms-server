// import mongoose
const mongoose = require('mongoose');
const moment = require('moment-timezone');

//  create variable to store schema or structure of user data
const UserDetailSchema = new mongoose.Schema(
  {
    name: String,
    lastName: String,
    // email: {type: String, unique: true},
    email: { type: String, unique: true, sparse: true, default: undefined },
    phoneNumber: { type: String, unique: true, sparse: true, default: undefined },
    password: String,
    image: String,
    gender: String,
    address: String,
    dob: String,
    ActiveUser : String,
    isAdult: Boolean,
    resetPasswordToken : String,
    resetPasswordExpires :Date,
  },
  {
    // for export schema give collation name
    collection: 'UserInfo',
    // collection
  },
);
//  here we export schema
mongoose.model('UserInfo', UserDetailSchema);
// schema for farmhouse create
const FarmhouseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
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
    images: [
      {
        uri: String,
      },
    ],
    description: {
      title: String,
      body: String,
    },
    pricing: [
      {
        type: {
          type: String, 
          enum: ['dayFare', 'nightFare', 'fullDayFare'], 
        },
        fare: Number, // Price for this type
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
    approved: {
      type: String,
      enum: ['pending', 'approved'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
    collection: 'FarmHouses',
  },
);
module.exports = mongoose.model('FarmHouses', FarmhouseSchema);

// order code schema

const OrderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'},
  farmhouse_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmhouse',
  },
  imagesfordb:{type:String},
  farmhouse_name: {type: String, },
  UserName: {type: String, },
  PhoneNumber: {type: String, },
  userEmail: {type: String, },
  location: {type: String, },
  price_per_night: {type: Number, },
  total_price: {type: Number, },
  check_in_date: {type: Date, },
  BookFor:{
    type:String,
    enum:["dayFare", "nightFare", "fullDayFare"]
  },
  // check_out_date: {type: Date, },
  // istDate: { type: String },
  // istTime: { type: String },
  number_of_guests: {type: Number},
  services: { type: [String] },
  special_requests: {type: String},
  payment: {
    razorpay_payment_id: {type: String, },
    status: {
      type: String,
      enum: ['Pending', 'Success', 'Failed'],
    },
    amount_paid: {type: Number, },
    payment_date: {type: Date, },
  },
  booking_status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled'],
  },
  created_at: {
    type: String,
    default: () => moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
  },
  updated_at: {
    type: String,
    default: () => moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
  },
},
{collection: 'Order'});
module.exports = mongoose.model('Order', OrderSchema);

const BankSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // or String if using custom ID
      required: true,
      // unique: true, // one user = one bank record
      ref: 'User',  // optional: link to User model
    },
    bankName: {
      type: String,
      required: true,
      trim: true,
    },
    accountName: {
      type: String,
      required: true,
      trim: true,
    },
    accountNumber: {
      type: String,
      required: true,
      unique: true, // prevent duplicates
      trim: true,
    },
    IfscCodeNumber: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    collection: 'Bank_Details',
    timestamps: true,
  }
);

 mongoose.model('Bank_Details', BankSchema);