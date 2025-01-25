import { useState, useEffect } from 'react';
import React from "react";
import {addPractice, addAttendeeToPractice, checkForPractice, getPracticeInfo, addRsvpToPractice, removeRsvp, removeAttendeeFromPractice } from '../util/PracticeUtil'
import { fetchCurrentUserData, isAdminUser, fetchAllUsers, findUser } from "../util/UsersUtil";
import { auth } from "../../firebase"; 

const DayStatsBox = (props) => {
    const [isTherePractice, setIsTherePractice] = useState(false); 
    const [members, setMembers] = useState([]);
    // Practice Data
    const [attendanceSize, setAttendanceSize] = useState(0); 
    const [attendees, setAttendees] = useState([]); 
    const [attendeesData, setAttendeesData] = useState([]); 
    const [dayOfWeek, setDayOfWeek] = useState(""); 
    const [endTime, setEndTime] = useState(""); 
    const [startTime, setStartTime] = useState(""); 
    const [rsvpList, setRsvpList] = useState([]);
    const [rsvpNames, setRsvpNames] = useState([]);
    const [rsvpTotal, setRsvpTotal] = useState(0);
    const [rsvpData, setRsvpData] = useState([]);

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

    const removeFromAttendees = async (uuid) => {
        try {
            const isAdmin = await isAdminUser();
            if (!isAdmin) {
                alert("Only admins can remove attendees from practice.");
                return;
            }
            // Remove the user from the attendees list
            await removeAttendeeFromPractice(uuid, props.selectedDate);
    
            // Refresh the practice data
            findOutIfPractice();
    
            alert("Successfully removed attendee.");
        } catch (error) {
            console.error("Error removing attendee:", error);
        }
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
    
                    // Fetch full data for attendees
                    const attendeesData = await Promise.all(
                        practiceData.attendees.map(async (id) => {
                            const user = await findUser(id);
                            return { ...user, uuid: id }; // Ensure uuid is present
                        })
                    );
                    setAttendeesData(attendeesData);
    
                    // Fetch RSVP data and filter out attendees
                    const rsvpData = await Promise.all(
                        practiceData.rsvp.map(async (id) => {
                            const user = await findUser(id);
                            return { ...user, uuid: id }; // Ensure uuid is present
                        })
                    );
                    setRsvpData(rsvpData.filter((user) => !practiceData.attendees.includes(user.uuid)));
    
                    // Fetch all members and filter out attendees
                    const allMembers = await fetchAllUsers();
                    const filteredMembers = allMembers.filter(
                        (member) =>
                            !practiceData.attendees.includes(member.uuid) &&
                            !practiceData.rsvp.includes(member.uuid)
                    );
                    setMembers(filteredMembers);
                }
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
    const addToAttendees = async (uuid) => {
        try {
            const isAdmin = await isAdminUser();
            if (!isAdmin) {
                alert("Only admins can add to practice");
                return;
            }
            // Add the user to the attendees list
            await addAttendeeToPractice(uuid, props.selectedDate);
    
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
                        <MemberList people={attendeesData} addToAttendees={removeFromAttendees} title={'Attendees'} total={attendeesData.length}></MemberList>
                    </div>
                    <MemberList people={rsvpData} addToAttendees={addToAttendees} title={'RSVP'} total={rsvpData.length}></MemberList>
                    <MemberList people={members} addToAttendees={addToAttendees} title={'Members'} total={members.length}/>
                </div>
            ) : (
                insertCreateButton() // Invoke the function to render the button
            )}
        </div>
    );
};


const MemberList = ({ people, addToAttendees, title, total }) => {
    // Sort members by practicesMade in descending order
    const sortedPeople = [...people].sort((a, b) => b.practicesMade - a.practicesMade);

    return (
        <div className="flex flex-col">
            <span className="font-semibold text-gray-700 mb-1">{title}: {total}</span>
            <ul className="list-inside text-gray-800">
                {sortedPeople.map((member, index) => (
                    <li key={index} className="ml-4">
                        <div
                            className="bg-gray-400 hover:bg-gray-500 text-white rounded-lg p-4 mb-5 cursor-pointer shadow-md transition"
                            onClick={() => addToAttendees(member.uuid)} // Pass uuid here
                        >
                            <button
                                disabled
                                className="flex items-center justify-center w-12 h-12 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition"
                                title={`${member.firstName} ${member.lastName}`}
                            >
                                {`${member.firstName.charAt(0)}${member.lastName.charAt(0)}`}
                            </button>
                            <p className="mt-2 text-gray-700 text-sm font-semibold">
                                {member.firstName} {member.lastName} &nbsp;&nbsp;&nbsp; {member.email} &nbsp;&nbsp;&nbsp; Practices Made: {member.practicesMade}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};


export default DayStatsBox;
