import React, { useContext } from 'react';
import { AdminContext } from '../context/AdminContext.jsx';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets_admin/assets.js';
import { DoctorContext } from '../context/DoctorContext.jsx';

const Sidebar = () => {

  const {aToken} = useContext(AdminContext);
  const {dToken} = useContext(DoctorContext);
  return (
    <div className='min-h-screen bg-white'>
      {
        aToken && 
        <ul className='text-[#515151] mt-5'>

          <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3ff] border-r-4 border-blue-400" : ""}`} to={"/admin-dashboard"}>
            <img src={assets.home_icon} alt="hOME_ICON" />
            <p className='hidden md:block'>Dashboard</p>
          </NavLink>

          <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3ff] border-r-4 border-blue-400" : ""}`} to={"/all-appointments"}>
            <img src={assets.appointment_icon} alt="hOME_ICON" />
            <p className='hidden md:block'>Appointments</p>
          </NavLink>

          <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3ff] border-r-4 border-blue-400" : ""}`} to={"/add-doctor"}>
            <img src={assets.add_icon} alt="hOME_ICON" />
            <p className='hidden md:block'>Add Doctors</p>
          </NavLink>

          <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3ff] border-r-4 border-blue-400" : ""}`} to={"/doctor-list"}>
            <img src={assets.people_icon} alt="hOME_ICON" />
            <p className='hidden md:block'>Doctors List</p>
          </NavLink>

        </ul>
      }

      {
        dToken && 
        <ul className='text-[#515151] mt-5'>

          <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3ff] border-r-4 border-blue-400" : ""}`} to={"/doctor-dashboard"}>
            <img src={assets.home_icon} alt="hOME_ICON" />
            <p className='hidden md:block'>Doctor Dashboard</p>
          </NavLink>

          <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3ff] border-r-4 border-blue-400" : ""}`} to={"/doctor-appointments"}>
            <img src={assets.appointment_icon} alt="hOME_ICON" />
            <p className='hidden md:block'>Doctor Appointments</p>
          </NavLink>

          <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3ff] border-r-4 border-blue-400" : ""}`} to={"/doctor-profile"}>
            <img src={assets.people_icon} alt="hOME_ICON" />
            <p className='hidden md:block'>Profile</p>
          </NavLink>

        </ul>
      }
    </div>
  )
}

export default Sidebar