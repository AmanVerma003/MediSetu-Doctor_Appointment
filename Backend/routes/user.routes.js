import express from "express";
import { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, paymentRazorpay, verifyRazorpay } from "../controllers/userController.js";
import { authUser } from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js";

export const userRouter = express.Router(registerUser);

userRouter.get("/get-profile", authUser, getProfile);
userRouter.get("/appointment", authUser, listAppointment);

userRouter.patch("/update-profile",upload.single("image"), authUser, updateProfile);

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/book-appointment", authUser, bookAppointment);
userRouter.post("/payment-razorpay", authUser, paymentRazorpay);
userRouter.post("/verifyRazorpay", authUser, verifyRazorpay);

userRouter.delete("/deleteAppointment", authUser, cancelAppointment)