import { useState, useEffect } from 'react';
import React from "react";
import {addPractice, addAttendeeToPractice, checkForPractice} from '../util/PracticeUtil'

const DayStatsBox = ( props ) => {
    // Format the date string
  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateStr).toLocaleDateString("en-US", options);
  };

  const [isTherePractice, setIsTherePractice] = useState(false)

  //Check if practice exists on selected date
  const findOutIfPractice = async () => {
    try {
        if(!props.selectedDate)
            return
        const practiceExists = await checkForPractice(props.selectedDate);
        practiceExists ? setIsTherePractice(true) : setIsTherePractice(false);

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

  // Use eddect to check for practice on selectedDate changes
  useEffect(() => {
    findOutIfPractice();
  }, [props.selectedDate])

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {/* Content for DayStatsBox */}
      <h2 className="text-xl font-bold text-gray-700">{formatDate(props.selectedDate)}</h2>
      <p className="text-gray-500">{isTherePractice ? "There is Practice": "There is not practice"}</p>
      {isTherePractice ? (<div>This is if there is a day</div>)
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