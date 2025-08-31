import React from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);
  return (
    <div
      id="topDoctors"
      className="flex flex-col items-center gap-4 my-16 px-4 text-gray-900 sm:px-6 md:px-10"
    >
      <h1 className="text-2xl sm:text-3xl font-medium text-center">
        Top Doctors to Book
      </h1>

      <p className="w-full max-w-md text-center text-sm px-2">
        Simply browse through our extensive list of trusted doctors.
      </p>

      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 pt-5 w-full">
        {doctors.slice(0, 10).map((item, index) => (
          <div
            onClick={() => {
              navigate(`/appointment/${item._id}`);
              scroll(0, 0);
            }}
            className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 bg-white"
            key={index}
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-48 sm:h-52 object-cover object-top bg-blue-50 rounded-t-lg"
            />

            <div className="p-4">
              <div className={`flex items-center gap-2 text-sm  ${!!item.available ? "text-green-500" : "text-gray-500" } `}>
                <p  className={`${!!item.available ? "bg-green-500" : "bg-red-500"} w-2 h-2 rounded-full`}></p>
                <p>{item.available ? "Avaiable" : "Not Available"}</p>
              </div>
              <p className="text-gray-900 text-base font-medium">{item.name}</p>
              <p className="text-gray-600 text-sm">{item.speciality}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          navigate(`/doctors`);
          scrollTo(0, 0);
        }}
        className="bg-blue-100 px-10 py-3 sm:px-12 sm:py-4 rounded-full mt-6 cursor-pointer text-gray-700 hover:text-black transition-colors"
      >
        More
      </button>
    </div>
  );
};

export default TopDoctors;
