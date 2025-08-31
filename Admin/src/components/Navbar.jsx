import React, { useContext } from 'react'
import { assets } from '../assets_admin/assets.js'
import { AdminContext } from '../context/AdminContext.jsx'
import { DoctorContext } from '../context/DoctorContext.jsx';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const {aToken, setAToken} = useContext(AdminContext);
    const {dToken, setDToken} = useContext(DoctorContext);
    const navigate = useNavigate();

    const logout = () => {
      if (aToken || dToken) {
        setAToken("");
        setDToken("");
        localStorage.removeItem("aToken");
        localStorage.removeItem("dToken");
        navigate("/login");
      }
    };

  return (
    <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
        <div className='flex items-center gap-2 text-xs'>
            <div className='flex items-center'>
                <img className='w-12 h-12 mt-1.5 ml-1.5' src={assets.MediSetu} alt="Admin_logo" />
                <div className='mb-[-0.5em] pl-1'>
                   <p className='font-extrabold tracking-wide text-xl text-[#5e17eb] pb-'>MEDISETU</p>
                   <p className='pt-0.5 text-[12px] text-start mt-[-0.6em] text-gray-700'>Dashboard Panel</p>
                </div>
            </div>
            <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>{aToken? "Admin" : "Doctor"}</p>
        </div>
        <button onClick={()=>logout()} className='bg-[#5e17eb] text-white text-sm px-10 py-2 rounded-full cursor-pointer'>Logout</button>
    </div>
  )
}

export default Navbar