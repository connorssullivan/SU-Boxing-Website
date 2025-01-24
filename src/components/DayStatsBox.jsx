import { useState, useEffect } from 'react';
import React from "react";
import {addPractice, addAttendeeToPractice, checkForPractice, getPracticeInfo} from '../util/PracticeUtil'
import { fetchCurrentUserData, isAdminUser, fetchAllUsers } from "../util/UsersUtil";

const DayStatsBox = ( props ) => {

    const [isTherePractice, setIsTherePractice] = useState(false) 
    const [members, setMembers] = useState([])
    //Practice Data
    const [attendanceSize, setAttendanceSize] = useState(10); 
    const [attendees, setAttendees] = useState([]); 
    const [dayOfWeek, setDayOfWeek] = useState(""); 
    const [endTime, setEndTime] = useState(""); 
    const [startTime, setStartTime] = useState(""); 


    // Format the date string
    const formatDate = (dateStr) => {
        if (!dateStr) return null;
        const options = { year: "numeric", month: "short", day: "numeric" };
        return new Date(dateStr).toLocaleDateString("en-US", options);
    };


    //Check if practice exists on selected date
    const findOutIfPractice = async () => {
        try {
            if(!props.selectedDate)
                return
            const practiceExists = await checkForPractice(props.selectedDate);
            if (practiceExists){
                setIsTherePractice(true);
                const practiceData = await getPracticeInfo(props.selectedDate);
                if (practiceData) {
                    setAttendanceSize(practiceData.attendanceSize || 0);
                    setStartTime(practiceData.startTime || "");
                    setEndTime(practiceData.endTime || "");
                    setAttendees(practiceData.attendees || []);
                    setDayOfWeek(practiceData.dayOfWeek || "");

                }

                const memberData = await fetchAllUsers();
                setMembers(memberData);
            }else {
                setIsTherePractice(false);
            }

        }catch (error) {
            console.error("Error creating practice:", error);
        }
    }

    //Handle creating a practice
    const handleCreatePractice = async () =>{
        try{
            const dayOfWeek = new Date(props.selectedDate).toLocaleDateString("en-US", {
                weekday: "long",
            });

            const startTime = prompt("Enter start time (e.g., 10:00 AM):");
            const endTime = prompt("Enter end time (e.g., 12:00 PM):");

            if (!startTime || !endTime){
                alert("Start and End Times Required!!!")
                return
            }
            await addPractice(props.selectedDate, dayOfWeek, startTime, endTime);
            setIsTherePractice(true);
            alert("Practice created successfully!");
            findOutIfPractice(); // Refresh practice data

        }catch (error) {
            console.log(error);
        }
    }

    // Use effect when the date changes
    useEffect(() => {
        findOutIfPractice();
    }, [props.selectedDate])

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
        {/* Content for DayStatsBox */}
        <h2 className="text-xl font-bold text-gray-700">{formatDate(props.selectedDate)}</h2>
        <p className="text-gray-500">{isTherePractice ? "There is Practice": "There is not practice"}</p>
        {isTherePractice ? (
        <div className="bg-blue-100 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">Practice Details</h2>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Date:</span>
            <span className="text-gray-800">{props.selectedDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Day of the Week:</span>
            <span className="text-gray-800">{dayOfWeek}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Time:</span>
            <span className="text-gray-800">
              {startTime} - {endTime}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Attendance Size:</span>
            <span className="text-gray-800">{attendanceSize}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-gray-700 mb-1">Attendees:</span>
            {attendees.length > 0 ? (
              <ul className="list-disc list-inside text-gray-800">
                {attendees.map((attendee, index) => (
                  <li key={index} className="ml-4">{attendee}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No attendees yet.</p>
            )}
          </div>
        </div>
        {/*This is the members list */}
        <div className='flex flex-col'>
            <span className='font-semibold text-gray-700 mb-1'>Members:</span>
            <ul className='list-disc list-inside text-gray-800'>
                {members.map((member, index) => (
                    <li key={index} className='ml-4'>{member.firstName} {member.lastName}</li>
                ))}
            </ul>
        </div>
      </div>
      )
        : 
        (
            // If no practice exists, show a button to create a new practice
            <button
            onClick={handleCreatePractice}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
            Create Practice
            </button>
        )}
        </div>
    )
};

export default DayStatsBox;