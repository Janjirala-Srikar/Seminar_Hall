import React, { useState, useCallback, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { BsCalendar3, BsClock, BsCheckCircle, BsPerson, BsCardText } from "react-icons/bs";
import axios from "axios";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import './BookingCalendar.css';

const localizer = momentLocalizer(moment);
const API_URL = "http://localhost:5000/api/bookings";

const BookingCalendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [view, setView] = useState("month");
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "New Booking",
    bookedBy: "",
    description: ""
  });

  // Fetch all bookings from the backend
  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      
      // Convert backend data format to calendar events format
      const formattedEvents = response.data.map(booking => ({
        id: booking._id,
        title: booking.title,
        start: new Date(booking.start),
        end: new Date(booking.end),
        bookedBy: booking.bookedBy,
        description: booking.description,
        isConfirmed: booking.isConfirmed
      }));
      
      setEvents(formattedEvents);
      setError(null);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load bookings. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

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

    // Reset form data for new booking
    setFormData({
      title: "New Booking",
      bookedBy: "",
      description: ""
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleConfirmBooking = async () => {
    if (selectedSlot) {
      try {
        // Prepare booking data for backend
        const bookingData = {
          title: formData.title || "New Booking",
          start: selectedSlot.start,
          end: selectedSlot.end,
          bookedBy: formData.bookedBy || "Anonymous",
          description: formData.description || "",
          isConfirmed: true
        };

        // Send booking to backend
        const response = await axios.post(API_URL, bookingData);
        
        // Update local state with the confirmed booking from backend
        const newEvent = {
          id: response.data._id,
          title: response.data.title,
          start: new Date(response.data.start),
          end: new Date(response.data.end),
          bookedBy: response.data.bookedBy,
          description: response.data.description,
          isConfirmed: response.data.isConfirmed
        };

        const filteredEvents = events.filter(event => !event.isTemporary);
        setEvents([...filteredEvents, newEvent]);
        
        // Reset selected slot
        setSelectedSlot(null);
        
        // Show success message
        alert("Booking confirmed successfully!");
      } catch (err) {
        console.error("Error creating booking:", err);
        
        if (err.response && err.response.status === 409) {
          alert("This time slot is already booked. Please select another time.");
        } else {
          alert("Failed to confirm booking. Please try again.");
        }
      }
    }
  };

  // Event styling with colors based on status
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
              {loading ? (
                <div className="text-center my-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Loading bookings...</p>
                </div>
              ) : error ? (
                <div className="alert alert-danger">{error}</div>
              ) : (
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
              )}
              
              {selectedSlot && (
                <div className="mt-4">
                  <div className="alert alert-info d-flex align-items-center">
                    <BsClock className="me-2" size={20} />
                    <div>
                      <strong>Selected Time:</strong> {moment(selectedSlot.start).format('MMMM D, YYYY h:mm A')} - {moment(selectedSlot.end).format('h:mm A')}
                    </div>
                  </div>
                  
                  <div className="card mb-3">
                    <div className="card-body">
                      <div className="mb-3">
                        <label htmlFor="title" className="form-label">
                          <BsCardText className="me-2" />
                          Booking Title
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="title"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="bookedBy" className="form-label">
                          <BsPerson className="me-2" />
                          Your Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="bookedBy"
                          name="bookedBy"
                          value={formData.bookedBy}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="description" className="form-label">
                          <BsCardText className="me-2" />
                          Description (Optional)
                        </label>
                        <textarea
                          className="form-control"
                          id="description"
                          name="description"
                          rows="3"
                          value={formData.description}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>
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