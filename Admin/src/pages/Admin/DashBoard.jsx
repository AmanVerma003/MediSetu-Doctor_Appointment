import React from "react";
import { useContext } from "react";
import { AdminContext } from "../../context/AdminContext.jsx";
import { useEffect } from "react";
import { assets } from "../../assets_admin/assets.js";

const DashBoard = () => {
  const { dashData, adminDashboard, aToken, cancelAppointment } =
    useContext(AdminContext);
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
      adminDashboard();
    }
  }, [aToken]);

  return (
    dashData && (
      <div className="m-5">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-cyan-100 cursor-poointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.doctor_icon} alt="doctor_icon" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.doctors}
              </p>
              <p className="text-gray-500">doctors</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-cyan-100 cursor-poointer hover:scale-105 transition-all">
            <img
              className="w-14"
              src={assets.appointments_icon}
              alt="appointment_icon"
            />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.appointments}
              </p>
              <p className="text-gray-500">Appointments</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-cyan-100 cursor-poointer hover:scale-105 transition-all">
            <img
              className="w-14"
              src={assets.patients_icon}
              alt="patients_icon"
            />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.patients}
              </p>
              <p className="text-gray-500">Pateints</p>
            </div>
          </div>
        </div>

        <div className="bg-white">
          <div className="flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border border-cyan-200">
            <img src={assets.list_icon} alt="listIcon" />
            <p className="font-semibold text-gray-600">Latest Booking</p>
          </div>

          <div className="pt-4 border border-t-0 border-cyan-200">
            {dashData.latest?.length === 0 ? (
              <div className="px-6 py-4 text-center text-gray-500 text-sm bg-gray-50 rounded-lg shadow-sm">
                No appointments yet
              </div>
            ) : (
              dashData.latest?.map((item, index) => (
                <div
                  className="flex items-center px-6 py-3 hover:bg-gray-100"
                  key={index}
                >
                  <img
                    className="rounded w-12"
                    src={item.docData.image}
                    alt={item.docData.name}
                  />
                  <div className="flex-1 text-sm">
                    <p className="text-gray-800 font-medium">
                      {item.docData.name}
                    </p>
                    <p className="text-gray-600">
                      {slotDateFormt(item.slotDate)}
                    </p>
                  </div>
                  {item.isCompleted ? (
                    <p className="text-green-700 text-xs font-medium">
                      Completed
                    </p>
                  ) : (
                    <div className="flex">
                      <img
                        onClick={() => cancelAppointment(item._id)}
                        className="w-10 cursor-pointer transition-transform duration-200 hover:scale-110"
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
      </div>
    )
  );
};

export default DashBoard;
