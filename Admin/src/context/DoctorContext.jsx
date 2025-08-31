import { useEffect, useState } from "react";
import { createContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";


export const DoctorContext =  createContext();

export const DoctorContextProvider = (props) =>{
    
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [dToken, setDToken] = useState(
      localStorage.getItem("dToken") || ""
    );
    const [docAppointments, setDocAppointments] = useState([]); 
    const [dashData, setDashData] = useState(false);
    const [docProfile, setDocProfile] = useState([]);
    

    const getAllAppointments = async () => {
       try {
        const {data} = await axios.get(`${backendUrl}/api/doctor/appointments`, {
            headers:{
                Authorization:`Bearer ${dToken}`,
                "Content-Type": `application/json`
            },
            timeout:10000,
        });

        if(!data) {
            toast.error("failed to fetch data");
        };

        setDocAppointments(data.appoint.reverse());
        // console.log(data.appoint);
       } catch (error) {
        toast.error(error.response?.data?.message);
        toast.error(error);
       }
    }

    const completeAppointment = async (appointmentId) => {
      try {
        const { data } = await axios.patch(
          `${backendUrl}/api/doctor/complete-appointment`,
          { appointmentId },
          {
            headers: {
              Authorization: `Bearer ${dToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if(!data.success){
            toast.error(data.message);
            // console.log(data.console);
        }

        toast.success(data.message);
        getAllAppointments();
        getDashData();
      } catch (error) {
        toast.error(error.response?.data?.message);
        toast.error(error);
      }
    };

    const cancelAppointment = async (appointmentId) => {
      try {
        const { data } = await axios.delete(
          `${backendUrl}/api/doctor/cancel-appointment`,
          {
            data :  { appointmentId },
            headers: {
              Authorization: `Bearer ${dToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if(!data.success){
            toast.error(data.message);
            console.log(data.console);
        }

        toast.success(data.message);
        getAllAppointments();
      } catch (error) {
        toast.error(error.response?.data?.message);
        toast.error(error);
      }
    };

    const getDashData = async () => {
      try {
        const {data} = await axios.get(`${backendUrl}/api/doctor/dashboard`,{
          headers:{
            Authorization:`Bearer ${dToken}`,
            "Content-Type": "application/json"
          }
        });

        if(data.success){
          setDashData(data.dashboard);
          console.log(data.dashboard);
        }else{
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.response?.data?.message);
        toast.error(error);
      }
    }

    const getDocProfile = async () => {
      try {
        const {data} = await axios.get(`${backendUrl}/api/doctor/profile`,{
          headers:{
            Authorization : `Bearer ${dToken}`,
            "Content-Type" : "application/json"
          },
        });

        if(!data){
          toast.error("Error while fetching doctor profile");
        }
        
        if(!data.success){
          toast.error(data.message);
          console.log(data.console);
        }
        setDocProfile(data.doctor);
        console.log(data.doctor);

      } catch (error) {
        toast.error(error.response?.data?.message);
        toast.error(error);
      };
    };

     
    const value ={ 
       dToken,
       setDToken,
       docAppointments,
       setDocAppointments,
       getAllAppointments,
       completeAppointment,
       cancelAppointment,
       dashData,
       getDashData,
       docProfile,
       getDocProfile,
       setDocProfile,
       backendUrl
    }

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

