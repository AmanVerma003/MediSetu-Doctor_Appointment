import React, { useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { toast } from "react-toastify";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MyAppointments() {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);
  const [appointment, setAppointment] = useState([]);
  const navigate = useNavigate();
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

  const getAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointment`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      });

      if (!data) {
        toast.error("Error from the server side");
        return;
      }

      if (!data.success) {
        return toast.error(data.message);
      }

      setAppointment(data.appointment.reverse());
    } catch (error) {
      console.error("Error fetching doctors:", error);

      // Handle server-side message if available
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to fetch Appointments. Please try again.");
      }
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/user/deleteAppointment`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { appointmentId },
        }
      );

      if (!data) {
        toast.error("Error from the server side");
        return;
      }

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);

      // fast ui update for timeslots
      getDoctorsData();

      // for fast ui updates
      setAppointment((prevAppointments) =>
        prevAppointments.filter((appt) => appt._id !== appointmentId)
      );

      // console.log("appointment", appointment);
    } catch (error) {
      console.error("Error fetching doctors:", error);

      // Handle server-side message if available
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to fetch Appointments. Please try again.");
      }
    }
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Appointment payment",
      description: "Appointment payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        console.log(response);
        try {
          const { data } = await axios.post(
            `${backendUrl}/api/user/verifyRazorpay`,
            response,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              timeout: 10000,
            }
          );

          if (data.success) {
            toast.success("Payment verified & appointment confirmed");
            getAppointments();
            navigate("/my-appointments")
          } else {
            toast.error(data.message || "Payment verification failed");
          }
        } catch (error) {
          console.error("Error verifying payment:", error);
          toast.error("Something went wrong during verification");
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/payment-razorpay`,
        { appointmentId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      if (data.success) {
        console.log(data.order);
        initPay(data.order);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);

      // Handle server-side message if available
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to fetch Appointments. Please try again.");
      }
    }
  };

  useEffect(() => {
    if (token) {
      getAppointments();
      // console.log("Updated Appointments:", appointment);
    }
  }, [token]);

  return (
    <div className="mb-15">
      <p className="pb-3 mt-12 font-medium text-zinc-600 border-b  border-zinc-300 text-xl">
        My appointment
      </p>
      <div>
        {appointment?.map((doc, ind) => (
          <div
            className="grid grid-cols[1fr_2fr] gap-4 sm:flex sm:gap-6 py-3 border-b border-zinc-300"
            key={ind}
          >
            <div>
              <img
                className="w-32 bg-indigo-50"
                src={doc.docData.image}
                alt={doc.docData.name}
              />
            </div>
            <div className="flex-1 text-sm text-zinc-600">
              <p className="text-neutral-800 font-semibold">
                {doc.docData.name}
              </p>
              <p>{doc.docData.speciality}</p>
              <p className="text-zinc-700 font-medium mt-1">Address:</p>
              <p className="text-xs">{doc.docData.address?.line1}</p>
              <p className="text-xs">{doc.docData.address?.line2}</p>
              <p className="text-xs mt-1">
                <span className="text-sm text-neutral-700 font-medium">
                  Date & Time:
                </span>{" "}
                {" " + slotDateFormt(doc.slotDate)} | {doc.slotTime}
              </p>
            </div>
            <div></div>

            <div className="flex flex-col gap-2 justify-end">
              {doc.isCompleted ? (
                <div className="flex flex-col gap-2 justify-end">
                  <button className="cursor-pointer text-sm text-green-500 text-center sm:min-w-48 py-2 border border-green-500 bg-white rounded transition-all duration-300 hover:text-white">
                    Appointment Completed
                  </button> 
                  <button className="cursor-pointer text-sm text-white text-center sm:min-w-48 py-4 border border-white bg-white rounded transition-all duration-300 hover:text-white">
                  </button>
                </div>
              ) : doc.payment ? (
                <button className="cursor-pointer text-sm text-white text-center sm:min-w-48 py-2 border border-zinc-300 bg-green-500 rounded transition-all duration-300 hover:text-white">
                  Paid
                </button>
              ) : (
                <button
                  onClick={() => appointmentRazorpay(doc._id)}
                  className="cursor-pointer text-sm text-stone-500 text-center sm:min-w-48 py-2 border border-zinc-300 rounded hover:bg-blue-500 transition-all duration-300 hover:text-white"
                >
                  Pay Online
                </button>
              )}

              {!doc.isCompleted && (
                <button
                  onClick={() => cancelAppointment(doc._id)}
                  className="cursor-pointer text-sm text-stone-500 text-center sm:min-w-48 py-2 border border-zinc-300 rounded hover:bg-red-600  transition-all duration-300 hover:text-white"
                >
                  Cancel appointment
                </button>
              )}
            </div>
          </div>
        ))}
        {(!appointment || appointment.length === 0) && (
          <div className="flex flex-col items-center justify-center py-10 text-center bg-gray-50 rounded-2xl shadow-md mt-15">
            <p className="text-lg font-semibold text-[#52525c] mb-2">
              You don’t have any appointments yet
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Book your first appointment now!
            </p>
            <button
              onClick={() => navigate("/doctors")}
              className="cursor-pointer px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-all duration-300"
            >
              Click Here
            </button>
          </div>
        )}{" "}
      </div>
    </div>
  );
}

export default MyAppointments;
