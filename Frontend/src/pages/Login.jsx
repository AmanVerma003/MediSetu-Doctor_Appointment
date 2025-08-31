import React, { useState } from "react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Login() {
  const [state, setState] = useState("Sign Up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { backendUrl, setToken} = useContext(AppContext);
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      if (state === "Sign Up") {
        const { data } = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password,
        });
        console.log("sign up", data);
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          setName("");
          setEmail("");
          setPassword("");
          navigate("/");
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        });
        console.log("login", data);
      
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          setEmail("");
          setPassword("")
          navigate("/");
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-[400px] bg-white  border-gray-200 border-[1.5px] rounded-xl shadow-lg p-6 sm:p-8 flex flex-col gap-4 text-gray-700">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-600">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </h2>
        <p className="text-sm text-gray-600">
          Please {state === "Sign Up" ? "sign up" : "log in"} to book
          appointment
        </p>

        {state === "Sign Up" && (
          <div className="w-full">
            <p className="mb-1 text-gray-600 text-sm">Full Name</p>
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="w-full px-4 py-2 text-sm border-gray-200 border-[1.5px] rounded focus:outline-none focus:ring-1 focus:ring-gray-900 transition"
            />
          </div>
        )}

        <div className="w-full">
          <p className="mb-1 text-gray-600 text-sm">Email</p>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="w-full px-4 py-2  border-gray-200 border-[1.5px] rounded focus:outline-none focus:ring-1 focus:ring-gray-900 transition"
          />
        </div>

        <div className="w-full">
          <p className="mb-1 text-gray-600 text-sm">Password</p>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="w-full px-4 py-2  border-gray-200 border-[1.5px] rounded focus:outline-none focus:ring-1 focus:ring-gray-900 transition"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-xl mt-2 hover:bg-blue-600 transition font-medium"
        >
          {state === "Sign Up" ? "Create account" : "Login"}
        </button>

        <p className="text-center text-sm text-gray-500">
          {state === "Sign Up"
            ? "Already have an account ?"
            : "Didn't have any account ?"}{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => setState(state === "Sign Up" ? "Login" : "Sign Up")}
          >
            {state === "Sign Up" ? "Login here" : "Create one"}
          </span>
        </p>
      </div>
    </form>
  );
}

export default Login;
