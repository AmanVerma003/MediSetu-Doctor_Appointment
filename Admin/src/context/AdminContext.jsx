import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const AdminContext = createContext();

export const AdminContextProvider = (props) => {
  
  const [aToken, setAToken] = useState(
    localStorage.getItem("aToken") || ""
  );

  const [doctors, setDoctors] = useState([]);
  const [adminAppointments, setAdminAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getAllDoctors = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/all-doctors`, {
        headers: {
          Authorization: `Bearer ${aToken}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      });

      if (!data.success) {
        toast.error(data.message);
      } else {
        console.log(data.doctors);
        setDoctors(data.doctors);
      }
    } catch (error) {
      console.log(error);
      if (!error.response) {
        toast.error("Network error. Please check your internet connection.");
      } else {
        toast.error(error.response.data?.message || "Something went wrong!");
      }
    }
  };

  const updateAvailability = async (docId) => {
    try {
      const { data } = await axios.patch(
        `${backendUrl}/api/admin/${docId}/availability`,
        {}, // empty body
        {
          headers: {
            Authorization: `Bearer ${aToken}`,
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      setDoctors((prev) =>
        prev.map((doc) =>
          doc._id === docId
            ? { ...doc, available: !doc.available } // toggle locally
            : doc
        )
      );

      if (!data.success) {
        toast.error(data.message);
      } else {
        console.log(data.doctors);
        toast.success(data.message);
      }
    } catch (error) {
      if (!error.response) {
        toast.error("Network error. Please check your internet connection.");
      } else {
        toast.error(error.response.data?.message || "Something went wrong!");
      }
    }
  };

  const adminAllAppointments = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/admin/appointments`,
        {
          headers: {
            Authorization: `Bearer ${aToken}`,
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      if (!data) {
        toast.error("failed to fetch data");
      }

      if (!data.success) {
        toast.error(data.message);
      }

      setAdminAppointments(data.appointments);
      console.log(data.appointments);
    } catch (error) {
      toast.error(error);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/admin/cancelAppointments`,
        {
          data: { appointmentId },
          headers: {
            Authorization: `Bearer ${aToken}`,
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      if (!data.success) {
        toast.error(data.message);
        console.log(data.console);
      }
   
      toast.success(data.message);
      // Update state locally
      setAdminAppointments((prev) => prev.filter(item => item._id !== appointmentId));
      adminDashboard();
      } catch (error) {
      toast.error(error.response?.data?.message || "Error cancelling appointment");
      toast.error(error);
    };
  };

  const adminDashboard = async () => {
    try {
       const { data } = await axios.get(`${backendUrl}/api/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${aToken}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      });

      if (!data) {
        toast.error("failed to fetch data");
      };

      if(!data.success){
        toast.error(data.message);
      };
      
      setDashData(data.dashData);
      console.log(data.dashData);

    } catch (error) {
       toast.error(error.response?.data?.message || "Error fetching dashboard data");
      toast.error(error);
    };
  };

  const value = {
    aToken,
    setAToken,
    backendUrl,
    doctors,
    getAllDoctors,
    updateAvailability,
    adminAppointments,
    adminAllAppointments,
    setAdminAppointments,
    cancelAppointment,
    dashData,
    adminDashboard
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};
