import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: true }, // cloudinary URL
    speciality: { type: String, required: true },
    degree: { type: String, required: true },
    experience: { type: String, required: true }, // e.g. "5 years"
    about: { type: String, required: true },
    available: { type: Boolean},
    fees: { type: Number, required: true },
    address: { type: Object, required: true }, // e.g. { line1: "", city: "" }
    date: { type: Number, required: true }, // you might want to change this to Date
    slots_booked: { type: Object, default: {} },
  },
  { minimize: false }
);

const doctorModel = mongoose.model("doctor", doctorSchema);

export default doctorModel;
