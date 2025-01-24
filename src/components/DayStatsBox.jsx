import { useState, useEffect } from 'react';
import React from "react";
import {addPractice, addAttendeeToPractice, checkForPractice, getPracticeInfo, addRsvpToPractice, removeRsvp} from '../util/PracticeUtil'
import { fetchCurrentUserData, isAdminUser, fetchAllUsers, findUser } from "../util/UsersUtil";
import { auth } from "../../firebase"; 

const DayStatsBox = (props) => {
    const [isTherePractice, setIsTherePractice] = useState(false); 
    const [members, setMembers] = useState([]);
    // Practice Data
    const [attendanceSize, setAttendanceSize] = useState(0); 
    const [attendees, setAttendees] = useState([]); 
    const [dayOfWeek, setDayOfWeek] = useState(""); 
    const [endTime, setEndTime] = useState(""); 
    const [startTime, setStartTime] = useState(""); 
    const [rsvpList, setRsvpList] = useState([]);
    const [rsvpNames, setRsvpNames] = useState([]);
    const [rsvpTotal, setRsvpTotal] = useState(0);

    // Format the date string
    const formatDate = (dateStr) => {
        if (!dateStr) return null;
        const options = { year: "numeric", month: "short", day: "numeric" };
        return new Date(dateStr).toLocaleDateString("en-US", options);
    };

    const getDayOfWeek = (dateStr) => {
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const date = new Date(dateStr);
        return daysOfWeek[date.getUTCDay()]; // Use getUTCDay() for consistency with UTC dates
    };

    // Render the Create Practice button
    const insertCreateButton = () => {
        return (
            <button
                onClick={handleCreatePractice}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
                Create Practice
            </button>
        );
    };

    // Check if practice exists on selected date
    const findOutIfPractice = async () => {
        try {
            if (!props.selectedDate) return;

            const practiceExists = await checkForPractice(props.selectedDate);
            if (practiceExists) {
                setIsTherePractice(true);
                const practiceData = await getPracticeInfo(props.selectedDate);
                if (practiceData) {
                    setAttendanceSize(practiceData.attendanceSize || 0);
                    setStartTime(practiceData.startTime || "");
                    setEndTime(practiceData.endTime || "");
                    setAttendees(practiceData.attendees || []);
                    setDayOfWeek(practiceData.dayOfWeek || "");
                    setRsvpList(practiceData.rsvp || []);
                    // Convert RSVP list (IDs) to names
                    const rsvpNames = await Promise.all(
                        practiceData.rsvp.map(async (id) => {
                            const user = await findUser(id); // Fetch user by ID
                            return user ? `${user.firstName} ${user.lastName}` : "Unknown User";
                        })
                    );
                    setRsvpNames(rsvpNames); // Update rsvpNames state
                    setRsvpTotal(practiceData.rsvpSize || 0)
                }

                // Fetch all users and filter out those in the RSVP list
                const allMembers = await fetchAllUsers();
                const filteredMembers = allMembers.filter(
                    (member) => !practiceData.rsvp.includes(member.uuid)
                );
                setMembers(filteredMembers);
            } else {
                setIsTherePractice(false);
            }
        } catch (error) {
            console.error("Error checking for practice:", error);
        }
    };

    // Handle creating a practice
    const handleCreatePractice = async () => {
        try {
            const isAdmin = await isAdminUser();
            if (!isAdmin) {
                alert("Only admins can create practices.");
                return;
            }

            const dayOfWeek = getDayOfWeek(props.selectedDate);

            const startTime = prompt("Enter start time (e.g., 10:00 AM):");
            const endTime = prompt("Enter end time (e.g., 12:00 PM):");

            if (!startTime || !endTime) {
                alert("Start and End Times Required!!!");
                return;
            }
            await addPractice(props.selectedDate, dayOfWeek, startTime, endTime);
            setIsTherePractice(true);
            alert("Practice created successfully!");
            findOutIfPractice(); // Refresh practice data
        } catch (error) {
            console.error("Error creating practice:", error);
        }
    };

    // Handle adding user to practice
    const addToAttendees = async () => {
        try {
            // Check if a user is logged in
            const currentUser = auth.currentUser;
            if (!currentUser) {
                alert("You need to sign in to join the practice.");
                return;
            }
    
            const userUid = currentUser.uid;
    
            // Add the user to the attendees list
            await addAttendeeToPractice(userUid, props.selectedDate);
    
            // Refresh the practice data
            findOutIfPractice();
    
            alert("Successfully added to attendees.");
        } catch (error) {
            console.error("Error adding to attendees:", error);
        }
    };


    // Use effect when the date changes
    useEffect(() => {
        findOutIfPractice();
    }, [props.selectedDate]);

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            {/* Content for DayStatsBox */}
            <h2 className="text-xl font-bold text-gray-700">{formatDate(props.selectedDate)}</h2>
            <p className="text-gray-500">{isTherePractice ? "There is Practice" : "There is not practice"}</p>
            {isTherePractice ? (
                    <div className="bg-blue-100 p-6 rounded-lg shadow-md">
                        <button
                            onClick={async () => {
                                try {
                                    // Check if a user is logged in
                                    const currentUser = auth.currentUser;
                                    if (!currentUser) {
                                        alert("You need to sign in to RSVP.");
                                        return;
                                    }

                                    const userUid = currentUser.uid;

                                    // Check if the user is in the RSVP list
                                    if (rsvpList.includes(userUid)) {
                                        // User is already RSVP'd, remove them
                                        await removeRsvp(userUid, props.selectedDate);
                                        alert("You have been removed from the RSVP list.");
                                    } else {
                                        // User is not RSVP'd, add them
                                        await addRsvpToPractice(userUid, props.selectedDate);
                                        alert("RSVP successful!");
                                    }

                                    // Refresh practice data after RSVP change
                                    findOutIfPractice();
                                } catch (error) {
                                    console.error("Error while handling RSVP:", error);
                                }
                            }}
                            className={`mt-4 px-4 py-2 rounded-md transition ${
                                rsvpList.includes(auth.currentUser?.uid)
                                    ? "bg-red-600 text-white hover:bg-red-700"
                                    : "bg-green-600 text-white hover:bg-green-700"
                            }`}
                        >
                            {rsvpList.includes(auth.currentUser?.uid) ? "UN RSVP" : "RSVP"}
                        </button>

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
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-700 mb-1">Attendees: {attendanceSize}</span>
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
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-700 mb-1">RSVP: {rsvpTotal}</span>
                            {rsvpList.length > 0 ? (
                                <ul className="list-disc list-inside text-gray-800">
                                    {rsvpNames.map((names, index) => (
                                        <li key={index} className="ml-4">{names}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">No Rsvp Yet.</p>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-700 mb-1">Members:</span>
                        <ul className=" list-inside text-gray-800">
                            {members.map((member, index) => (
                                <li key={index} className="ml-4">
                                    <div className="bg-gray-400 hover:bg-gray-500 text-white rounded-lg p-4 mb-5 cursor-pointer shadow-md transition"
                                                    onClick={addToAttendees}>
                                    <button
                                        disabled
                                        className="flex items-center justify-center w-12 h-12 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition"
                                        title={`${member.firstName} ${member.lastName}`}
                                    >
                                        {`${member.firstName.charAt(0)}${member.lastName.charAt(0)}`}
                                    </button>
                                    <p className="mt-2 text-gray-700 text-sm font-semibold">
                                        <p className="mt-2 text-gray-700 text-sm font-semibold">
                                        {member.firstName} {member.lastName} &nbsp;&nbsp;&nbsp; {member.email}
                                    </p>
                                    </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ) : (
                insertCreateButton() // Invoke the function to render the button
            )}
        </div>
    );
};

export default DayStatsBox;
