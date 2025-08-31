import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext.jsx';
import { toast } from "react-toastify";
import axios from "axios";

const DoctorProfile = () => {

  const {dToken, docProfile, getDocProfile, setDocProfile, backendUrl} = useContext(DoctorContext);
  const [isEdit, setIsEdit] = useState(false);
  
  const updateDocProfile = async () => {
    try {
      
      const updateData = {
        address: docProfile.address,
        fees: docProfile.fees,
        available: docProfile.available,
      };

      console.log("Update data being sent:", updateData, "backendUrl",backendUrl )

      const { data } = await axios.patch(
        `${backendUrl}/api/doctor/update-profile`,
        updateData ,
        {
          headers: {
            Authorization: `Bearer ${dToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!data.success) {
        toast.error(data.message);
        console.log(data.console);
      }

      toast.success(data.message);
      getDocProfile();
      setIsEdit(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      toast.error(error);
    }
  }
  
  useEffect(()=>{
    if(dToken){
      getDocProfile()
    };
  },[dToken])

  return docProfile && (
    <div>

      <div className='flex flex-col gap-4 m-5'>

        <div>
          <img className="bg-blue-400 w-full sm:max-w-64 rounded-lg" src={docProfile.image} alt={docProfile.name} />
        </div>

        {/* ----doc info : name, degree, experience.. */}
        <div className='flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white'>
          
          <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>{docProfile.name}</p>
          <div className='flex items-center gap-2 mt-1 text-gray-600'>
            <p>{docProfile.degree}-{docProfile.speciality}</p>
            <button className='py-0.5 px-2 border border-cyan-300 text-xs rounded-full'>{docProfile.experience}</button>
          </div>
          
  
          {/* ----doc about---- */}
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3'>About:</p>
            <p className='text-sm text-gray-600 max-w-[700px] mt-1'>{docProfile.about}</p>
          </div>
  
          <p className='text-gray-600 font-medium mt-4'>Appointment fees: <span className="text-gray-700" > ${isEdit ? <input className='bg-gray-100 rounded-lg w-15' type="number" onChange={(e)=>setDocProfile((prev)=>({...prev, fees: e.target.value}))} value={docProfile.fees || ""} name="" id="" />   :  docProfile.fees}</span></p>
  
          <div className='flex gap-2 py-2'>
            <p className='text-gray-800'>Address:</p>
            <p className='text-sm text-gray-800'>
              {isEdit?<input className='bg-gray-100 rounded-lg' type='text' onChange={(e)=>setDocProfile(prev=>({...prev, address:{...prev.address, line1:e.target.value}}))} value={docProfile.address?.line1} />:docProfile.address?.line1 || ""}
            <br/>
               {isEdit?<input className='bg-gray-100 rounded-lg' type='text' onChange={(e)=>setDocProfile(prev=>({...prev, address:{...prev.address, line2:e.target.value}}))} value={docProfile.address?.line2} />:docProfile.address?.line2 || ""}
            </p>
          </div>
  
          <div className='flex gap-1 pt-2'>
            <input onChange={()=> isEdit && setDocProfile(prev=>({...prev, available: !prev.available}))} checked={!!docProfile.available} type="checkbox" name="" id="" />
            <label htmlFor="">{isEdit ? <span className='bg-gray-100'>Available</span> : <span>Available</span>}</label>
          </div>

          {isEdit ?           
            <button type='button' onClick={updateDocProfile} className='px-4 py-1 border border-blue-500 text-sm rounded-full mt-5 cursor-pointer hover:bg-blue-500 hover:text-white'>Save</button>
            :
            <button type='button' onClick={()=>setIsEdit(true)} className='px-4 py-1 border border-blue-500 text-sm rounded-full mt-5 cursor-pointer hover:bg-blue-500 hover:text-white'>Edit</button>
          }

        </div>
      </div> 
    </div>
  )
}

export default DoctorProfile;