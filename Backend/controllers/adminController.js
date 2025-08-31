import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorsModel.js";
import jwt from "jsonwebtoken";
import { appointmentModel } from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";

export const addDoctor = async (req, res) => {
  try {
    const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
    const imageFile = req.file;

    // Validate required fields (use imageFile instead of req.body.image)
    if (!name || !email || !password || !imageFile || !speciality || !degree || !experience || !about || !fees || !address) {
      return res.json({ success: false, message: "Missing Details" });
    }

    // Correct email validation: send error if email is invalid
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.json({ success: false, message: "Please enter a strong password (at least 8 characters)" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Upload image to Cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
    const imageUrl = imageUpload.secure_url;

    const doctorData = {
      name,
      available:true,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now(),
    };

    const existingDoctor = await doctorModel.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: "Doctor with this email already exists"
      });
    }

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    return res.status(201).json({ success: true, message: "Doctor added successfully", doctor: newDoctor });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

//Api for admin login

export const loginAdmin = async (req,res) => {

  try{

    const {email, password} = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){

      const token = jwt.sign({ email }, process.env.JWT_A_SECRET, {
        expiresIn: "1d",  
      });

      return res.status(200).json({
        success: true,
        message: "Admin logged in successfully",
        token,
      });

    }
    else{
    return res.status(401).json({
     success: false,
     message: "Invalid email or password",
    });}

  }catch(error){

    console.log(error);
    return res.status(500).json({success:false, message:error.message});
    
  };
};

// Api to get all doctors list
export const allDoctors = async (req,res) =>{
  try{

    const doctors = await doctorModel.find({}).select("-password");
    if(doctors.length === 0){
      res.status(400).json({
        success:false,
        message:"No doctors found"
      });
    };

    res.status(200).json({success:true, doctors})

  }catch(error){
    console.log("Error while fetching doctors list", error);
    return res.status(500).json({success:false, message:error.message});
  }
}

// Api to get All Appointments List
export const apointmentsAdmin = async (req,res) => {
  try {
    const appointments = await appointmentModel.find({});
    if(appointments.length === 0){
    return res.status(404).json({success:false, message:"Appointments not found"});
    }

    res.status(200).json({success:true, appointments});

  } catch (error) {
    console.log("Error while fetching appointments", error);
    return res.status(500).json({success:false, message:error.message});
  }
}

// Cancel any appointments directly by admin

export const cancelAppointments = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.status(400).json({
        success: false,
        message: "Unable to process the request. Please try again.",
        console: "Appointment ID is required", // for dev logs
      });
    }

    const appDelete = await appointmentModel.findByIdAndDelete(appointmentId);

    if (!appDelete) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found or already deleted.",
        console: "No appointment found for given ID",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Appointment has been successfully cancelled.",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while cancelling the appointment.",
      console: error.message, // for debugging
    });
  }
};

// Api to get dashboard data for admin panel

export const adminDashboard = async (req,res) => {
  try {

    const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});
     
    const dashData = {
      doctors: doctors?.length || 0,
      appointments: appointments?.length || 0,
      patients: users.length || 0,
      latest: appointments.reverse().slice(0,5) 
    };

    res.status(200).json({success:true, dashData});

  } catch (error) {
     return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching Dashboard data.",
      console: error.message, // for debugging
    });
  }
}
