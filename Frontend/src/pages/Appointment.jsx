import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { frontendAssets } from "../assets/assets_frontend/assets.js";
import RelatedDoctors from "../components/RelatedDoctors.jsx";
import { toast } from "react-toastify";
import axios from "axios";

const Appointment = () => {
  const { docId } = useParams();
  const navigate = useNavigate();

  const { doctors, backendUrl, token, getDoctorsData } = useContext(AppContext);

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState(""); 

  const getAvailableSlots = async () => {
    let today = new Date();
    let allSlots = [];

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i); //e.g :- 2025-08-01T12:02:00 1Aug2025 + i(0)

      let endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0); //e.g 2025-08-01T9:00:00

      if (today.getDate() === currentDate.getDate()){
        currentDate.setHours(
          // Time format
          // 10am,11am,12pm,13pm,14pm,15pm,16pm,17pm,18pm,19pm,20pm,21pm
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10 //2025-08-01T12:02:00 > 10 ? 12:02:00 +1 = 1:02:00
        );
        //01:02:00 > 30 = 01:00:00 if suppose it would have been be 01:31:00 then it would be 01:30:00
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0); //1:02:00 > 30 ? skip : 1:00:00 //if min is (31)	31 > 30 → 30	1:30 PM	More than 30 → snap to :30
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

      let day = currentDate.getDate();
      let month = currentDate.getMonth()+1;
      let year = currentDate.getFullYear();
      let slotDate = day + "_" + month + "_" + year;
      let slotTime = formattedTime;

      const isSlotAvailable = docInfo?.slots_booked?.[slotDate]?.includes(slotTime) ? false : true; 
        if(isSlotAvailable){
          timeSlots.push({
            dateTime: new Date(currentDate),
            time: formattedTime,
          });
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      allSlots.push(timeSlots);
    }

    setDocSlots(allSlots);
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Login to book appointment");
      return navigate("/login");
    }

    try {
      const date = docSlots[slotIndex][0].dateTime;
      // console.log("date", date);
      let day = date.getDate();

      // 0 → January
      // 1 → February
      // 2 → March
      // ...
      // 6 → July 
      // 7 → August
      // So if the real date is 24th August 2025,
      // getMonth() will give 7 (not 8).

      let month = date.getMonth()+1;
      let year = date.getFullYear();
      const slotDate = day + "_" + month + "_" + year;
      // console.log(slotDate);
      // console.log(slotTime);
      // console.log(docId);

      const { data } = await axios.post(`${backendUrl}/api/user/book-appointment`,
        {
          slotDate,
          slotTime,
          docId
        }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      if (!data) {
        toast.error("User profile not found");
        return;
      }

      if(!data.success){
        toast.error(data.message);
      }

      toast.success(data.message);
      getDoctorsData();
      return navigate("/my-appointments");
      
    } catch (error) {
      console.error("Error fetching doctors:", error);

      // Handle server-side message if available
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to fetch doctors. Please try again.");
      }
    }
  };

  useEffect(() => {
    const foundDoc = doctors.find((doc) => doc._id === docId);
    setDocInfo(foundDoc);
  }, [doctors, docId]);

  useEffect(() => {
    getAvailableSlots();
  }, [docInfo]);

  // useEffect(() => {
  //   console.log(docSlots);
  // }, [docSlots]);

  if (!docInfo) {
    return (
      <div className="text-center py-20 text-gray-600">
        <p>Loading doctor information or doctor not found.</p>
      </div>
    );
  }

  return (
    <div className="my-4">
      {/* Doctor Details */}
      <div className="flex flex-col sm:flex-row gap-4 my-4">
        <div>
          <img
            className="bg-[#5f6fff] w-full sm:max-w-72 rounded-lg"
            src={docInfo.image}
            alt={docInfo.name}
          />
        </div>

        <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2  ">
          {/* Doc Info : name,degree,experience */}

          <p className="flex items-center gap-2 text-xl font-medium text-gray-900">
            {docInfo.name}
            <img
              className="w-4"
              src={frontendAssets.verified_icon}
              alt="verified icon"
            />
          </p>

          <div className="flex items-center gap-2 mt-1 text-gray-600 text-sm">
            <p>
              {docInfo.degree}- {docInfo.speciality}
            </p>
            <button className="py-0.5 px-2 border text-xs rounded-full">
              {docInfo.experience}
            </button>
          </div>
          {/* Doctor About */}
          <div>
            <p className="flex text-center gap-1 text-sm font-medium text-gray-900 mt-3">
              About{" "}
              <img
                className="w-3"
                src={frontendAssets.info_icon}
                alt="infoIcon"
              />
            </p>
            <p className="text-sm  text-gray-500 max-w-[700px] mt-2">
              {docInfo.about}
            </p>
          </div>
          {/* Doctor fees */}
          <p className="text-gray-600 font-medium mt-5">
            Appointment Fee:{" "}
            <span className="font-medium text-gray-900">${docInfo.fees}</span>
          </p>
        </div>
      </div>
      {/* Booking slots */}
      <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700 ">
        <p>Booking Slots</p>
        <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
          {docSlots.length > 0 &&
            docSlots.map((item, index) => (
              <div
                onClick={() => setSlotIndex(index)}
                className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                  slotIndex === index
                    ? "bg-[#5f6fff] text-white"
                    : "border border-gray-200"
                }`}
                key={index}
              >
                {item.length > 0 ? (
                  <>
                    {/*e.g:-
                    0:[
                      0: {dateTime: Sat Aug 02 2025 10:30:39 GMT+0530 (India Standard Time),time: "10:30 AM"}
                      1: {dateTime: Sat Aug 02 2025 11:00:39 GMT+0530 (India Standard Time), time: '11:00 AM'}]
                   */}
                    <p>{daysOfWeek[new Date(item[0].dateTime).getDay()]}</p>
                    <p>{new Date(item[0].dateTime).getDate()}</p>
                  </>
                ) : (
                  <p className="text-red-500 bg-white">Closed</p>
                )}
              </div>
            ))}
        </div>

        <div className="flex items-center gap-3 w-full overflow-x-scroll my-4">
          {docSlots.length &&
            docSlots[slotIndex].map((item, index) => (
              <p
                key={index}
                onClick={() => setSlotTime(item.time)}
                className={`text-sm font-light flex shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                  item.time === slotTime
                    ? "bg-[#5f6fff] text-white"
                    : "text-gray-500 border border-gray-300 "
                }`}
              >
                {item.time.toLowerCase()}
              </p>
            ))}
        </div>
        <button
          onClick={bookAppointment}
          className="cursor-pointer bg-[#5f6fff] text-white text-sm font-light rounded-full my-4 px-14 py-4"
        >
          Book an Appointment
        </button>
      </div>
      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
    </div>
  );
};

export default Appointment;
