// SeminarHall Component
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './AdminSeminar.css';

const seminarHallsData = [
  {
    id: 1,
    name: 'Main Auditorium',
    capacity: 500,
    image: 'https://cdn-klbmd.nitrocdn.com/oflAEolSqrPhKMSrYpDBcfHfpcFckcly/assets/images/optimized/rev-1bcb9bb/www.dbsindia.com/images/conference-room/meetingroomsinsecunderabad.webp',
    bookings: [
      { date: '2025-02-20', startTime: '10:00', endTime: '12:00', purpose: 'Technical Seminar' },
      { date: '2025-02-21', startTime: '14:00', endTime: '16:00', purpose: 'Guest Lecture' }
    ]
  },
  {
    id: 2,
    name: 'Conference Hall A',
    capacity: 200,
    image: 'https://www.dsc.du.ac.in/wp-content/uploads/2022/03/seminar-hall-98-scaled.jpg',
    bookings: [
      { date: '2025-02-20', startTime: '09:00', endTime: '11:00', purpose: 'Department Meeting' }
    ]
  },
  {
    id: 3,
    name: 'Seminar Room B',
    capacity: 100,
    image: 'https://vnrvjiet.acm.org/resources/img/events/selective2.png',
    bookings: [
      { date: '2025-02-22', startTime: '13:00', endTime: '15:00', purpose: 'Workshop' }
    ]
  },
  {
    id: 4,
    name: 'Mini Hall C',
    capacity: 50,
    image: 'https://vnrvjiet.acm.org/resources/img/events/web3.0grid.png',
    bookings: [
      { date: '2025-02-23', startTime: '11:00', endTime: '13:00', purpose: 'Project Presentation' }
    ]
  }
];

const SeminarHall = ({ hall, onClick, isSelected }) => {
  return (
    <div
      className={`hall-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onClick(hall)}
    >
      <div className="hall-image-container">
        <img 
          src={hall.image} 
          alt={hall.name} 
          className="hall-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=Hall+Image';
          }}
        />
      </div>
      <div className="hall-info">
        <h3 className="hall-name">{hall.name}</h3>
        <div className="hall-details">
          <div className="hall-capacity">
            <span className="icon">👥</span>
            <span>{hall.capacity} seats</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const BookingsList = ({ bookings, date }) => {
  const filteredBookings = bookings.filter(booking => booking.date === date);

  return (
    <div className="bookings-list">
      <h3>Bookings for {date}</h3>
      {filteredBookings.length === 0 ? (
        <p>No bookings for this date</p>
      ) : (
        filteredBookings.map((booking, index) => (
          <div key={index} className="booking-item">
            <p>Time: {booking.startTime} - {booking.endTime}</p>
            <p>Purpose: {booking.purpose}</p>
          </div>
        ))
      )}
    </div>
  );
};

const AdminSeminar = () => {
  const [selectedHall, setSelectedHall] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleHallClick = (hall) => {
    setSelectedHall(hall);
    const calendarSection = document.querySelector('.calendar-container');
    if (calendarSection) {
      calendarSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const checkBookings = (date) => {
    if (!selectedHall) return false;
    const formattedDate = formatDate(date);
    return selectedHall.bookings.some(booking => booking.date === formattedDate);
  };

  const getTileClassName = ({ date, view }) => {
    if (view !== 'month') return '';
    
    const hasBooking = checkBookings(date);
    const isToday = date.toDateString() === new Date().toDateString();
    
    let className = '';
    
    if (hasBooking) {
      className += 'react-calendar__tile--booked';
    } else {
      className += 'react-calendar__tile--empty';
    }
    
    if (isToday) {
      className += ' react-calendar__tile--now';
    }
    
    return className;
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-header">Seminar Halls Dashboard</h1>
      
      <div className="halls-grid">
        {seminarHallsData.map(hall => (
          <SeminarHall
            key={hall.id}
            hall={hall}
            onClick={handleHallClick}
            isSelected={selectedHall?.id === hall.id}
          />
        ))}
      </div>

      {selectedHall && (
        <div className="calendar-container">
          <h2 className="calendar-header">
            Bookings Calendar - {selectedHall.name}
          </h2>
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            tileClassName={getTileClassName}
            tileContent={({ date }) => {
              const formattedDate = formatDate(date);
              const hasBooking = selectedHall.bookings.some(
                booking => booking.date === formattedDate
              );
              return hasBooking ? <div className="booking-dot" /> : null;
            }}
          />
          <BookingsList 
            bookings={selectedHall.bookings}
            date={formatDate(selectedDate)}
          />
        </div>
      )}
    </div>
  );
};

export default AdminSeminar;
