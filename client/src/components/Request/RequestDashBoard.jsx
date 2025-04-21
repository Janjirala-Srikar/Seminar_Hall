import React, { useEffect, useState } from 'react';
import axios from 'axios';
import emailjs from 'emailjs-com';
import "bootstrap/dist/css/bootstrap.min.css";
// import './RequestDashboard.css';

// EmailJS configuration
const EMAILJS_SERVICE_ID = "service_hhd08wj";
const EMAILJS_TEMPLATE_ID = "template_ftwfvf9";
const EMAILJS_USER_ID = "E5kMlbPJH7tAvXFvL";

function BookingDisplay() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending'); // Default to 'pending'
  const [newBooking, setNewBooking] = useState({
    title: '',
    start: '',
    end: '',
    bookedBy: '',
    hallname: '',
    email: ''
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
          
          // Filter out past bookings
          const currentDate = new Date();
          const futureBookings = bookingsData.filter(booking => {
            const bookingDate = new Date(booking.start || booking.date);
            return bookingDate >= currentDate;
          });
          
          setBookings(futureBookings);
          
          // Apply filter if set
          applyFilter(futureBookings, filterStatus);
        } else {
          setError("Received data is not in the expected format");
          setBookings([]);
          setFilteredBookings([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching bookings:', err);
        setError("Failed to fetch bookings");
        setLoading(false);
      });
  };

  const applyFilter = (bookingsData, status) => {
    if (status === 'all') {
      setFilteredBookings(bookingsData);
    } else {
      let filtered;
      if (status === 'approved') {
        filtered = bookingsData.filter(booking => 
          booking.status === 'approved' || booking.status === 'confirmed' || booking.isConfirmed === true);
      } else if (status === 'rejected') {
        filtered = bookingsData.filter(booking => booking.status === 'rejected');
      } else if (status === 'pending') {
        filtered = bookingsData.filter(booking => 
          !booking.status || booking.status === 'pending' || 
          (booking.status !== 'approved' && booking.status !== 'confirmed' && booking.status !== 'rejected' && !booking.isConfirmed));
      }
      setFilteredBookings(filtered);
    }
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

  useEffect(() => {
    applyFilter(bookings, filterStatus);
  }, [filterStatus, bookings]);

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
      email: booking.email,
      name: booking.bookedBy || booking.customer || "Valued Customer",
      title: status === 'confirm' ? 'APPROVED' : 'REJECTED',
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

      {/* Header with New Booking Button and Filter Tabs */}
      <div className="container-fluid py-4 px-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold" style={{ color: 'var(--primary)' }}>Booking Management Dashboard</h4>
          <button 
            className="btn" 
            style={{ 
              background: 'var(--primary)', 
              color: 'var(--white)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }} 
            onClick={() => setShowCreateModal(true)}
          >
            <i className="bi bi-plus-circle me-2"></i>
            New Booking
          </button>
        </div>

        {/* Filter Navigation Pills */}
        <div className="mb-4">
          <div className="d-flex gap-2">
            <button 
              className={`btn px-4 py-2 ${filterStatus === 'all' ? 'active' : ''}`}
              style={{
                background: filterStatus === 'all' ? 'var(--primary)' : 'var(--white)',
                color: filterStatus === 'all' ? 'var(--white)' : 'var(--dark-gray)',
                fontWeight: filterStatus === 'all' ? '600' : '400',
                border: filterStatus === 'all' ? 'none' : '1px solid var(--medium-gray)',
                borderRadius: '4px',
                boxShadow: filterStatus === 'all' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
              }}
              onClick={() => setFilterStatus('all')}
            >
              <i className="bi bi-grid-3x3-gap me-2"></i>All Requests
            </button>
            <button 
              className={`btn px-4 py-2 ${filterStatus === 'pending' ? 'active' : ''}`}
              style={{
                background: filterStatus === 'pending' ? 'var(--primary)' : 'var(--white)',
                color: filterStatus === 'pending' ? 'var(--white)' : 'var(--dark-gray)',
                fontWeight: filterStatus === 'pending' ? '600' : '400',
                border: filterStatus === 'pending' ? 'none' : '1px solid var(--medium-gray)',
                borderRadius: '4px',
                boxShadow: filterStatus === 'pending' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
              }}
              onClick={() => setFilterStatus('pending')}
            >
              <i className="bi bi-clock-history me-2"></i>Pending
            </button>
            <button 
              className={`btn px-4 py-2 ${filterStatus === 'approved' ? 'active' : ''}`}
              style={{
                background: filterStatus === 'approved' ? 'var(--primary)' : 'var(--white)',
                color: filterStatus === 'approved' ? 'var(--white)' : 'var(--dark-gray)',
                fontWeight: filterStatus === 'approved' ? '600' : '400',
                border: filterStatus === 'approved' ? 'none' : '1px solid var(--medium-gray)',
                borderRadius: '4px',
                boxShadow: filterStatus === 'approved' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
              }}
              onClick={() => setFilterStatus('approved')}
            >
              <i className="bi bi-check-circle me-2"></i>Approved
            </button>
            <button 
              className={`btn px-4 py-2 ${filterStatus === 'rejected' ? 'active' : ''}`}
              style={{
                background: filterStatus === 'rejected' ? 'var(--primary)' : 'var(--white)',
                color: filterStatus === 'rejected' ? 'var(--white)' : 'var(--dark-gray)',
                fontWeight: filterStatus === 'rejected' ? '600' : '400',
                border: filterStatus === 'rejected' ? 'none' : '1px solid var(--medium-gray)',
                borderRadius: '4px',
                boxShadow: filterStatus === 'rejected' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
              }}
              onClick={() => setFilterStatus('rejected')}
            >
              <i className="bi bi-x-circle me-2"></i>Rejected
            </button>
          </div>
        </div>

        {/* Requests Table */}
        <div className="card border-0 shadow">
          <div className="card-body p-0">
            {filteredBookings.length === 0 ? (
              <div className="p-5 text-center">
                <i className="bi bi-calendar-x text-muted display-4 mb-3"></i>
                <p className="text-muted mb-4">
                  {filterStatus === 'all' 
                    ? 'No bookings found. Create a new booking to get started.' 
                    : `No ${filterStatus} bookings found.`}
                </p>
                <button 
                  className="btn" 
                  style={{ 
                    background: 'var(--primary)', 
                    color: 'var(--white)',
                    padding: '10px 20px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }} 
                  onClick={() => setShowCreateModal(true)}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Create New Booking
                </button>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table mb-0">
                  <thead style={{ background: 'var(--background-light)' }}>
                    <tr>
                      <th scope="col" className="border-0 ps-4 py-3">#</th>
                      <th scope="col" className="border-0 py-3">Title</th>
                      <th scope="col" className="border-0 py-3">Booked By</th>
                      <th scope="col" className="border-0 py-3">Location</th>
                      <th scope="col" className="border-0 py-3">Date & Time</th>
                      <th scope="col" className="border-0 py-3">Status</th>
                      <th scope="col" className="border-0 text-end pe-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking, index) => (
                      <tr key={booking._id || booking.id || index} style={{ 
                        borderLeft: booking.status === 'approved' || booking.isConfirmed ? 
                          '4px solid var(--primary)' : 
                          booking.status === 'rejected' ? 
                            '4px solid var(--primary-light)' : 
                            '4px solid var(--medium-gray)'
                      }}>
                        <th scope="row" className="ps-4 py-3">{index + 1}</th>
                        <td className="fw-medium py-3">{booking.title || booking.name || 'Unnamed Booking'}</td>
                        <td className="py-3">{booking.bookedBy || booking.customer || 'Unknown'}</td>
                        <td className="py-3">{booking.hallname || booking.hall || booking.location || 'N/A'}</td>
                        <td className="py-3">
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
                        <td className="py-3">
                          <span className="badge" style={{
                            background: booking.status === 'rejected' ? 'red' : 
                                      (booking.status === 'approved' || booking.isConfirmed) ? 'green' : 
                                      'var(--medium-gray)',
                            color: 'var(--white)',
                            padding: '6px 12px',
                            fontSize: '0.85rem'
                          }}>
                            {booking.status === 'rejected' ? 'Rejected' : 
                             (booking.status === 'approved' || booking.isConfirmed) ? 'Confirmed' : 'Pending'}
                          </span>
                        </td>
                        <td className="text-end pe-4 py-3">
                          <div className="d-flex justify-content-end gap-2">
                            {/* Show Approve button for pending and rejected bookings */}
                            {(booking.status !== 'approved' && booking.status !== 'confirmed' && !booking.isConfirmed) && (
                              <button 
                                className="btn btn-sm" 
                                style={{ 
                                  background: 'green', 
                                  color: 'var(--white)',
                                  padding: '8px 16px',
                                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                  fontWeight: '500'
                                }}
                                onClick={() => handleStatusUpdate(booking._id || booking.id, 'confirm')}
                                title="Approve booking"
                              >
                                <i className="bi bi-check-circle me-1"></i> Approve
                              </button>
                            )}
                            
                            {/* Show Reject button for pending and approved bookings */}
                            {(booking.status !== 'rejected') && (
                              <button 
                                className="btn btn-sm" 
                                style={{ 
                                  background: '#CD0000', 
                                  color: 'white',
                                  border: '1px solid var(--primary-light)',
                                  padding: '8px 16px',
                                  fontWeight: '500'
                                }}
                                onClick={() => handleStatusUpdate(booking._id || booking.id, 'reject')}
                                title="Reject booking"
                              >
                                <i className="bi bi-x-circle me-1"></i> Reject
                              </button>
                            )}
                          </div>
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
                    <label htmlFor="email" className="form-label">Email</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      id="email" 
                      name="email"
                      value={newBooking.email}
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
                    className="btn" 
                    style={{
                      background: 'transparent',
                      color: 'var(--dark-gray)',
                      border: '1px solid var(--medium-gray)'
                    }}
                    onClick={handleCloseCreateModal}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn" 
                    style={{ 
                      background: 'var(--primary)', 
                      color: 'var(--white)',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
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
    </div>
  );
}

export default BookingDisplay;