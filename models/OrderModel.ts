// // // const {default: mongoose} = require('mongoose');

// // // require('./UserDetails');
// // // const mongoosen = require('mongoose');
// // // const mongoUrl =
// // //   'mongodb+srv://aj95608710:LA8h2gqxwJbmmVn1@cluster0.ksejl.mongodb.net/NoidaFarms?retryWrites=true&w=majority&appName=Cluster0';
// // // // // secret key
// // // const JWT_SECRET =
// // //   'hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jdsds039[]]pou89ywe';
// // // // to connect mongoose use this step
// // // mongoose
// // //   .connect(mongoUrl)
// // //   .then(() => {
// // //     // console.log('database connceted');
// // //   })
// // //   .catch((e: any) => {
// // //     // console.log(e, 'hey');
// // //   });

// // // const Order = mongoose.model('Order');
// // // const OrderSchema = new mongoose.Schema(
// // //   {
// // //     user_id: {
// // //       type: mongoose.Schema.Types.ObjectId,
// // //       ref: 'User',
// // //     },
// // //     farmhouse_id: {
// // //       type: mongoose.Schema.Types.ObjectId,
// // //       ref: 'Farmhouse',
// // //     },
// // //     farmhouse_name: {type: String},
// // //     location: {type: String},
// // //     price_per_night: {type: Number},
// // //     total_price: {type: Number},
// // //     check_in_date: {type: Date},
// // //     check_out_date: {type: Date},
// // //     number_of_guests: {type: Number},
// // //     special_requests: {type: String},
// // //     payment: {
// // //       razorpay_payment_id: {type: String},
// // //       status: {
// // //         type: String,
// // //         enum: ['Pending', 'Success', 'Failed'],
// // //       },
// // //       amount_paid: {type: Number},
// // //       payment_date: {type: Date},
// // //     },
// // //     booking_status: {
// // //       type: String,
// // //       enum: ['Pending', 'Confirmed', 'Cancelled'],
// // //     },
// // //     created_at: {type: Date, default: Date.now},
// // //     updated_at: {type: Date, default: Date.now},
// // //   },
// // //   {
// // //     collection: 'Order',
// // //   },
// // // );

// // // module.exports = mongoose.model('Order', OrderSchema);
// // // module.exports = Order;

// // const mongoose = require('mongoose');
// // 
// // import mongoose, { Schema, Document } from 'mongoose';
// // const orderSchema = new mongoose.Schema({

// //     user_id: {
// //               type: mongoose.Schema.Types.ObjectId,
// //               ref: 'User',
// //             },
// //             farmhouse_id: {
// //               type: mongoose.Schema.Types.ObjectId,
// //               ref: 'Farmhouse',
// //             },
// //             farmhouse_name: {type: String},
// //             location: {type: String},
// //             price_per_night: {type: Number},
// //             total_price: {type: Number},
// //             check_in_date: {type: Date},
// //             check_out_date: {type: Date},
// //             number_of_guests: {type: Number},
// //             special_requests: {type: String},
// //             payment: {
// //               razorpay_payment_id: {type: String},
// //               status: {
// //                 type: String,
// //                 enum: ['Pending', 'Success', 'Failed'],
// //               },
// //               amount_paid: {type: Number},
// //               payment_date: {type: Date},
// //             },
// //             booking_status: {
// //               type: String,
// //               enum: ['Pending', 'Confirmed', 'Cancelled'],
// //             },
// //             created_at: {type: Date, default: Date.now},
// //             updated_at: {type: Date, default: Date.now},

// // })
// // const Order = mongoose.model('Order', orderSchema);

// // module.exports = Order;

// import mongoose, { Schema, Document } from 'mongoose';

// // Define the interface for TypeScript
// export interface IOrder extends Document {
//   user_id: mongoose.Types.ObjectId;
//   farmhouse_id: mongoose.Types.ObjectId;
//   farmhouse_name: string;
//   location?: string;
//   price_per_night: number;
//   total_price: number;
//   check_in_date: Date;
//   check_out_date: Date;
//   number_of_guests: number;
//   special_requests?: string;
//   payment: {
//     razorpay_payment_id: string;
//     status: 'Pending' | 'Success' | 'Failed';
//     amount_paid: number;
//     payment_date?: Date;
//   };
//   booking_status: 'Confirmed' | 'Cancelled' | 'Pending';
//   created_at?: Date;
//   updated_at?: Date;
// }

// // Schema
// const OrderSchema: Schema = new mongoose.Schema<IOrder>(
//   {
//     user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//     farmhouse_id: { type: Schema.Types.ObjectId, ref: 'Farmhouse', required: true },
//     farmhouse_name: { type: String, required: true },
//     location: { type: String },
//     price_per_night: { type: Number, required: true },
//     total_price: { type: Number, required: true },
//     check_in_date: { type: Date, required: true },
//     check_out_date: { type: Date, required: true },
//     number_of_guests: { type: Number, required: true },
//     special_requests: { type: String, default: 'No special requests' },
//     payment: {
//       razorpay_payment_id: { type: String },
//       status: { type: String, enum: ['Pending', 'Success', 'Failed'], required: true },
//       amount_paid: { type: Number, required: true },
//       payment_date: { type: Date, default: Date.now },
//     },
//     booking_status: { type: String, enum: ['Confirmed', 'Cancelled', 'Pending'], default: 'Confirmed' },
//     created_at: { type: Date, default: Date.now },
//     updated_at: { type: Date, default: Date.now },
//   },
//   { timestamps: true }
// );

// const Order = mongoose.model<IOrder>('Order', OrderSchema);

// export default Order;


import mongoose, { Schema, Document } from 'mongoose';

// Define the Payment Schema
const PaymentSchema = new Schema({
  razorpay_payment_id: { type: String },
  status: { type: String, enum: ['Pending', 'Success', 'Failed'] },
  amount_paid: { type: Number },
  payment_date: { type: Date },
});

// Define the Order Interface for TypeScript
export interface IOrder extends Document {
  user_id: mongoose.Types.ObjectId;
  farmhouse_id: mongoose.Types.ObjectId;
  farmhouse_name: string;
  location?: string;
  price_per_night: number;
  total_price: number;
  check_in_date: Date;
  check_out_date: Date;
  number_of_guests: number;
  special_requests?: string;
  payment: {
    razorpay_payment_id: string;
    status: 'Pending' | 'Success' | 'Failed';
    amount_paid: number;
    payment_date?: Date;
  };
  booking_status: 'Pending' | 'Confirmed' | 'Cancelled';
  created_at: Date;
  updated_at: Date;
}

// Define the Order Schema
const OrderSchema = new Schema<IOrder>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    farmhouse_id: { type: Schema.Types.ObjectId, ref: 'Farmhouse' },
    farmhouse_name: { type: String },
    location: { type: String },
    price_per_night: { type: Number },
    total_price: { type: Number },
    check_in_date: { type: Date },
    check_out_date: { type: Date },
    number_of_guests: { type: Number },
    special_requests: { type: String },
    payment: PaymentSchema,
    booking_status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'] },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  {
    collection: 'Order',
  }
);

// Export the Model
const Order = mongoose.model<IOrder>('Order', OrderSchema);
export default Order;
