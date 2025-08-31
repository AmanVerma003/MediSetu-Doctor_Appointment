import express from "express";
import { addDoctor, adminDashboard, allDoctors, apointmentsAdmin, cancelAppointments, loginAdmin } from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";
import { authAdmin } from "../middlewares/authAdmin.js";
import { availability  } from "../controllers/doctorController.js";

const adminRouter = express.Router();

adminRouter.get("/all-doctors", authAdmin, allDoctors);
adminRouter.get("/appointments", authAdmin, apointmentsAdmin);
adminRouter.get("/dashboard", authAdmin, adminDashboard);

adminRouter.post("/login", loginAdmin);
adminRouter.post("/add-doctor", authAdmin,upload.single('image'), addDoctor);

adminRouter.patch("/:docId/availability", authAdmin, availability);

adminRouter.delete("/cancelAppointments", authAdmin, cancelAppointments);

export default adminRouter;