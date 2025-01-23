import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react"; // FullCalendar library
import dayGridPlugin from "@fullcalendar/daygrid"; // Day grid view plugin
import interactionPlugin from "@fullcalendar/interaction"; // Enables event clicking and dragging
import DayStatsBox from '../components/DayStatsBox.jsx';
import { fetchCurrentUserData, isAdminUser } from "../util/UsersUtil";



const Calendar = () => {

  const [events, setEvents] = useState([
    {
      id: "1",
      title: "Kickboxing Training",
      start: new Date().toISOString().split("T")[0], // Today's date
    },
    {
      id: "2",
      title: "Boxing Sparring Session",
      start: new Date(new Date().setDate(new Date().getDate() + 2))
        .toISOString()
        .split("T")[0], // 2 days later
    },
  ]);

  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    const checkAdminStatus = async () => {
        const isAdmin = await isAdminUser();
        setIsAdmin(isAdmin);
    };
    checkAdminStatus();
  }, [])

  const handleDateClick = (info) => {
    if (!isAdmin) {
      
    }
    setSelectedDate(info.dateStr);

    {/*
        const title = prompt("Enter event title:");
        if (title) {
        setEvents([
            ...events,
            {
            id: String(events.length + 1),
            title,
            start: info.dateStr,
            },
        ]);
        }
    */}
  };

  const handleEventClick = (info) => {
    if (window.confirm(`Do you want to delete "${info.event.title}"?`)) {
      setEvents(events.filter((event) => event.id !== info.event.id));
    }
  };

  return (
    <div className="container mx-auto py-8 px-4" >
      <h1 className="text-2xl font-bold text-center mb-8 text-white">
        Boxing & Kickboxing Club Calendar
      </h1>
      <div className="bg-white p-4 shadow rounded-md mb-8">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          initialDate={new Date().toISOString().split("T")[0]}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          selectable={true}
          editable={true}
          height="auto"
        />
      </div>
      <DayStatsBox selectedDate={selectedDate}/>
    </div>
  );
};

export default Calendar;
