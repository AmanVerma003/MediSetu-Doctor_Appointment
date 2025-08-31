import React from "react";
import { useContext } from "react";
import { DoctorContext } from "../../context/DoctorContext.jsx";
import { useEffect } from "react";
import { AppContext } from "../../context/AppContext.jsx";
import { assets } from "../../assets_admin/assets.js";

const DoctorAppointment = () => {
  const {
    dToken,
    docAppointments,
    getAllAppointments,
    completeAppointment,
    cancelAppointment,
  } = useContext(DoctorContext);
  const { calculateAge } = useContext(AppContext);

  const month = [
    "",
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JULY",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  const slotDateFormt = (slotDate) => {
    const dateArray = slotDate.split("_");
    return (
      dateArray[0] + " " + month[Number(dateArray[1])] + " " + dateArray[2]
    );
  };

  useEffect(() => {
    if (dToken) {
      getAllAppointments();
    }
  }, [dToken]);

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">doctorAppointment</p>
      <div className="bg-white border border-cyan-100 rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll ">
        <div className="max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b border-gray-300">
          <p>#</p>
          <p>Pateint</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {docAppointments.length === 0 ? (
          <div className="px-6 py-4 text-center text-gray-500 text-sm  ">
            No appointments found
          </div>
        ) : (
          docAppointments.map((item, index) => (
            <div
              key={index}
              className="flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b border-gray-300 hover:bg-gray-200 rounded-md transition"
            >
              {/* Index */}
              <p className="max-sm:hidden">{index + 1}</p>

              {/* User Info */}
              <div className="flex items-center gap-2">
                <img
                  className="w-8 h-8 rounded-full object-cover"
                  src={item.userData.image}
                  alt={item.userData.name}
                />
                <p className="text-gray-800 font-medium">
                  {item.userData.name}
                </p>
              </div>

              {/* Payment Type */}
              <div>
                <p
                  className={`text-xs inline border px-2 rounded-full ${
                    item.payment
                      ? "border-blue-400 text-blue-600"
                      : "border-yellow-400 text-yellow-600"
                  }`}
                >
                  {item.payment ? "Online" : "CASH"}
                </p>
              </div>

              {/* Age */}
              <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>

              {/* Slot Date & Time */}
              <p>
                {slotDateFormt(item.slotDate)}, {item.slotTime}
              </p>

              {/* Amount */}
              <p className="font-medium text-gray-700">${item.amount}</p>

              {/* Status / Actions */}
              {item.isCompleted ? (
                <p className="text-green-700 text-xs font-medium">Completed</p>
              ) : (
                <div className="flex space-x-2">
                  <img
                    onClick={() => cancelAppointment(item._id)}
                    className="w-8 cursor-pointer transition-transform duration-200 hover:scale-110"
                    src={assets.cancel_icon}
                    alt="cancel_icon"
                  />
                  <img
                    onClick={() => completeAppointment(item._id)}
                    className="w-8 cursor-pointer transition-transform duration-200 hover:scale-110"
                    src={assets.tick_icon}
                    alt="tick_icon"
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DoctorAppointment;
