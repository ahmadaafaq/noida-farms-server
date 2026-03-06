// // import AdminJS from "adminjs";
// // import AdminJSFastify from "@adminjs/fastify";
// // import * as AdminJAMongoose from "@adminjs/mongoose";
// // // import * as Models from "../models/index.js";
// // import {authenticate, COOKIE_PASSWORD, sessionStore} from "./config.js"
// // import {dark, light ,noSidebar } from "@adminjs/themes";
// // import mongoose from 'mongoose';
// // AdminJS.registerAdapter(AdminJAMongoose)

// // const User = mongoose.model('UserInfo');
// // const Farmhouse = mongoose.model('FarmHouses');
// // const Order = mongoose.model('Order');
// // const Bank_Details = mongoose.model('Bank_Details');
// // const Transaction = mongoose.model('Transactions');
// // const AgentAndAdmin = mongoose.model('AgentAndAdmin');
// // const AuthFlag = mongoose.model('AuthFlag');
// // const LegalCompliance = mongoose.model('LegalCompliance');

// // export const admin = new AdminJS({
// //     resources:[{
// // resource : Models.User,
// // options:{
// //     listProperties:["phone","role", "isActivated"],
// //     filterProperties:["phone","role"],
// // }
// //     },
// //     {resource:Models.Farmhouse},
// //     {resource:Models.Transaction},
// //     {resource:Models.Order},
// //     {resource:Models.AgentAndAdmin},
// //     {resource:Models.Bank_Details},
// //     {resource:Models.AuthFlag},
// //     {resource:Models.LegalCompliance},
// // ],
// //     branding:{
// //         companyName:"Noida Farms",
// //         withMadeWithLove: true,
// //         // withMadeWithLove: true,
// //     },
// //     defaultTheme:dark.id,
// //     availableThemes:[dark,light,noSidebar],
// //     rootPath:'/admin'
// // })
 
// // export const buildAdminRouter = async(app)=>{
// //     await AdminJSFastify.buildAuthenticatedRouter(
// //         admin,{
// //             authenticate,
// //             cookiePassword:COOKIE_PASSWORD,
// //             cookieName:"adminjs"
// //         },
// //         app,{
// //             store:sessionStore,
// //             saveUnitialized : true,
// //             secret: COOKIE_PASSWORD,
// //             cookie:{
// //                 httpOnly: process.env.NODE_ENV ==="production",
// //                 secure: process.env.NODE_ENV ==="production",
                
// //             }
// //         }
// //     )
// // }

// // setup.js
// import AdminJS from "adminjs";
// import * as AdminJSMongoose from "@adminjs/mongoose";
// import AdminJSExpress from "@adminjs/express";
// import mongoose from "mongoose";
// import { authenticate, COOKIE_PASSWORD, sessionStore } from "./config.js";
// import { dark, light, noSidebar } from "@adminjs/themes";

// AdminJS.registerAdapter(AdminJSMongoose);

// // Register your Mongoose models
// const User = mongoose.model("UserInfo");
// const Farmhouse = mongoose.model("FarmHouses");
// const Order = mongoose.model("Order");
// const Bank_Details = mongoose.model("Bank_Details");
// const Transaction = mongoose.model("Transactions");
// const AgentAndAdmin = mongoose.model("AgentAndAdmin");
// const AuthFlag = mongoose.model("AuthFlag");
// const LegalCompliance = mongoose.model("LegalCompliance");

// export const adminSet = new AdminJS({
//   resources: [
//     { resource: User },
//     { resource: Farmhouse },
//     { resource: Order },
//     { resource: Bank_Details },
//     { resource: Transaction },
//     { resource: AgentAndAdmin },
//     { resource: AuthFlag },
//     { resource: LegalCompliance },
//   ],
//   branding: {
//     companyName: "Noida Farms",
//     withMadeWithLove: true,
//   },
//   defaultTheme: dark.id,
//   availableThemes: [dark, light, noSidebar],
//   rootPath: "/admin",
// });

// export const buildAdminRouter = async () => {
//   const router = AdminJSExpress.buildAuthenticatedRouter(
//     adminSet,
//     {
//       authenticate,
//       cookiePassword: COOKIE_PASSWORD,
//       cookieName: "adminjs",
//     },
//     null,
//     {
//       resave: false,
//       saveUninitialized: false,
//       store: sessionStore,
//       secret: COOKIE_PASSWORD,
//       cookie: {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//       },
//     }
//   );

//   return router;
// };
