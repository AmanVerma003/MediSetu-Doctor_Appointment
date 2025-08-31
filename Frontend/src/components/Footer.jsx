import React from "react";
import {
  frontendAssets,
  specialityData,
} from "../assets/assets_frontend/assets";

const Footer = () => {
  return (
    <div className="w-full bg-gray-100 text-gray-800 pt-12 px-4 sm:px-8 lg:px-20">
      {/* Top section - MediSetu info */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <img
            className="w-10 h-10 object-contain"
            src={frontendAssets.SetuLogo}
            alt="logo"
          />
          <h1 className="text-2xl font-semibold text-blue-800">MediSetu</h1>
        </div>

        <h2 className="text-gray-700 font-semibold text-xl mb-2">
          Specialities - Expertise you can trust
        </h2>

        <p className="text-sm mb-2">
          A medical specialty is a specific area of medical practice that mainly focuses on a defined set of diseases, patients, philosophy, or skills. Examples include Paediatrics, Dermatology, Psychiatry, Gynaecology, and more.
        </p>

        <p className="text-sm mt-2">
          MediSetu offers advanced services for a range of medical specialities, including:
        </p>

        <ul className="list-disc list-inside space-y-3 text-[0.875rem] mt-4">
          {specialityData.map((item, index) => (
            <li key={index}>
              <span className="font-semibold">{item.speciality} - </span>
              {item.info}
            </li>
          ))}
        </ul>

        <h4 className="font-semibold mt-6 mb-2">Why Choose Online Consultation?</h4>
        <p className="text-[0.875rem] mb-2">
          There are several ways to reach out to a doctor without the need to visit a hospital or clinic, all thanks to technology. With the online facility available, doctor consultations have become easier, which can help you get the right health care.
        </p>
        <p className="text-[0.875rem] mb-4">Consult a doctor online with MediSetu 24|7</p>

        <p className="font-semibold mt-4 mb-2">Steps to book an online doctor consultation:</p>
        <ul className="list-disc list-inside text-[0.875rem] space-y-2">
          <li>Choose the doctor</li>
          <li>Book your appointment</li>
          <li>Make the payment</li>
          <li>Be available in the consultation room on time</li>
          <li>Constant follow-ups via text till next 7 days</li>
        </ul>

        <p className="font-semibold mt-4 mb-2">How to consult a doctor offline?</p>
        <ul className="list-disc list-inside text-[0.875rem] space-y-2">
          <li>Choose the medical doctor</li>
          <li>Book your appointment</li>
          <li>Visit the doctor at clinic or hospital</li>
          <li>Make the payment</li>
        </ul>
      </div>

      {/* Bottom Grid: COMPANY, SERVICES, SPECIALTIES, CONTACT */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 border-t border-gray-300 py-8">
        <div>
          <h1 className="font-semibold pb-2">COMPANY</h1>
          <ul className="text-[0.850rem] text-gray-700 space-y-2">
            <li>Home</li>
            <li>About Us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        <div>
          <h1 className="font-semibold pb-2">SERVICES</h1>
          <ul className="text-[0.850rem] text-gray-700 space-y-2">
            <li>Online Doctors Consultation</li>
            <li>Online Medicine Consultation</li>
            <li>Doctors by City</li>
            <li>All Doctors List</li>
          </ul>
        </div>

        <div>
          <h1 className="font-semibold pb-2">TOP SPECIALTIES</h1>
          <ul className="text-[0.850rem] text-gray-700 space-y-2">
            {specialityData.slice(0, 5).map((item, index) => (
              <li key={index}>Consult {item.speciality}</li>
            ))}
          </ul>
        </div>

        <div>
          <h1 className="font-semibold pb-2">GET IN TOUCH</h1>
          <ul className="text-[0.850rem] text-gray-700 space-y-2">
            <li>+91 9876543210</li>
            <li>mediSetu@gmail.com</li>
          </ul>
        </div>
      </div>

      {/* Footer bar */}
      <div className="text-center text-sm text-gray-600 pt-6 pb-4 border-t border-gray-300">
        © {new Date().getFullYear()} MediSetu. All rights reserved.
      </div>
    </div>
  );
};

export default Footer;
