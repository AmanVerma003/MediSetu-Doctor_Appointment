import doctorModel from "../models/doctorsModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { appointmentModel } from "../models/appointmentModel.js";

export const availability = async (req, res) => {
  try {
    const { docId } = req.params;

    if (!docId) {
      return res.status(400).json({
        success: false,
        message: "Doctor ID is required",
      });
    }

    const docData = await doctorModel.findById(docId);

    if (!docData) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const updatedDoc = await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available}, {new:true}); 

    if (!updatedDoc) {
      return res.status(500).json({
        success: false,
        message: "Failed to update availability",
      });
    }

   return res.status(200).json({ success: true, message: "Availability Changed" });
  } catch (error) {
    console.log("Error while updating availablity", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const doctorList = async (req,res) => {
  
  try{

    const docData = await doctorModel.find({}).select("-password -email");

    if (docData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }
    
    return res.status(200).json({ success: true, doctors: docData});

  }catch(error){
    
    console.log("Error while fetching doctors list", error);
    return res.status(500).json({ success: false, message: error.message });

  }

}


// Api for doctor login
export const loginDoctor = async (req,res) => {
  try {
    const {email, password} = req.body;
    const doctor = await doctorModel.findOne({email});
    if (!doctor) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);

    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    const dToken = jwt.sign({id:doctor._id}, process.env.JWT_D_SECRET, {expiresIn:"1d"});

   return res.status(200).json({success:true, message:"Login Successful", dToken});

  } catch (error) {
    console.log("Error while login doctor", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Api to get doctor's appointment for doctor panel

export const doctorAppointments = async (req,res) => {
  try {
    const docId = req.docId;
    if(!docId){
      return res.status(400).json({success:false, message:"Doctor must be login", console:"Doctor id is required"})
    };
    const appoint = await appointmentModel.find({docId});
     
    return res.status(200).json({success:true, appoint});
  } catch (error) {
    console.log("Error while fetching doctor appointments", error);
    return res.status(500).json({ success: false, message: error.message });
  };
};

// Api to mark completed the appointment

export const appointmentCompleted = async (req,res) => {
  try {
    const {appointmentId} = req.body;
    const docId = req.docId;

    if(!appointmentId){
     return res.status(400).json({success:false, message:"Something went wrong!", console:"Appointment id is required"})
    }
    if(!docId){
      return res.status(400).json({success:false, message:"Something went wrong!", console:"Doctor id is required"})
    }

    const appointment = await appointmentModel.findById(appointmentId);

    if(appointment && appointment.docId === docId){
      await appointmentModel.findByIdAndUpdate(appointmentId, {isCompleted:true});
      return res.status(200).json({success:true, message:"Appointment completed successfully"})
    }else{
      return res.status(404).json({success:false, message:"Appointments not found"})
    }
  } catch (error) {
    console.log("Error while completing doctor's appointment", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Api to cancel the appointment

export const cancelAppointment = async (req,res) => {
  try {
    const {appointmentId} = req.body;
    const docId = req.docId;

    if(!appointmentId){
      return  res.status(400).json({success:false, message:"Something went wrong!", console:"Appointment id is required"})
    }
    if(!docId){
     return res.status(400).json({success:false, message:"Something went wrong!", console:"Doctor id is required"})
    }

    const appointment = await appointmentModel.findById(appointmentId);

    if(appointment && appointment.docId === docId){
      await appointmentModel.findByIdAndDelete(appointmentId, {isCompleted:true});
      return res.status(200).json({success:true, message:"Appointment cancelled successfully"})
    }else{
      return res.status(404).json({success:false, message:"Appointments not found"})
    }
  } catch (error) {
    console.log("Error while cancelling doctor's appointment", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Api to get dashboard data for doctor panel

export const doctorDashboard = async (req,res) => {
  try {
    const docId = req.docId;

    if(!docId){
     return res.status(400).json({success:false, message:"Something went wrong!", console:"Doctor id is required"})
    }

    const appointment = await appointmentModel.find({docId});

    let earnings = 0;

    appointment.map((item)=>{
      if(item.isCompleted || item.payment){
        earnings += item.amount
      }
    });

    let pateints = []

    appointment.map((item)=>{
      if(!pateints.includes(item.userId)){
        pateints.push(item.userId);
      };
    });

    const dashboard = {
      earnings : earnings || 0,
      appointments : appointment.length,
      pateints : pateints.length,
      latestAppointments : appointment.reverse().slice(0,5) 
    };

    return res.status(200).json({success:true, dashboard});
  } catch (error) {
    console.log("Error while cancelling doctor's appointment", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Api to get doctor profile for doctor panel

export const doctorProfile = async (req,res) => {
  try {
    const docId = req.docId;
    if(!docId){
     return res.status(400).json({success:false, message:"Something went wrong!", console:"Doctor id is required"})
    }
    const doctor = await doctorModel.findById(docId).select("-password");
    if(!doctor){
      return res.status(404).json({success:false, message:"Soemthing went wrong", console:"Doctor prfile not found"})
    }
    res.status(200).json({success:true, doctor});
  } catch (error) {
    console.log("Error while fetching doctor's profile", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Api to update doctor profile for doctor panel

export const updateDoctorProfile = async (req,res) => {
  try {
    const docId = req.docId;
    const {fees, address, available} = req.body;
    if(!docId){
     return res.status(400).json({success:false, message:"Something went wrong!", console:"Doctor id is required"})
    }
 
    if (fees === undefined && address === undefined && available === undefined) {
      return res
      .status(400)
      .json({ success: false, message:"Something went wrong",console: "No update fields provided." });
    }

    const doctor = await doctorModel.findByIdAndUpdate(docId, {fees, address, available}, {new:true});

    if(!doctor){
      return res.status(404).json({success:false, message:"Soemthing went wrong", console:"Failed to update the data"})
    }
    res.status(200).json({success:true, message:"Profile updated successfully"});
   } catch (error) {
    console.log("Error while updating doctor's profile", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}