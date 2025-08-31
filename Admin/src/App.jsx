import React, { useEffect } from "react";
import Login from "./pages/Login.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContext } from "react";
import { AdminContext } from "./context/AdminContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import {Route, Routes, useNavigate} from "react-router-dom";
import DashBoard from "./pages/Admin/DashBoard.jsx";
import AllAppointment from "./pages/Admin/AllAppointment.jsx";
import AddDcotors from "./pages/Admin/AddDcotors.jsx";
import DoctorsList from "./pages/Admin/DoctorsList.jsx";
import { DoctorContext } from "./context/DoctorContext.jsx";
import DoctorDashboard from "./pages/Doctors/doctorDashboard.jsx";
import DoctorAppointment from "./pages/Doctors/doctorAppointment.jsx";
import DoctorProfile from "./pages/Doctors/doctorProfile.jsx";

const App = () => {
  const { aToken } = useContext(AdminContext);
  const {dToken} = useContext(DoctorContext);
  const navigate = useNavigate();

  useEffect(() => {
    // only run if user is at root path "/"
    if (window.location.pathname === "/") {
      if (dToken) {
        navigate("/doctor-dashBoard", { replace: true });
      } else if (aToken) {
        navigate("/admin-dashboard", { replace: true });
      }
    }
  }, [dToken, aToken, navigate]);

  return aToken || dToken ? (
    <div className="bg-[#F8F9FD]">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Navbar/>
      <div className="flex items-start">
        <Sidebar/>
        <Routes>
          {/* {Admin Route} */}
          {/* <Route path="/" element={<></>} /> */}
          <Route path="/admin-dashboard" element={<DashBoard/>} />
          <Route path="/all-appointments" element={<AllAppointment/>}/>
          <Route path="/add-doctor" element={<AddDcotors/>} />
          <Route path="/doctor-list" element={<DoctorsList/>} />
          {/* {Doctor Route} */}
          <Route path="/doctor-dashBoard" element={<DoctorDashboard/>}/>
          <Route path="/doctor-appointments" element={<DoctorAppointment/>}/>
          <Route path="/doctor-profile" element={<DoctorProfile/>}/>
         </Routes>
      </div>
    </div>
  ) : (
    <div>
      <Login />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default App;
