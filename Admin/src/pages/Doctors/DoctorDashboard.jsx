import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext.jsx";
import { assets } from "../../assets_admin/assets.js";

const DoctorDashboard = () => {
  const {
    dashData,
    getDashData,
    dToken,
    completeAppointment,
    cancelAppointment,
  } = useContext(DoctorContext);
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
      getDashData();
    }
  }, [dToken]);

  return dashData ? (
    <div className="m-5">
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-cyan-100 cursor-poointer hover:scale-105 transition-all">
          <img className="w-14" src={assets.earning_icon} alt="doctor_icon" />
          <div>
            <p className="text-xl font-semibold text-gray-600">
              ${dashData.earnings}
            </p>
            <p className="text-gray-500">Earnings</p>
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
              {dashData.pateints}
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
          {dashData.latestAppointments.length === 0 ? (
            <div className="px-6 py-4 text-center text-gray-500 text-sm bg-gray-50 rounded-lg shadow-sm">
              No latest booking yet
            </div>
          ) : (
            dashData.latestAppointments.map((item, index) => (
              <div
                className="flex items-center px-6 py-3 hover:bg-gray-100 rounded-lg transition"
                key={index}
              >
                <img
                  className="rounded-full w-12 h-12 object-cover border p-1"
                  src={item.userData.image}
                  alt={item.userData.name}
                />
                <div className="flex-1 text-sm ml-3">
                  <p className="text-gray-800 font-medium">
                    {item.userData.name}
                  </p>
                  <p className="text-gray-600">
                    {slotDateFormt(item.slotDate)}, {item.slotTime}
                  </p>
                </div>

                {item.isCompleted ? (
                  <p className="text-green-700 text-xs font-medium">
                    Completed
                  </p>
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
    </div>
  ) : (
    <div>Loading dashboard...</div>
  );
};

export default DoctorDashboard;
