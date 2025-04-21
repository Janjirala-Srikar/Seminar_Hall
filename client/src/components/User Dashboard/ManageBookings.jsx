import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import './ManageBookings.css';
import { getAuth } from 'firebase/auth';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const auth = getAuth();
  
  useEffect(() => {
    // Get current user from Firebase Auth
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && user.email) {
        setUserEmail(user.email);
        fetchBookingsByEmail(user.email);
      } else {
        setError('User not authenticated. Please log in.');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Function to fetch bookings by email
  const fetchBookingsByEmail = async (email) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/bookings`);
      setBookings(response.data.filter(booking => booking.email === email));
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch bookings. Please try again later.');
      setLoading(false);
      console.error('Error fetching bookings:', err);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  return (
    <Container fluid className="bookings-container">
      <Row className="justify-content-start mb-4">
        <Col md={6} lg={4}>
          <h2 className="bookings-header">Your Booking Requests</h2>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status" className="custom-spinner">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : error ? (
        <div className="alert alert-danger error-message">{error}</div>
      ) : bookings.length > 0 ? (
        <div className="table-container">
          <Table responsive className="booking-table">
            <thead>
              <tr>
                <th>Event Title</th>
                <th>Venue</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Status</th>
                {/* <th>Description</th> */}
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td className="booking-title">{booking.title}</td>
                  <td>{booking.hall || 'Not specified'}</td>
                  <td>{formatDate(booking.start)}</td>
                  <td>{formatDate(booking.end)}</td>
                  <td>
                    <div className={`status-badge status-${booking.status}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </div>
                  </td>
                
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : userEmail ? (
        <Row className="justify-content-center">
          <Col md={8}>
            <div className="no-bookings">
              <div className="no-bookings-icon">
                <i className="bi bi-calendar-x"></i>
              </div>
              <h4>No bookings found</h4>
              <p>We couldn't find any bookings associated with {userEmail}.</p>
            </div>
          </Col>
        </Row>
      ) : null}
    </Container>
  );
};

export default ManageBookings;