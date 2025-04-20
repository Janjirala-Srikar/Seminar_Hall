import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import axios from 'axios';
import emailjs from 'emailjs-com'; // Import EmailJS
import "react-big-calendar/lib/css/react-big-calendar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import './RequestDashboard.css';

const localizer = momentLocalizer(moment);

// EmailJS configuration - replace with your actual IDs
const EMAILJS_SERVICE_ID = "service_hhd08wj";
const EMAILJS_TEMPLATE_ID = "template_ftwfvf9";
const EMAILJS_USER_ID = "E5kMlbPJH7tAvXFvL";

function BookingDisplay() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [calendarView, setCalendarView] = useState('month');
  const [newBooking, setNewBooking] = useState({
    title: '',
    start: '',
    end: '',
    bookedBy: '',
    hallname: '',
    email: '' // Add email field
  });

  const fetchBookings = () => {
    setLoading(true);
    axios.get('http://localhost:5000/api/bookings/')
      .then(response => {
        console.log("Fetched bookings data:", response);
        
        if (response && response.data) {
          const bookingsData = Array.isArray(response.data) ? response.data : 
                             (response.data.data && Array.isArray(response.data.data) ? 
                              response.data.data : []);
          setBookings(bookingsData);
          
          // Format events for the calendar
          const formattedEvents = bookingsData.map(booking => ({
            id: booking._id || booking.id,
            title: booking.title || booking.name || 'Unnamed Booking',
            start: new Date(booking.start || booking.date),
            end: booking.end ? new Date(booking.end) : new Date(new Date(booking.start || booking.date).getTime() + 3600000),
            bookedBy: booking.bookedBy || booking.customer || 'Unknown',
            hallname: booking.hallname || booking.hall || booking.location || 'N/A',
            status: booking.status || (booking.isConfirmed ? 'confirmed' : 'pending'),
            email: booking.email || '', // Include email for notifications
            resource: booking // Store the entire booking object for reference
          }));
          
          setCalendarEvents(formattedEvents);
        } else {
          setError("Received data is not in the expected format");
          setBookings([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching bookings:', err);
        setError("Failed to fetch bookings");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBookings();
    
    // Add Bootstrap icons CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css';
    document.head.appendChild(link);
    
    // Initialize EmailJS
    emailjs.init(EMAILJS_USER_ID);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const handleView = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleCalendarEventClick = (event) => {
    // When calendar event is clicked, find the associated booking and show modal
    const booking = event.resource;
    if (booking) {
      setSelectedBooking(booking);
      setShowModal(true);
      // Switch calendar view to day view centered on this event
      setCalendarView('day');
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedBooking(null);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setNewBooking({
      title: '',
      start: '',
      end: '',
      bookedBy: '',
      hallname: '',
      email: ''
    });
  };

  const displayNotification = (message, type) => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBooking(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateBooking = (e) => {
    e.preventDefault();
    
    // Ensure hallname is included
    if (!newBooking.hallname) {
      displayNotification('Please select a hall for the booking', 'danger');
      return;
    }
    
    // Ensure email is included
    if (!newBooking.email) {
      displayNotification('Please provide an email address for notifications', 'danger');
      return;
    }
    
    console.log("Sending booking data:", newBooking);
    
    axios.post('http://localhost:5000/api/bookings/book', newBooking)
      .then(response => {
        console.log("Booking created:", response);
        displayNotification('New booking created successfully!', 'success');
        fetchBookings();
        handleCloseCreateModal();
      })
      .catch(err => {
        console.error('Error creating booking:', err);
        displayNotification('Failed to create booking. Please try again.', 'danger');
      });
  };

  // Function to send notification email
  // const sendNotificationEmail = (booking, status) => {
  //   if (!booking.email) {
  //     console.warn("No email address provided for booking notification");
  //     return Promise.resolve();
  //   }

  //   const startDateTime = new Date(booking.start || booking.date);
  //   const endDateTime = booking.end ? new Date(booking.end) : new Date(startDateTime.getTime() + 3600000);
    
  //   const templateParams = {
  //     to_name: booking.bookedBy || booking.customer || "Valued Customer",
  //     to_email: booking.email,
  //     booking_title: booking.title || booking.name || "Your Booking",
  //     booking_date: startDateTime.toLocaleDateString('en-US', { 
  //       year: 'numeric', month: 'long', day: 'numeric'
  //     }),
  //     booking_time: `${startDateTime.toLocaleTimeString('en-US', { 
  //       hour: '2-digit', minute: '2-digit'
  //     })} - ${endDateTime.toLocaleTimeString('en-US', { 
  //       hour: '2-digit', minute: '2-digit'
  //     })}`,
  //     booking_location: booking.hallname || booking.hall || booking.location || "N/A",
  //     booking_status: status === 'confirm' ? 'APPROVED' : 'REJECTED',
  //     rejection_reason: status === 'reject' ? "The requested slot is unavailable." : "",
  //     admin_message: status === 'confirm' 
  //       ? "Your booking has been approved. We look forward to hosting your event."
  //       : "We're sorry, but your booking request has been rejected. Please contact us for more information."
  //   };
    
  //   console.log("Sending email with params:", templateParams);
    
  //   return emailjs.send(
  //     EMAILJS_SERVICE_ID, 
  //     EMAILJS_TEMPLATE_ID, 
  //     templateParams
  //   )
  //   .then(response => {
  //     console.log('Email sent successfully:', response);
  //     return response;
  //   })
  //   .catch(err => {
  //     console.error('Failed to send email:', err);
  //     throw err;
  //   });
  // };

  const sendNotificationEmail = (booking, status) => {
    if (!booking.email) {
      console.warn("No email address provided for booking notification");
      return Promise.resolve();
    }
  
    const startDateTime = new Date(booking.start || booking.date);
    const endDateTime = booking.end
      ? new Date(booking.end)
      : new Date(startDateTime.getTime() + 3600000); // default to 1 hour later
  
    const templateParams = {
      email: booking.email, // ✅ Matches {{email}} in your EmailJS template
      name: booking.bookedBy || booking.customer || "Valued Customer", // ✅ Matches {{name}} in EmailJS
      title: status === 'confirm' ? 'APPROVED' : 'REJECTED', // ✅ Matches {{title}} in subject line
      message:
        status === 'confirm'
          ? "Your booking has been approved. We look forward to hosting your event."
          : "We're sorry, but your booking request has been rejected. Please contact us for more information.",
      booking_date: startDateTime.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      booking_time: `${startDateTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })} - ${endDateTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })}`,
      booking_location: booking.hallname || booking.hall || booking.location || "N/A",
      rejection_reason: status === 'reject' ? "The requested slot is unavailable." : "",
    };
  
    console.log("Sending email with params:", templateParams);
  
    return emailjs
      .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
      .then((response) => {
        console.log("Email sent successfully:", response);
        return response;
      })
      .catch((err) => {
        console.error("Failed to send email:", err);
        throw err;
      });
  };
  

  const handleStatusUpdate = (bookingId, action) => {
    // Find the booking object to get email info
    const bookingToUpdate = bookings.find(booking => booking._id === bookingId || booking.id === bookingId);
    
    if (!bookingToUpdate) {
      displayNotification('Booking information not found', 'danger');
      return;
    }
    
    axios.put(`http://localhost:5000/api/bookings/${bookingId}/status`, { action })
      .then(response => {
        console.log("Status updated:", response.data);
        
        // Send notification email
        return sendNotificationEmail(bookingToUpdate, action)
          .then(() => {
            displayNotification(
              `Booking ${action === 'confirm' ? 'confirmed' : 'rejected'} and notification sent!`, 
              'success'
            );
          })
          .catch(() => {
            displayNotification(
              `Booking ${action === 'confirm' ? 'confirmed' : 'rejected'} but email notification failed.`, 
              'warning'
            );
          });
      })
      .then(() => {
        fetchBookings(); // Refresh the bookings data
        handleClose(); // Close the modal
      })
      .catch(err => {
        console.error('Error updating booking status:', err);
        displayNotification(`Failed to ${action} booking. Please try again.`, 'danger');
      });
  };

  const getStatusBadge = (booking) => {
    if (booking.status === 'rejected') {
      return <span className="badge bg-danger">Rejected</span>;
    } else if (booking.status === 'approved' || booking.isConfirmed) {
      return <span className="badge bg-success">Confirmed</span>;
    } else {
      return <span className="badge bg-warning text-dark">Pending</span>;
    }
  };
  
  // Event styling with colors based on status
  const eventStyleGetter = (event) => {
    if (event.status === 'rejected') {
      return {
        style: {
          backgroundColor: 'var(--primary-light)',
          borderColor: 'var(--primary)',
          borderLeft: '3px solid var(--primary)'
        }
      };
    } else if (event.status === 'approved' || event.status === 'confirmed') {
      return {
        style: {
          backgroundColor: 'var(--primary)',
          borderColor: 'var(--primary-light)',
          color: 'var(--white)'
        }
      };
    } else {
      return {
        style: {
          backgroundColor: 'var(--medium-gray)',
          borderColor: 'var(--dark-gray)',
          color: 'var(--white)'
        }
      };
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh', background: 'var(--background-light)' }}>
        <div className="text-center">
          <div className="spinner-grow" style={{ color: 'var(--primary)' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 fw-bold" style={{ color: 'var(--primary)' }}>Loading Booking Management System...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger d-flex align-items-center shadow-sm" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2 fs-4"></i>
          <div>{error}</div>
        </div>
      </div>
    );
  }
  return (
    <div className="booking-system min-vh-100" style={{ background: 'var(--background-light)' }}>
      {/* Notification toast */}
      {showNotification && (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 5000 }}>
          <div className="toast show shadow border-0" role="alert">
            <div className="toast-header" style={{ 
              background: notificationType === 'success' ? 'var(--primary)' : 'var(--primary-light)', 
              color: 'var(--white)' 
            }}>
              <strong className="me-auto">
                {notificationType === 'success' ? 'Success' : 'Alert'}
              </strong>
              <button 
                type="button" 
                className="btn-close btn-close-white" 
                onClick={() => setShowNotification(false)}
              ></button>
            </div>
            <div className="toast-body">
              {notificationType === 'success' ? (
                <div className="d-flex align-items-center">
                  <i className="bi bi-check-circle-fill me-2 fs-4" style={{ color: 'var(--primary)' }}></i>
                  <span>{notificationMessage}</span>
                </div>
              ) : (
                <div className="d-flex align-items-center">
                  <i className="bi bi-x-circle-fill me-2 fs-4" style={{ color: 'var(--primary-light)' }}></i>
                  <span>{notificationMessage}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header with New Booking Button */}
      <div className="container-fluid py-4 px-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold" style={{ color: 'var(--primary)' }}>Booking Management Dashboard</h4>
          <button 
            className="btn" 
            style={{ 
              background: 'var(--primary)', 
              color: 'var(--white)' 
            }} 
            onClick={() => setShowCreateModal(true)}
          >
            <i className="bi bi-plus-circle me-2"></i>
            New Booking
          </button>
        </div>

        {/* Clean Table Layout */}
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            {bookings.length === 0 ? (
              <div className="p-4 text-center">
                <i className="bi bi-calendar-x text-muted display-4 mb-3"></i>
                <p className="text-muted">No bookings found. Create a new booking to get started.</p>
                <button 
                  className="btn" 
                  style={{ 
                    background: 'var(--primary)', 
                    color: 'var(--white)' 
                  }} 
                  onClick={() => setShowCreateModal(true)}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Create New Booking
                </button>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead style={{ background: 'var(--background-light)' }}>
                    <tr>
                      <th scope="col" className="border-0 ps-4">#</th>
                      <th scope="col" className="border-0">Title</th>
                      <th scope="col" className="border-0">Booked By</th>
                      <th scope="col" className="border-0">Location</th>
                      <th scope="col" className="border-0">Date & Time</th>
                      <th scope="col" className="border-0">Status</th>
                      <th scope="col" className="border-0 text-end pe-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking, index) => (
                      <tr key={booking._id || booking.id || index}>
                        <th scope="row" className="ps-4">{index + 1}</th>
                        <td className="fw-medium">{booking.title || booking.name || 'Unnamed Booking'}</td>
                        <td>{booking.bookedBy || booking.customer || 'Unknown'}</td>
                        <td>{booking.hallname || booking.hall || booking.location || 'N/A'}</td>
                        <td>
                          <div>
                            {new Date(booking.start || booking.date).toLocaleDateString('en-US', { 
                              year: 'numeric', month: 'short', day: 'numeric'
                            })}
                          </div>
                          <div className="small text-muted">
                            {new Date(booking.start || booking.date).toLocaleTimeString('en-US', { 
                              hour: '2-digit', minute: '2-digit'
                            })} - {booking.end ? new Date(booking.end).toLocaleTimeString('en-US', { 
                              hour: '2-digit', minute: '2-digit'
                            }) : 'N/A'}
                          </div>
                        </td>
                        <td>
                          {getStatusBadge(booking)}
                        </td>
                        <td className="text-end pe-4">
                          <button 
                            className="btn btn-sm" 
                            style={{ 
                              borderColor: 'var(--primary)', 
                              color: 'var(--primary)' 
                            }}
                            onClick={() => handleView(booking)}
                          >
                            <i className="bi bi-eye me-1"></i> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Booking Modal */}
      {showCreateModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header" style={{ background: 'var(--primary)', color: 'var(--white)' }}>
                <h5 className="modal-title">
                  <i className="bi bi-plus-circle me-2"></i>
                  Create New Booking
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={handleCloseCreateModal}></button>
              </div>
              <form onSubmit={handleCreateBooking}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">Event Title</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="title" 
                      name="title"
                      value={newBooking.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="bookedBy" className="form-label">Booked By</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="bookedBy" 
                      name="bookedBy"
                      value={newBooking.bookedBy}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="hallname" className="form-label">Location</label>
                    <select
                      className="form-select"
                      id="hallname"
                      name="hallname"
                      value={newBooking.hallname}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select a hall</option>
                      <option value="Bose Hall">Bose Hall</option>
                      <option value="Einstein Auditorium">Einstein Auditorium</option>
                      <option value="Newton Conference Room">Newton Conference Room</option>
                      <option value="Tesla Lab">Tesla Lab</option>
                    </select>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="start" className="form-label">Start Date & Time</label>
                      <input 
                        type="datetime-local" 
                        className="form-control" 
                        id="start" 
                        name="start"
                        value={newBooking.start}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="end" className="form-label">End Date & Time</label>
                      <input 
                        type="datetime-local" 
                        className="form-control" 
                        id="end" 
                        name="end"
                        value={newBooking.end}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer" style={{ background: 'var(--background-light)' }}>
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary" 
                    onClick={handleCloseCreateModal}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn" 
                    style={{ 
                      background: 'var(--primary)', 
                      color: 'var(--white)' 
                    }}
                  >
                    <i className="bi bi-save me-1"></i>
                    Create Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Improved Booking Details Modal with Calendar */}
      {showModal && selectedBooking && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header" style={{ background: 'var(--primary)', color: 'var(--white)' }}>
                <h5 className="modal-title">
                  <i className="bi bi-info-circle me-2"></i>
                  Booking Details
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={handleClose}></button>
              </div>
              <div className="modal-body p-3">
                <div className="row">
                  {/* Booking Information Column */}
                  <div className="col-md-4">
                    <div className="card shadow-sm h-100 border-0">
                      <div className="card-header py-3" style={{ background: 'var(--background-light)' }}>
                        <h6 className="mb-0 fw-bold">
                          <i className="bi bi-file-text me-2" style={{ color: 'var(--primary)' }}></i>
                          Event Information
                        </h6>
                      </div>
                      <div className="card-body">
                        <div className="mb-3">
                          <p className="text-muted small mb-1">Event Title</p>
                          <h5 className="fw-bold">{selectedBooking.title || selectedBooking.name}</h5>
                        </div>
                        <div className="mb-3">
                          <p className="text-muted small mb-1">Organizer</p>
                          <h6>{selectedBooking.bookedBy || selectedBooking.customer}</h6>
                        </div>
                        <div className="mb-3">
                          <p className="text-muted small mb-1">Location</p>
                          <h6>{selectedBooking.hallname || selectedBooking.hall || selectedBooking.location || 'N/A'}</h6>
                        </div>
                        <div className="row mb-3">
                          <div className="col-6">
                            <p className="text-muted small mb-1">Start Time</p>
                            <p>{new Date(selectedBooking.start || selectedBooking.date).toLocaleString([], {dateStyle: 'short', timeStyle: 'short'})}</p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted small mb-1">End Time</p>
                            <p>{selectedBooking.end ? new Date(selectedBooking.end).toLocaleString([], {dateStyle: 'short', timeStyle: 'short'}) : 'N/A'}</p>
                          </div>
                        </div>
                        <div className="mb-3">
                          <p className="text-muted small mb-1">Status</p>
                          {getStatusBadge(selectedBooking)}
                        </div>
                        <div className="d-flex gap-2 mb-2">
                          <button 
                            className="btn btn-sm" 
                            style={{ background: 'var(--primary)', color: 'var(--white)' }}
                            onClick={() => handleStatusUpdate(selectedBooking._id, 'confirm')}
                          >
                            <i className="bi bi-check-circle me-1"></i> Confirm
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => handleStatusUpdate(selectedBooking._id, 'reject')}
                          >
                            <i className="bi bi-x-circle me-1"></i> Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Calendar Column */}
                  <div className="col-md-8">
                    <div className="card shadow-sm h-100 border-0">
                      <div className="card-header py-3" style={{ background: 'var(--background-light)' }}>
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 className="mb-0 fw-bold">
                            <i className="bi bi-calendar3 me-2" style={{ color: 'var(--primary)' }}></i>
                            Schedule View
                          </h6>
                          <div className="btn-group btn-group-sm">
                            <button 
                              type="button" 
                              className={`btn ${calendarView === 'month' ? 'btn-primary' : 'btn-outline-secondary'}`}
                              style={calendarView === 'month' ? { background: 'var(--primary)', borderColor: 'var(--primary)' } : {}}
                              onClick={() => setCalendarView('month')}
                            >
                              Month
                            </button>
                            <button 
                              type="button" 
                              className={`btn ${calendarView === 'week' ? 'btn-primary' : 'btn-outline-secondary'}`}
                              style={calendarView === 'week' ? { background: 'var(--primary)', borderColor: 'var(--primary)' } : {}}
                              onClick={() => setCalendarView('week')}
                            >
                              Week
                            </button>
                            <button 
                              type="button" 
                              className={`btn ${calendarView === 'day' ? 'btn-primary' : 'btn-outline-secondary'}`}
                              style={calendarView === 'day' ? { background: 'var(--primary)', borderColor: 'var(--primary)' } : {}}
                              onClick={() => setCalendarView('day')}
                            >
                              Day
                            </button>
                            <button 
                              type="button" 
                              className={`btn ${calendarView === 'agenda' ? 'btn-primary' : 'btn-outline-secondary'}`}
                              style={calendarView === 'agenda' ? { background: 'var(--primary)', borderColor: 'var(--primary)' } : {}}
                              onClick={() => setCalendarView('agenda')}
                            >
                              Timeline
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="card-body p-2">
                        <Calendar
                          localizer={localizer}
                          events={calendarEvents}
                          startAccessor="start"
                          endAccessor="end"
                          style={{ height: 400 }}
                          view={calendarView}
                          views={['month', 'week', 'day', 'agenda']}
                          defaultDate={new Date(selectedBooking.start || selectedBooking.date)}
                          eventPropGetter={eventStyleGetter}
                          onSelectEvent={handleCalendarEventClick}
                          toolbar={true}
                          popup
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer" style={{ background: 'var(--background-light)' }}>
                <button 
                  className="btn btn-outline-secondary" 
                  onClick={handleClose}
                >
                  <i className="bi bi-x me-1"></i>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingDisplay;