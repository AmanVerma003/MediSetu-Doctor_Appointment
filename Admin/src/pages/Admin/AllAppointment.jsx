import React from "react";
import { useContext } from "react";
import { AdminContext } from "../../context/AdminContext.jsx";
import { useEffect } from "react";
import { AppContext } from "../../context/AppContext.jsx";
import { assets } from "../../assets_admin/assets.js";

const AllAppointment = () => {
  const {
    adminAppointments,
    adminAllAppointments,
    setAdminAppointments,
    aToken,
    cancelAppointment,
  } = useContext(AdminContext);
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
    if (aToken) {
      adminAllAppointments();
    }
  }, [aToken]);

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Appointments</p>

      <div className="bg-white border border-gray-200 rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll">
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b border-gray-300">
          <p>#</p>
          <p>Pateint</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>

        {adminAppointments.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No appointments found
          </div>
        ) : (
          adminAppointments?.map((item, index) => (
            <div
              key={index}
              className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b border-gray-300 hover:bg-gray-200"
            >
              <p className="mx-sm:hidden">{index + 1}</p>
              <div className="flex items-center gap-2">
                <img
                  className="w-8 rounded-full"
                  src={item.userData.image}
                  alt=""
                />
                <p>{item.userData.name}</p>
              </div>
              <p>{calculateAge(item.userData.dob)}</p>
              <p>
                {slotDateFormt(item.slotDate)}, {item.slotTime}
              </p>
              <div className="flex items-center gap-2">
                <img
                  className="w-8 rounded-full bg-gray-100"
                  src={item.docData.image}
                  alt=""
                />
                <p>{item.docData.name}</p>
              </div>
              <p>${item.amount}</p>

              {item.isCompleted ? (
                <p className="text-green-700 text-xs font-medium">Completed</p>
              ) : (
                <div className="flex">
                  <img
                    onClick={() => cancelAppointment(item._id)}
                    className="w-10 cursor-pointer  transition-transform duration-200 hover:scale-110"
                    src={assets.cancel_icon}
                    alt="cancel_icon"
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

export default AllAppointment;
