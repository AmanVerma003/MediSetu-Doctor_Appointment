import React, { useContext, useState } from "react";
import { AdminContext } from "../context/AdminContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { DoctorContext } from "../context/DoctorContext.jsx";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate("");

  const { setAToken, backendUrl } = useContext(AdminContext);
  const {setDToken} = useContext(DoctorContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (state === "Admin") {
      try {
        
        const { data } = await axios.post(`${backendUrl}/api/admin/login`, {
          email,
          password,
        });

        if (data.success) {
          localStorage.setItem("aToken", data.token);
          setAToken(data.token);
          navigate("/admin-dashboard")
        }  
        
      } catch (error) {
        console.error("Axios Error:", error);
        toast.error(error.response?.data?.message || "Something went wrong!");
      }
    } else {
      //Doctor login handel
      const {data} = await axios.post(`${backendUrl}/api/doctor/login`,{email,password});  
      if (data.success) {
        localStorage.setItem("dToken", data.dToken);
        setDToken(data.dToken);
        navigate("/doctor-dashBoard")
        // console.log(data.dToken);
        // console.log("state:-", state)
      }else{
        toast.error(data.message);
      };
    };
  };

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 text-[#5E5E5E] text-sm  border-gray-200 border-[1.5px] rounded-xl shadow-lg">
        <p className="text-2xl font-semibold m-auto">
          <span className="text-[#5F6FFF]">{state}</span> Login
        </p>
        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="email"
            required
          />
        </div>
        <div className="w-full">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="password"
            required
          />
        </div>
        <button className="bg-[#5F6FFF] text-white w-full py-2 rounded-md text-base">
          Login
        </button>
        {state === "Admin" ? (
          <p>
            Doctor Login ?{" "}
            <span
              className="text-[#5F6FFF] underline cursor-pointer"
              onClick={() => setState("Doctor")}
            >
              Click here
            </span>
          </p>
        ) : (
          <p>
            Admin Login ?{" "}
            <span
              className="text-[#5F6FFF] underline cursor-pointer"
              onClick={() => setState("Admin")}
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
