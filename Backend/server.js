import express from "express";
import cors from "cors";
import "dotenv/config";
import { connetDB } from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/admin.routes.js";
import { doctRouter } from "./routes/doctor.routes.js";
import { userRouter } from "./routes/user.routes.js";

const app = express();
const port = process.env.PORT || 4000;

// DB + Cloudinary
connetDB();
connectCloudinary();

// middleware 
app.use(express.json());
app.use(cors());
 
// api endpoints
app.use("/api/admin", adminRouter);  
app.use("/api/doctor", doctRouter);
app.use("/api/user", userRouter);

app.get("/", (req,res)=>{
    res.send("API IS WORKING")
});

app.listen(port,()=>{
    console.log("Server is runnning at ",port);
});