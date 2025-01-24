import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react"; // FullCalendar library
import dayGridPlugin from "@fullcalendar/daygrid"; // Day grid view plugin
import interactionPlugin from "@fullcalendar/interaction"; // Enables event clicking and dragging
import DayStatsBox from '../components/DayStatsBox.jsx';
import { fetchCurrentUserData, isAdminUser } from "../util/UsersUtil";
import { fetchAndSetEvents } from "../util/PracticeUtil.jsx";



const Calendar = () => {

  const [events, setEvents] = useState([]);
  const [visibleDates, setVisibleDates] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');


  // On page load check if admin is logged in
  useEffect(() => {
    const checkAdminStatus = async () => {
        const isAdmin = await isAdminUser();
        setIsAdmin(isAdmin);
        const calendarEvents = await fetchAndSetEvents();
        setEvents(calendarEvents);
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

  // Hanle when calenders clicked
  const handleEventClick = (info) => {
    if (window.confirm(`Do you want to delete "${info.event.title}"?`)) {
      setEvents(events.filter((event) => event.id !== info.event.id));
    }
  };

  // Generate all dates between two given dates
  const generateDateRange = (startDate, endDate) => {
    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
      dates.push(currentDate.toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1); // Increment by one day
    }

    return dates;
  };

  // Callback for when the calendar's visible range changes
  const handleDatesSet = (info) => {
    const startDate = info.startStr; // Start date of the visible range
    const endDate = info.endStr; // End date of the visible range
    const datesInRange = generateDateRange(startDate, endDate);
    setVisibleDates(datesInRange); // Store all visible dates in state
    console.log("Visible Dates:", visibleDates);
  };

  // Log visible dates to console for debugging
  useEffect(() => {
    console.log("Visible Dates:", visibleDates);
  }, [visibleDates]);

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
          datesSet={handleDatesSet}
        />
      </div>
      <DayStatsBox selectedDate={selectedDate}/>
    </div>
  );
};

export default Calendar;
