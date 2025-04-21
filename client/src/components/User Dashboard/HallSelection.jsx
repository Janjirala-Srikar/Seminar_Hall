import React, { useState } from "react";
import { FaUsers, FaCalendarAlt } from "react-icons/fa";
import BookingCalendar from "../Calender/BookingCalender";
import "bootstrap/dist/css/bootstrap.min.css";
import "./HallSelection.css";

// Available halls data
const HALLS = [
  {
    id: 1,
    name: "B-block Seminar Hall",
    image: "https://i.ytimg.com/vi/AqCh9emIDOA/maxresdefault.jpg",
    capacity: 200,
    description: "Modern seminar hall with state-of-the-art presentation equipment"
  },
  {
    id: 2,
    name: "KS Audi",
    image: "https://i.postimg.cc/hvyDN57x/DSC0059.jpg",
    capacity: 500,
    description: "Large auditorium for major events and functions"
  },
  {
    id: 3,
    name: "APJ Abdul Kalam Hall",
    image: "https://i.postimg.cc/3wwjhqZ8/DSC08903.jpg",
    capacity: 300,
    description: "Multipurpose hall with flexible seating arrangements"
  }
];

const HallSelectionComponent = () => {
  const [selectedHall, setSelectedHall] = useState(null);
  
  const handleCardClick = (hall) => {
    // If the same hall is clicked again, toggle the selection off
    if (selectedHall === hall.name) {
      setSelectedHall(null);
    } else {
      setSelectedHall(hall.name);
    }
  };
  
  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4" style={{color:'#82001A'}}>Conference Halls and Auditoriums</h2>
      <p className="text-center mb-5"  style={{color:'#82001A'}}>Select a venue to check availability and make bookings</p>
      
      <div className="row g-4">
        {HALLS.map((hall) => (
          <div key={hall.id} className="col-md-4">
            <div 
              className={`card hall-card shadow h-100 ${selectedHall === hall.name ? 'selected' : ''}`}
              onClick={() => handleCardClick(hall)}
            >
              <div className="card-img-container">
                <img 
                  src={hall.image || "/api/placeholder/400/320"}
                  className="card-img-top" 
                  alt={hall.name}
                />
                <div className="overlay">
                  <FaCalendarAlt className="calendar-icon" size={40} />
                  <p>View Calendar</p>
                </div>
              </div>
              <div className="card-body">
                <h5 className="card-title" style={{color:'#82001A'}}>{hall.name}</h5>
                <p className="card-text">{hall.description}</p>
              </div>
              <div className="card-footer bg-transparent">
                <div className="d-flex align-items-center">
                  <FaUsers className="me-2" />
                  <span>{hall.capacity} seats</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {selectedHall && (
        <div className="mt-5 calendar-container">
          <div className="selected-hall-header">
            <h3 style={{color:'#82001A'}}>Booking Calendar: {selectedHall}</h3>
            <p className="text-muted">
              Select a time slot to make a booking for {selectedHall}
            </p>
          </div>
          <BookingCalendar initialSelectedHall={selectedHall} />
        </div>
      )}
    </div>
  );
};

export default HallSelectionComponent;