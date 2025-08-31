import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { useNavigate } from "react-router-dom";

const RelatedDoctors = ({ docId, speciality }) => {
  const { doctors } = useContext(AppContext);
  const [relDoc, setRelDoc] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (doctors.length > 0 && speciality) {
      const doc = doctors.filter(
        (data, index) => data.speciality === speciality && data._id !== docId
      );
      setRelDoc(doc);
    }
  }, [doctors, docId, speciality]);

  return (
    <div
      id="topDoctors"
      className="flex flex-col items-center gap-4 my-2 py-4 text-gray-900 md:mx-10 mb-[-10px] "
    >{ relDoc.length > 0 ? (<>
      <h1 className="text-3xl font-medium">Related Doctors</h1>
      <p className="w-1/3 text-center text-sm">
        Simply browse through our extensive list of trusted doctors.
      </p></>) :( <p> No related Doctors Found</p>)
      }
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5 px-3 sm:px-0 pt-5">
        {relDoc.slice(0, 5).map((item, index) => (
          <div
            onClick={() => {
              navigate(`/appointment/${item._id}`);
              scroll(0, 0);
            }}
            className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
            key={index}
          >
            <img src={item.image} alt={item.name} className="bg-blue-50" />
            <div className="p-4">
              <div className={`flex items-center gap-2 text-sm  ${!!item.available ? "text-green-500" : "text-gray-500" } `}>
                <p className={`${!!item.available ? "bg-green-500" : "bg-red-500"} w-2 h-2 rounded-full`}></p>
                <p>{item.available ? "Avaiable" : "Not Available"}</p>
              </div>
              <p className="text-gray-900 text-lg font-medium">{item.name}</p>
              <p className="text-gray-600 text-sm">{item.speciality}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedDoctors;
