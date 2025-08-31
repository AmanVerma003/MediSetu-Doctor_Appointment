import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [doctors, setDoctors] = useState([]);
  const [userData, setUserData] = useState(false);

  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : false
  );

  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/list`);
      if (!data?.doctors || data.doctors.length === 0) {
        toast.error("No doctors found");
        return;
      }
      setDoctors(data.doctors);
    } catch (error) {
      console.error("Error fetching doctors:", error);

      // Handle server-side message if available
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to fetch doctors. Please try again.");
      }
    }
  };

  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      });

      if (!data) {
        toast.error("User profile not found");
        return;
      }

      setUserData(data.userData);
    } catch (error) {
      console.error("Error while fetching userprofile:", error);

      // Handle server-side message if available
      if (error.response?.status === 401) {
        // Token invalid, clear it
        setToken(false);
        localStorage.removeItem("token");
        toast.error("Session expired. Please log in again.");
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to fetch userProfile. Please try again.");
      }
    }
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(false);
    }
  }, [token]);

  const value = {
    doctors,
    getDoctorsData,
    backendUrl,
    token,
    setToken,
    userData,
    setUserData,
    loadUserProfileData};

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
