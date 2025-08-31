import validator from "validator";
import bycrpt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorsModel.js";
import { appointmentModel } from "../models/appointmentModel.js";
import razorpay from "razorpay";
import crypto from "crypto";

//Api to register user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Missing Details" });
    }

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Enter a valid email" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "enter a valid password" });
    }

    const hashedPassword = await bycrpt.hash(password, 10);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    if (!user) {
      return res.status(500).json({
        success: false,
        message: "User could not be created due to a server error",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_U_SECRET);

    res
      .status(200)
      .json({ success: true, message: "user has been created", token });
  } catch (error) {
    console.log("Error while saving user data", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Api to login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Missing email or password" });
    }

    const findUser = await userModel.findOne({ email });

    if (!findUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bycrpt.compare(password, findUser.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password" });
    }

    const token = jwt.sign({ id: findUser._id }, process.env.JWT_U_SECRET, {
      expiresIn: "1d",
    });

    res
      .status(200)
      .json({ success: true, message: "User login successfully", token });
  } catch (error) {
    console.log("Error while login user data", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Api to get user profile details

export const getProfile = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing user Id" });
    }

    const userData = await userModel.findById(userId).select("-password");

    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, userData });
  } catch (error) {
    console.log("Error while fetching user profile data", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    // Validate required fields
    if (!name || !phone || !dob || !gender) {
      return res
        .status(400)
        .json({ success: false, message: "Missing Details" });
    }

    // Handle address parsing safely
    // Parses only when safe, and handles errors(like:-undefined and all) gracefully.
    let parsedAddress = address;
    if (typeof address === "string") {
      try {
        // only passing when it's a string
        parsedAddress = JSON.parse(address);
      } catch {
        return res
          .status(400)
          .json({ success: false, message: "Invalid address format" });
      }
    }

    // Update profile data
    const resp = await userModel.findByIdAndUpdate(
      userId,
      { name, phone, dob, gender, address: parsedAddress },
      { new: true }
    );

    if (!resp) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // If image provided, upload and update
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      await userModel.findByIdAndUpdate(userId, {
        image: imageUpload.secure_url,
      });
    }

    res
      .status(200)
      .json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.log("Error while fetching user profile data", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Api to book appointment
export const bookAppointment = async (req, res) => {
  try {
    const userId = req.userId; // from auth middleware
    const { docId, slotDate, slotTime } = req.body;
    // Step 1: Validate required fields
    if (!docId || !slotDate || !slotTime) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Step 2: Find doctor and validate availability
    const docData = await doctorModel.findById(docId).select("-password");

    if (!docData) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    if (!docData.available) {
      return res
        .status(400)
        .json({ success: false, message: "Doctor not available" });
    }

    // Step 3: Check if slot already booked
    const bookedSlots = docData.slots_booked?.[slotDate] || [];
    if (bookedSlots.includes(slotTime)) {
      return res
        .status(409)
        .json({ success: false, message: "Slot already booked" });
    }

    // Step 4: Get user data for appointment record
    const userData = await userModel.findById(userId).select("-password");
    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const cleanDocData = {
      _id: docData._id,
      name: docData.name,
      image: docData.image,
      speciality: docData.speciality,
      degree: docData.degree,
      experience: docData.experience,
      about: docData.about,
      available: docData.available,
      fees: docData.fees,
      address: docData.address,
    };
    // Step 5: Create appointment
    const newAppointment = new appointmentModel({
      userId,
      docId,
      slotDate,
      slotTime,
      userData,
      docData: cleanDocData,
      amount: docData.fees,
      date: Date.now(),
    });

    await newAppointment.save();

    // Step 6: Update doctor's booked slots
    const updatedSlots = { ...docData.slots_booked };
    if (!updatedSlots[slotDate]) {
      updatedSlots[slotDate] = [];
    }
    updatedSlots[slotDate].push(slotTime);

    await doctorModel.findByIdAndUpdate(docId, { slots_booked: updatedSlots });

    // Step 7: Respond
    res
      .status(201)
      .json({ success: true, message: "Appointment booked successfully" });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// API to get user appointments for frontend my-appointments page

export const listAppointment = async (req, res) => {
  try {
    const userId = req.userId; // from auth middleware
    const appointment = await appointmentModel.find({ userId });

    if (appointment.length === 0) {
      return res
        .status(404)
        .json({
          success: false,
          message: "No appointments found",
        });
    }

    return res.status(200).json({ success: true, appointment });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Api to cancel appointment
export const cancelAppointment = async (req, res) => {
  try {
    const userId = req.userId; // from auth middleware
    const { appointmentId } = req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    if (!appointmentId) {
      return res
        .status(400)
        .json({ success: false, message: "Appointment ID is required" });
    }

    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    const { docId, slotDate, slotTime } = appointment;
    // console.log("doc", docId, "slotDate", slotDate, "slotTime", slotTime);

    const findDoc = await doctorModel.findById(docId);

    if(!findDoc){
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    let slots_booked = findDoc.slots_booked
        
    slots_booked[slotDate] = slots_booked[slotDate].filter((e)=>e!==slotTime);

    await doctorModel.findByIdAndUpdate(docId, {slots_booked});

    const deleteAppointment = await appointmentModel.findOneAndDelete({
      _id: appointmentId,
      userId: userId,
    });

    if (!deleteAppointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found or already deleted",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Appointment canceled successfully",
    });

  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// Instance of RazorPay
const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Api to pay Online using Razorpay
export const paymentRazorpay = async (req,res) => {
  try {
    const {appointmentId} = req.body;
    const appointmentData =  await appointmentModel.findById(appointmentId);
    if(!appointmentData){
      return res.status(404).json({success:false, message:"Appointment cancelled or not found"})
    }

    // Creating options for razorpay payment
    const options = {
      amount : appointmentData.amount * 100,
      currency: process.env.CURRENCY,
      receipt : appointmentId
    }

    const order = await razorpayInstance.orders.create(options);

    // On Razorpay Dashboard (Orders tab), you will see: 
    // Order ID	                 Receipt	          Amount	Status
    // order_HK12345678 	66cf81d6c50f49d5e3f85f91	₹500	Created

    if (!order) {
      return res.status(400).json({ success: false, message: "Razorpay order creation failed" });
    };

    res.status(200).json({success:true, order});
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

// Api to verify payments
export const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Step 1: Generate expected signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    // Step 2: Compare signatures
    if (razorpay_signature === expectedSign) {
      // Fetch order info
      const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

      // Appointment ID stored in receipt field
      const appointmentId = orderInfo.receipt;

      // Update appointment status
      await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true });

      return res.status(200).json({
        success: true,
        message: "Payment verified & appointment confirmed",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
