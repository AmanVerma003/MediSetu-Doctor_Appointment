import React from "react";
import { frontendAssets } from "../assets/assets_frontend/assets";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const Banner = () => {
  const navigate = useNavigate();
  const {token} = useContext(AppContext);
  return (
    <div className="flex pt-3 flex-col-reverse lg:flex-row justify-between items-center bg-[#5f6fff] rounded-lg px-4 sm:px-10 md:px-14 lg:px-24 my-20 mx-4 sm:mx-6 md:mx-10 overflow-hidden">
      {/* ----Left side---- */}
      <div className="flex-1 text-center lg:text-left py-10 sm:py-12 md:py-16 lg:py-24 lg:pl-5">
        <div className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-semibold text-white leading-tight">
          <p>Book Appointment</p>
          <p className="mt-4">With 100+ Trusted</p>
        </div>{token ? (
        <button
          onClick={() => {
            navigate("/doctors");
            scroll(0, 0);
          }}
          className="bg-white text-sm sm:text-base text-gray-600 px-8 py-3 rounded-full mt-6 hover:scale-105 transition-all cursor-pointer"
        >
          Check top doctors here 
        </button>
        ) : (
        <button
          onClick={() => {
            navigate("/login");
            scroll(0, 0);
          }}
          className="bg-white text-sm sm:text-base text-gray-600 px-8 py-3 rounded-full mt-6 hover:scale-105 transition-all cursor-pointer"
        >
          Create Account
        </button>)}
      </div>

      {/* ----Right side---- */}
      <div className="w-full sm:w-2/3 lg:w-[370px] relative max-h-[450px] overflow-hidden">
        <img
          className="w-full h-full object-cover object-top"
          src={frontendAssets.appointment_img}
          alt="Appointment Banner"
        />
      </div>
    </div>
  );
};

export default Banner;
