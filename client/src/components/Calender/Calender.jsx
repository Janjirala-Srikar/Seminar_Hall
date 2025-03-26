import React, { useState, useCallback } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { BsCalendar3, BsClock, BsCheckCircle } from "react-icons/bs";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import './Calender.css';

const localizer = momentLocalizer(moment);

const BookingCalendar = () => {
  const [events, setEvents] = useState([
    { 
      start: new Date(2025, 1, 20, 9, 0), 
      end: new Date(2025, 1, 20, 12, 0), 
      title: "Club Meeting",
      isSelected: false
    },
    { 
      start: new Date(2025, 1, 21, 12, 0), 
      end: new Date(2025, 1, 21, 15, 0), 
      title: "Seminar",
      isSelected: false
    },
  ]);

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [view, setView] = useState("month");
  const [date, setDate] = useState(new Date());

  const handleNavigate = useCallback((newDate) => {
    setDate(newDate);
  }, []);

  const handleDateClick = useCallback((date) => {
    setDate(date);
    setView("day");
  }, []);

  const handleSlotSelection = (slotInfo) => {
    const startTime = moment(slotInfo.start);
    setView("day");
    
    const roundedStart = moment(startTime).startOf('hour');
    let roundedEnd = moment(roundedStart).add(3, 'hours');
    
    const newSelection = {
      start: roundedStart.toDate(),
      end: roundedEnd.toDate(),
      title: "Selected Slot",
      isSelected: true,
      isTemporary: true
    };

    const filteredEvents = events.filter(event => !event.isTemporary);
    setEvents([...filteredEvents, newSelection]);
    
    setSelectedSlot({
      start: roundedStart.toDate(),
      end: roundedEnd.toDate()
    });
  };

  const handleConfirmBooking = () => {
    if (selectedSlot) {
      const newEvent = {
        start: selectedSlot.start,
        end: selectedSlot.end,
        title: "New Booking",
        isSelected: false,
        isConfirmed: true
      };

      const filteredEvents = events.filter(event => !event.isTemporary);
      setEvents([...filteredEvents, newEvent]);
      
      console.log(
        `Booked Slot: ${moment(selectedSlot.start).format('MMMM D, YYYY h:mm A')} - ${moment(selectedSlot.end).format('h:mm A')}`
      );      
    }
  };

  // Updated event styling with lighter colors
  const eventStyleGetter = (event) => {
    if (event.isTemporary) {
      return {
        style: {
          backgroundColor: '#98FB98', // Light green
          border: '2px solid #90EE90',
          color: '#006400', // Dark green text for contrast
          fontWeight: 'bold'
        }
      };
    }
    if (event.isConfirmed) {
      return {
        style: {
          backgroundColor: '#ADD8E6', // Light blue
          border: '2px solid #87CEEB',
          color: '#00008B' // Dark blue text for contrast
        }
      };
    }
    return {
      style: {
        backgroundColor: '#E0E0E0', // Light gray for existing events
        color: '#424242'
      }
    };
  };

  const minTime = new Date();
  minTime.setHours(9, 0, 0);
  const maxTime = new Date();
  maxTime.setHours(17, 0, 0);

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-10 col-md-12">
          <div className="card shadow-lg">
            <div className="card-header bg-primary text-white d-flex align-items-center">
              <BsCalendar3 className="me-2" size={24} />
              <h2 className="mb-0">Seminar Hall Booking Calendar</h2>
            </div>
            <div className="card-body">
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                views={["month", "week", "day"]}
                view={view}
                date={date}
                onView={setView}
                onNavigate={handleNavigate}
                selectable={true}
                step={60}
                timeslots={1}
                min={minTime}
                max={maxTime}
                onSelectSlot={handleSlotSelection}
                onDrillDown={handleDateClick}
                defaultView="month"
                eventPropGetter={eventStyleGetter}
              />
              
              {selectedSlot && (
                <div className="mt-4">
                  <div className="alert alert-info d-flex align-items-center">
                    <BsClock className="me-2" size={20} />
                    <div>
                      <strong>Selected Time:</strong> {moment(selectedSlot.start).format('MMMM D, YYYY h:mm A')} - {moment(selectedSlot.end).format('h:mm A')}
                    </div>
                  </div>
                  <button 
                    className="btn btn-success btn-lg w-100"
                    onClick={handleConfirmBooking}
                  >
                    <BsCheckCircle className="me-2" />
                    Confirm Booking
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;