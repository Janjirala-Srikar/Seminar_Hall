import React, { useState, useCallback, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { BsCalendar3, BsClock, BsCheckCircle, BsPerson, BsCardText, BsBuilding, BsFilter, BsExclamationTriangle, BsInfoCircle } from "react-icons/bs";
import axios from "axios";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import './Calender.css';  

const localizer = momentLocalizer(moment);
const API_URL = "http://localhost:5000/api/bookings";

// Available halls for booking
const AVAILABLE_HALLS = [
  "B-block Seminar Hall",
  "KS Audi",
  "APJ Abdul Kalam Hall"
];

const BookingCalendar = ({ initialSelectedHall, userole }) => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [allBookings, setAllBookings] = useState([]); // Store all bookings including pending
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [view, setView] = useState("month");
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHall, setSelectedHall] = useState(initialSelectedHall || "All Halls");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [userRole, setUserRole] = useState(userole || ''); // Track user role
  const [pendingBookings, setPendingBookings] = useState([]); // Track pending bookings for director
  const [formData, setFormData] = useState({
    title: "New Booking",
    bookedBy: "",
    description: "",
    hall: initialSelectedHall || "" // Initialize with the hall passed from parent
  });

  // Update local state when initialSelectedHall prop changes
  useEffect(() => {
    setSelectedHall(initialSelectedHall || "All Halls");
    setFormData(prev => ({
      ...prev,
      hall: initialSelectedHall || ""
    }));
  }, [initialSelectedHall]);

  // Set userRole from prop
  useEffect(() => {
    if (userole) {
      setUserRole(userole);
    } else {
      // Get user information from session storage on component mount
      try {
        // Try to get userData from sessionStorage
        let userData = null;
        
        // Check all sessionStorage keys
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          try {
            const value = sessionStorage.getItem(key);
            const parsedValue = JSON.parse(value);
            if (parsedValue && parsedValue.userType) {
              userData = parsedValue;
              break;
            }
          } catch (e) {
            // Skip if can't parse as JSON
            continue;
          }
        }

        // Set the user role if found
        if (userData && userData.userType) {
          setUserRole(userData.userType);
        }
      } catch (error) {
        console.error("Error retrieving user data:", error);
      }
    }
  }, [userole]);

  // Fetch all bookings from the backend
  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      
      // Convert backend data format to calendar events format
      const formattedEvents = response.data.map(booking => ({
        id: booking._id,
        title: booking.title + (booking.isConfirmed || booking.status === "confirmed" ? " (Already Booked)" : ""),
        start: new Date(booking.start),
        end: new Date(booking.end),
        bookedBy: booking.bookedBy,
        description: booking.description,
        hall: booking.hall,
        isConfirmed: booking.isConfirmed,
        status: booking.status || (booking.isConfirmed ? "confirmed" : "pending"),
        email: booking.email
      }));
      
      // Store all bookings for reference
      setAllBookings(formattedEvents);
      
      // Get pending bookings for director view
      const pendingBookingsList = formattedEvents.filter(event => 
        !event.isConfirmed && event.status === "pending"
      );
      setPendingBookings(pendingBookingsList);
      
      // Show only confirmed bookings on the calendar
      const confirmedEvents = formattedEvents.filter(event => 
        event.isConfirmed || event.status === "confirmed"
      );
      setEvents(confirmedEvents);
      setError(null);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load bookings. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter events based on selected hall
  useEffect(() => {
    if (selectedHall === "All Halls") {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter(event => event.hall === selectedHall);
      setFilteredEvents(filtered);
    }
  }, [selectedHall, events]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleNavigate = useCallback((newDate) => {
    setDate(newDate);
  }, []);

  const handleDateClick = useCallback((date) => {
    // If user is director, don't allow drilling down to specific dates
    if (userRole === 'director') {
      return; // Simply return without changing the view
    }
    
    setDate(date);
    setView("day");
    
    // Remove any existing temporary events when switching views
    const filteredEvts = events.filter(event => !event.isTemporary);
    setEvents(filteredEvts);
    setSelectedSlot(null);
    setSelectedBooking(null);
  }, [events, userRole]);

  const handleHallChange = (e) => {
    setSelectedHall(e.target.value);
    
    // Also update the form data when changing halls
    if (e.target.value !== "All Halls") {
      setFormData(prev => ({
        ...prev,
        hall: e.target.value
      }));
    }
  };

  // Check if a date is in the past
  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for accurate date comparison
    return date < today;
  };

  // Check if a time is in the past
  const isPastTime = (date) => {
    const now = new Date();
    return date < now;
  };

  // Check if the date is in the current year
  const isCurrentYear = (date) => {
    const currentYear = new Date().getFullYear();
    return date.getFullYear() === currentYear;
  };

  // Check if the slot conflicts with any CONFIRMED bookings only
  const checkForConflicts = (start, end, hall) => {
    // Check against ONLY confirmed bookings
    const confirmedBookings = allBookings.filter(booking => 
      !booking.isTemporary && 
      (booking.isConfirmed || booking.status === "confirmed") &&
      (hall === "" || hall === "All Halls" || booking.hall === hall)
    );
    
    return confirmedBookings.find(booking => {
      // Check if the new booking overlaps with existing booking
      return (
        (start >= booking.start && start < booking.end) || // New start time falls within existing booking
        (end > booking.start && end <= booking.end) || // New end time falls within existing booking
        (start <= booking.start && end >= booking.end) // New booking completely encompasses existing booking
      );
    });
  };

  // Handle clicking on an existing event
  const handleEventClick = (event) => {
    // If user is director, don't allow interaction with events
    if (userRole === 'director') {
      return; // Simply return without doing anything
    }
    
    // Don't do anything with temporary events
    if (event.isTemporary) return;
    
    // Set selected booking
    setSelectedBooking(event);
    
    // Clear any existing selected slot
    setSelectedSlot(null);
    
    // Fetch the latest status of this booking
    fetchBookingStatus(event.id);
  };
  
  // Fetch the current status of a booking
  const fetchBookingStatus = async (bookingId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/bookings/${bookingId}/status`);
      
      // Update the booking status in our allBookings reference list
      const updatedAllBookings = allBookings.map(event => {
        if (event.id === bookingId) {
          return {
            ...event,
            isConfirmed: response.data.isConfirmed,
            status: response.data.status || (response.data.isConfirmed ? "confirmed" : "pending"),
            title: response.data.title + (response.data.isConfirmed || response.data.status === "confirmed" ? " (Already Booked)" : "")
          };
        }
        return event;
      });
      
      setAllBookings(updatedAllBookings);
      
      // Update only confirmed events in the events list
      const confirmedEvents = updatedAllBookings.filter(event => 
        (event.isConfirmed || event.status === "confirmed") && !event.isTemporary
      );
      
      // Add any temporary events back
      const temporaryEvents = events.filter(event => event.isTemporary);
      setEvents([...confirmedEvents, ...temporaryEvents]);
      
      // Also update selected booking if it's the one we just checked
      if (selectedBooking && selectedBooking.id === bookingId) {
        setSelectedBooking({
          ...selectedBooking,
          isConfirmed: response.data.isConfirmed,
          status: response.data.status || (response.data.isConfirmed ? "confirmed" : "pending"),
          title: response.data.title + (response.data.isConfirmed || response.data.status === "confirmed" ? " (Already Booked)" : "")
        });
      }
      
      // Update pending bookings for director view
      const pendingBookingsList = updatedAllBookings.filter(event => 
        !event.isConfirmed && event.status === "pending"
      );
      setPendingBookings(pendingBookingsList);
    } catch (err) {
      console.error("Error fetching booking status:", err);
    }
  };

  // Modified handleSlotSelection function with role check
  const handleSlotSelection = (slotInfo) => {
    // If user is a director, they should not be able to book slots
    if (userRole === 'director') {
      return; // For directors, simply do nothing when trying to select a slot
    }
    
    // First check if the selected date is in the past
    if (isPastDate(new Date(slotInfo.start))) {
      alert("Cannot book dates in the past. Please select a current or future date.");
      return;
    }

    // Check if the selected date is in the current year
    if (!isCurrentYear(new Date(slotInfo.start))) {
      alert("Bookings are only allowed for the current year. Please select a date within this year.");
      return;
    }

    // For today, also check if the selected time is in the past
    const isToday = moment(slotInfo.start).isSame(moment(), 'day');
    if (isToday && isPastTime(new Date(slotInfo.start))) {
      alert("Cannot book time slots in the past. Please select a current or future time slot.");
      return;
    }

    // Only create a slot if the user explicitly selects a time in day or week view
    // Don't auto-create slots when clicking on dates from month view
    if (view === "day" || view === "week") {
      const startTime = moment(slotInfo.start);
      
      const roundedStart = moment(startTime).startOf('hour');
      let roundedEnd = moment(roundedStart).add(3, 'hours');
      
      // Additional check for rounded times
      if (isPastTime(roundedStart.toDate())) {
        alert("Cannot book time slots in the past. Please select a current or future time slot.");
        return;
      }
      
      // Use the specifically selected hall instead of the filter dropdown value
      const hallToCheck = selectedHall === "All Halls" ? formData.hall : selectedHall;
      
      // Check for conflicts with ONLY confirmed bookings
      const conflictingEvent = checkForConflicts(
        roundedStart.toDate(), 
        roundedEnd.toDate(), 
        hallToCheck
      );
      
      if (conflictingEvent) {
        // If there's a conflict, show the booking details instead of allowing a new booking
        setSelectedBooking(conflictingEvent);
        setSelectedSlot(null);
        
        // Clear any existing temporary events
        const filteredEvts = events.filter(event => !event.isTemporary);
        setEvents(filteredEvts);
        
        alert(`This time slot is already booked for "${conflictingEvent.title.replace(" (Already Booked)", "")}" in ${conflictingEvent.hall}.`);
        return;
      }
      
      // Clear the selected booking when selecting a new slot
      setSelectedBooking(null);

      const newSelection = {
        start: roundedStart.toDate(),
        end: roundedEnd.toDate(),
        title: "Selected Slot",
        isSelected: true,
        isTemporary: true,
        hall: hallToCheck
      };

      // Remove any existing temporary events
      const filteredEvts = events.filter(event => !event.isTemporary);
      setEvents([...filteredEvts, newSelection]);
      
      setSelectedSlot({
        start: roundedStart.toDate(),
        end: roundedEnd.toDate()
      });

      // Reset form data for new booking with currently selected hall
      setFormData(prev => ({
        ...prev,
        title: "New Booking",
        bookedBy: "",
        description: ""
        // Keep the hall as is
      }));
    } else {
      // If coming from month view, just switch to day view without creating a slot
      setDate(slotInfo.start);
      setView("day");
      
      // Clean up any existing temporary slots
      const filteredEvts = events.filter(event => !event.isTemporary);
      setEvents(filteredEvts);
      setSelectedSlot(null);
      setSelectedBooking(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  
  
  // Handle rejection of a booking (for directors only)
 

  // Updated handleConfirmBooking with user role check
  const handleConfirmBooking = async () => {
    // If user is a director, they should not be able to book slots
    if (userRole === 'director') {
      alert("As a director, you are not authorized to create bookings. Please contact a faculty member or staff to create a booking.");
      return;
    }
    
    // Add validation for hall selection
    if (!formData.hall) {
      alert("Please select a hall before confirming booking");
      return;
    }

    // Double-check that the selected slot is not in the past
    if (isPastTime(selectedSlot.start)) {
      alert("Cannot book time slots in the past. Please select a current or future time slot.");
      return;
    }
    
    // Double-check year restriction
    if (!isCurrentYear(selectedSlot.start)) {
      alert("Bookings are only allowed for the current year. Please select a date within this year.");
      return;
    }

    // Final check for conflicts with ONLY confirmed bookings before submission
    const conflictingEvent = checkForConflicts(
      selectedSlot.start, 
      selectedSlot.end, 
      formData.hall
    );
    
    if (conflictingEvent) {
      alert(`This time slot is already booked for "${conflictingEvent.title.replace(" (Already Booked)", "")}" in ${conflictingEvent.hall}. Please select another time or hall.`);
      return;
    }

    if (selectedSlot) {
      try {
        // Get user info from sessionStorage
        let userEmail = "";
        let userData = null;
        
        try {
          const userDataString = sessionStorage.getItem('userData');
          if (userDataString) {
            userData = JSON.parse(userDataString);
          } else {
            // Try to get it directly as shown in your example
            const sessionData = sessionStorage.getItem('{"uid":"ajtZE2yvcHOMwIOz7i2Ow7UHsmN2","email":"srikarjanjirala92@gmail.com","displayName":"","userType":"faculty","photoURL":"","emailVerified":false,"lastLoginTime":"2025-04-20T19:17:01.363Z"}');
            if (sessionData) {
              userData = JSON.parse(sessionData);
            }
          }
          
          // If we still don't have userData, check all sessionStorage keys
          if (!userData) {
            for (let i = 0; i < sessionStorage.length; i++) {
              const key = sessionStorage.key(i);
              try {
                const value = sessionStorage.getItem(key);
                const parsedValue = JSON.parse(value);
                if (parsedValue && parsedValue.email) {
                  userData = parsedValue;
                  break;
                }
              } catch (e) {
                // Skip if can't parse as JSON
                continue;
              }
            }
          }
          
          userEmail = userData?.email || "";
        } catch (e) {
          console.error("Error retrieving user data from sessionStorage:", e);
        }

        // Prepare booking data for backend
        const bookingData = {
          title: formData.title || "New Booking",
          start: selectedSlot.start,
          end: selectedSlot.end,
          bookedBy: formData.bookedBy || "Anonymous",
          description: formData.description || "",
          hall: formData.hall,
          email: userEmail
        };
        
        // Send booking to backend
        const response = await axios.post('http://localhost:5000/api/bookings/book', bookingData);
        
        // Create the new event object
        const newBooking = {
          id: response.data._id,
          title: response.data.title + (response.data.isConfirmed || response.data.status === "confirmed" ? " (Already Booked)" : ""),
          start: new Date(response.data.start),
          end: new Date(response.data.end),
          bookedBy: response.data.bookedBy,
          description: response.data.description,
          hall: response.data.hall,
          isConfirmed: response.data.isConfirmed,
          status: response.data.status || (response.data.isConfirmed ? "confirmed" : "pending"),
          email: response.data.email
        };

        // Add to allBookings reference list
        setAllBookings(prev => [...prev, newBooking]);
        
        // Only add confirmed bookings to visible events
        if (newBooking.isConfirmed || newBooking.status === "confirmed") {
          const filteredEvts = events.filter(event => !event.isTemporary);
          setEvents([...filteredEvts, newBooking]);
        } else {
          // Remove temporary events but don't add the pending booking to visible events
          const filteredEvts = events.filter(event => !event.isTemporary);
          setEvents(filteredEvts);
        }
        
        // Reset selected slot
        setSelectedSlot(null);
        
        // Refresh bookings from server to ensure we have latest data
        fetchBookings();
        
        // Reset view to month after booking is confirmed
        setView("month");
        
        // Show success message
        alert("Booking request submitted successfully! It will appear on the calendar once confirmed by an admin.");
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
          backgroundColor: '#98FB98', // Light green for temporary selection
          border: '2px solid #90EE90',
          color: '#006400', // Dark green text for contrast
          fontWeight: 'bold'
        }
      };
    }
    
    // Confirmed bookings (we only show confirmed bookings now)
    return {
      style: {
        backgroundColor: '#FF9999', // Light red for confirmed bookings
        border: '2px solid #FF6666',
        color: '#8B0000', // Dark red text for contrast
        fontWeight: 'bold',
        opacity: 0.9
      }
    };
  };

  // Custom date cell styling to gray out past dates and dates not in the current year
  const dayPropGetter = (date) => {
    if (isPastDate(date) || !isCurrentYear(date)) {
      return {
        className: 'past-date',
        style: {
          backgroundColor: '#f5f5f5',
          opacity: 0.7,
          cursor: 'not-allowed'
        }
      };
    }
    return {};
  };

  const minTime = new Date();
  minTime.setHours(9, 0, 0);
  const maxTime = new Date();
  maxTime.setHours(17, 0, 0);

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-12 col-md-12">
          <div className="card shadow-lg">
            <div className="card-body">
              
              {!initialSelectedHall && (
                <div className="row mb-3">
                  <div className="col-md-4">
                    <div className="input-group">
                      <span className="input-group-text bg-primary text-white">
                        <BsFilter size={18} />
                      </span>
                      <select 
                        className="form-select"
                        value={selectedHall}
                        onChange={handleHallChange}
                        aria-label="Filter by hall"
                      >
                        <option value="All Halls">All Halls</option>
                        {AVAILABLE_HALLS.map((hall, index) => (
                          <option key={index} value={hall}>
                            {hall}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="row mb-3">
                <div className="col-12">
                  <div className="d-flex justify-content-start gap-3">
                    <div className="d-flex align-items-center">
                      <div style={{ width: 16, height: 16, backgroundColor: '#FF9999', marginRight: 5 }}></div>
                      <small>Confirmed (Already Booked)</small>
                    </div>
                    {userRole !== 'director' && (
                      <div className="d-flex align-items-center">
                        <div style={{ width: 16, height: 16, backgroundColor: '#98FB98', marginRight: 5 }}></div>
                        <small>Selected Slot</small>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
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
                  events={filteredEvents}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 500 }}
                  views={["month", "week", "day"]}
                  view={view}
                  date={date}
                  onView={setView}
                  onNavigate={handleNavigate}
                  selectable={userRole !== 'director'} // Only allow slot selection for non-directors
                  step={60}
                  timeslots={1}
                  min={minTime}
                  max={maxTime}
                  onSelectSlot={handleSlotSelection}
                  onSelectEvent={handleEventClick}
                  onDrillDown={userRole === 'director' ? null : handleDateClick} // Only allow drilling down for non-directors
                  defaultView="month"
                  eventPropGetter={eventStyleGetter}
                  dayPropGetter={dayPropGetter}
                />
              )}
              
              {selectedBooking && (
                <div className="mt-4">
                  <div className="card mb-3">
                    <div className="card-body">
                      <h5 className="card-title">
                        {selectedBooking.title.replace(" (Already Booked)", "")}
                      </h5>
                      <p className="card-text">
                        <strong>Time:</strong> {moment(selectedBooking.start).format('MMMM D, YYYY h:mm A')} - {moment(selectedBooking.end).format('h:mm A')}
                      </p>
                      <p className="card-text">
                        <strong>Hall:</strong> {selectedBooking.hall}
                      </p>
                      <p className="card-text">
                        <strong>Booked By:</strong> {selectedBooking.bookedBy}
                      </p>
                      {selectedBooking.description && (
                        <p className="card-text">
                          <strong>Description:</strong> {selectedBooking.description}
                        </p>
                      )}
                      <p className="card-text">
                        <strong>Status:</strong> {selectedBooking.status === "pending" ? "Pending Approval" : "Confirmed"}
                      </p>
                      
                      {/* Director-specific actions for pending bookings */}
                      
                      
                      
                    </div>
                  </div>
                </div>
              )}
              
              {selectedSlot && !selectedBooking && userRole !== 'director' && (
                <div className="mt-4">
                  <div className="card">
                    <div className="card-header bg-primary text-white">
                      <h5 className="mb-0">create new Booking</h5>
                    </div>
                    <div className="card-body">
                      <form>
                        <div className="mb-3">
                          <label htmlFor="title" className="form-label d-flex align-items-center">
                            <BsCalendar3 className="me-2" /> Event Title
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
                          <label htmlFor="bookedBy" className="form-label d-flex align-items-center">
                            <BsPerson className="me-2" /> Your name
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
                          <label htmlFor="hall" className="form-label d-flex align-items-center">
                            <BsBuilding className="me-2" /> Hall
                          </label>
                          <select
                            className="form-select"
                            id="hall"
                            name="hall"
                            value={formData.hall}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Select Hall</option>
                            {AVAILABLE_HALLS.map((hall, index) => (
                              <option key={index} value={hall}>
                                {hall}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="mb-3">
                          <label htmlFor="description" className="form-label d-flex align-items-center">
                            <BsCardText className="me-2" /> Description
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
                        
                        <div className="mb-3">
                          <label className="form-label d-flex align-items-center">
                            <BsClock className="me-2" /> Selected Time
                          </label>
                          <p className="form-control-static">
                            {moment(selectedSlot.start).format('MMMM D, YYYY h:mm A')} - {moment(selectedSlot.end).format('h:mm A')}
                          </p>
                        </div>
                        
                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleConfirmBooking}
                          >
                            <BsCheckCircle  />Request  Booking
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {
                              setSelectedSlot(null);
                              const filteredEvts = events.filter(event => !event.isTemporary);
                              setEvents(filteredEvts);
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
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