import React, { useState } from "react";
import { frontendAssets } from "../assets/assets_frontend/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const {token, setToken, userData} = useContext(AppContext);

  const logOut = () => {
    setToken(false);
    localStorage.removeItem("token");
  }

  // Common class for active NavLink
  const navLinkClass = ({ isActive }) =>
    `px-4 py-2 rounded ${
      isActive ? "text-[16px]  bg-blue-400 text-white" : "text-zinc-700 text-[16px] hover:text-blue-600"
    }`;

  return (
    <div className="flex items-center justify-between flex-wrap w-full p-4 pb-1 border-b border-gray-400">
      {/* Logo */}
      <div className="ml-[-10px] w-full max-w-[160px] cursor-pointer">
        <img
          onClick={() => navigate("/")}
          src={frontendAssets.mediSetu}
          alt="MediSetu logo"
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Desktop Nav */}
      <ul className="hidden md:flex items-center gap-5 font-medium text-[14px]">
        <NavLink to="/" className={navLinkClass}>
          HOME
        </NavLink>
        <NavLink to="/doctors" className={navLinkClass}>
          ALL DOCTORS
        </NavLink>
        <NavLink to="/about" className={navLinkClass}>
          ABOUT
        </NavLink>
        <NavLink to="/contact" className={navLinkClass}>
          CONTACT
        </NavLink>
      </ul>

      {/* User or Login */}
      <div className="flex items-center gap-4">
        {token && userData ?  (
          <div className="flex items-center gap-2 group relative">
            <img
              className="w-8 rounded-full"
              src={userData.image}
              alt="Profile_pic"
            />
            <img src={frontendAssets.dropdown_icon} alt="dropDown" />
            <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block cursor-pointer">
              <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                <p
                  onClick={() => navigate("my-profile")}
                  className="hover:text-black"
                >
                  My Profile
                </p>
                <p
                  onClick={() => navigate("my-appointments")}
                  className="hover:text-black"
                >
                  My Appointments
                </p>
                <p onClick={logOut} className="hover:text-black">
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="cursor-pointer bg-blue-500 text-white px-6 py-2 rounded-full font-light hidden md:block"
          >
            Create account
          </button>
        )}

        {/* Hamburger Icon */}
        <img
          onClick={() => setShowMenu((prev) => !prev)}
          className="w-6 md:hidden cursor-pointer"
          src={frontendAssets.menu_icon}
          alt="menu_icon"
        />
      </div>

      {/* Mobile Nav */}
      <div
        className={`fixed inset-0 h-full w-full bg-white z-40 transition-transform duration-300 shadow-lg ${
          showMenu ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <div className="flex items-center justify-between px-5 py-6">
          {/* Logo and title */}
          <div className="flex items-center gap-1">
            <img
              className="w-7"
              src={frontendAssets.SetuLogo}
              alt="Setu_logo"
            />
            <p className="text-xl font-semibold text-[#5e17eb]">MEDISETU</p>
          </div>

          {/* Close icon */}
          <img
            onClick={() => setShowMenu(false)}
            className="w-7 cursor-pointer"
            src={frontendAssets.cross_icon}
            alt="cross_icon"
          />
        </div>

        <ul className="flex flex-col items-start gap-3 mt-5 px-5 text-lg font-medium">
          <NavLink
            to="/"
            onClick={() => setShowMenu(false)}
            className={navLinkClass}
          >
            HOME
          </NavLink>
          <NavLink
            to="/doctors"
            onClick={() => setShowMenu(false)}
            className={navLinkClass}
          >
            ALL DOCTORS
          </NavLink>
          <NavLink
            to="/about"
            onClick={() => setShowMenu(false)}
            className={navLinkClass}
          >
            ABOUT
          </NavLink>
          <NavLink
            to="/contact"
            onClick={() => setShowMenu(false)}
            className={navLinkClass}
          >
            CONTACT
          </NavLink>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
