import express from "express";
import { appointmentCompleted, cancelAppointment, doctorAppointments, doctorDashboard, doctorList, doctorProfile, loginDoctor, updateDoctorProfile } from "../controllers/doctorController.js";
import { authDoc } from "../middlewares/authDoc.js";

export const doctRouter = express.Router();

doctRouter.get("/list", doctorList);
doctRouter.get("/appointments", authDoc, doctorAppointments);
doctRouter.get("/dashboard", authDoc, doctorDashboard);
doctRouter.get("/profile", authDoc, doctorProfile);

doctRouter.post("/login", loginDoctor);

doctRouter.patch("/complete-appointment", authDoc, appointmentCompleted);
doctRouter.patch("/update-profile", authDoc, updateDoctorProfile);
doctRouter.delete("/cancel-appointment", authDoc, cancelAppointment);