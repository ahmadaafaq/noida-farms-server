// // import {AgentAdminSchema} from "../UserDetails.js"
// // import "dotenv/config";
// // import fastifySession from "@fastify/session";
// // import ConnectMongoDBSession from "connect-mongodb-session";

// // export const PORT = process.env.PORT || 5002;
// // export const COOKIE_PASSWORD = process.env.COOKIE_PASSWORD;


// // const MongoDBStore = ConnectMongoDBSession(fastifySession)

// // export const sessionStore = new MongoDBStore({
// //     uri:process.env.mongoUrl,
// //     Collection : "sessions"
// // })

// // sessionStore.on('error',(error)=>{
// //     console.log("Session store error",error)
// // })


// // export const authenticate = async(email,password)=>{
// //     // uncomment this whrn admin created manually
// //   if(email && password){
// //       const user = await AgentAdminSchema.findOne({email});
// //         if(!user){
// //           return null
// //         }
// //         if(bcrypt.compare(password,user.password)){
// //           return Promise.resolve({email:email,password:password});
// //         }else{
// //           return null
// //         }
// //   }}\

// // config.js
// // import { AgentAdminSchema } from "...js";
// import mongoose from "mongoose";
// import "dotenv/config";
// import bcrypt from "bcrypt";
// import session from "express-session";
// import ConnectMongoDBSession from "connect-mongodb-session";

// export const PORT = process.env.PORT || 5002;
// export const COOKIE_PASSWORD = process.env.COOKIE_PASSWORD;

// // MongoDB session store for Express

// const AgentAndAdmin = mongoose.model("AgentAndAdmin");
// const MongoDBStore = ConnectMongoDBSession(session);

// export const sessionStore = new MongoDBStore({
//   uri: process.env.mongoUrl,
//   collection: "sessions",
// });

// sessionStore.on("error", (error) => {
//   console.error("Session store error:", error);
// });

// // Authentication function
// export const authenticate = async (email, password) => {
//   if (email && password) {
//     const user = await AgentAndAdmin.findOne({ email });
//     if (!user) return null;

//     const match = await bcrypt.compare(password, user.password);
//     if (match) {
//       return { email: user.email };
//     }
//   }
//   return null;
// };
