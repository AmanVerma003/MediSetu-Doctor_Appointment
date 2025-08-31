import React from "react";
import { specialityData } from "../assets/assets_frontend/assets";
import { Link } from "react-router-dom";

const SpecialityMenu = () => {
  return (
    <div className="flex flex-col items-center mt-5 gap-6 py-5 px-4 text-gray-800 mb-[-1.8em]">
       
      <h1 className="text-2xl sm:text-3xl font-semibold text-center">
        Find by Speciality
      </h1>

      
      <p className="text-center text-sm sm:text-base max-w-xl">
        Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.
      </p>

       
      <div className="w-full p-4">
        <div className="flex sm:flex-wrap sm:justify-center gap-6 overflow-x-auto pb-2 scrollbar-hide">
          {specialityData.map((item, index) => (
            <Link onClick={()=>onscroll(0,0)}
              key={index}
              to={`/doctors/${item.speciality}`}
              className="flex-shrink-0 sm:flex-shrink sm:w-[120px] flex flex-col items-center transition-transform hover:scale-105"
            >
              <img
                src={item.image}
                alt={item.speciality}
                className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] lg:w-[120px] lg:h-[120px] object-contain mt-1"              />
              <p className="text-center text-sm mt-2">{item.speciality}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpecialityMenu;
