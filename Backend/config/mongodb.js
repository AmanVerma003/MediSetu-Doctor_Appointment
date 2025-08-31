import mongoose from "mongoose";
 
export const connetDB = async () => { 
    mongoose.connection.on("connected", () =>
    console.log("MongoDB connected successfully"));
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/MEDISETU`);
  } catch (error) {
    console.log("MongoDB connection error:", error);
  }
};
