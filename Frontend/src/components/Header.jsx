import React from "react";
import { frontendAssets } from "../assets/assets_frontend/assets";
import { FaArrowRight } from "react-icons/fa";
const Header = () => {
 return (
  <div className="flex flex-col items-center px-4 sm:px-6 md:px-10 py-4">
    <img
      className="w-full max-h-[500px] object-cover rounded-xl"
      src={frontendAssets.doc_banner}
      alt="banner"
    />

    <a
      href="#topDoctors"
      className="group mt-6 sm:mt-8 inline-flex items-center gap-3 sm:gap-4 px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-blue-400 font-medium text-sm sm:text-base text-gray-200 hover:text-white transition-colors"
    >
      Book Appointment
      <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
    </a>
  </div>
);

};

export default Header;
