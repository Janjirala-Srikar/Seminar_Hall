import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { auth } from '../firebase/config';
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from "firebase/auth";
import emailjs from '@emailjs/browser';
import './ClubRequests.css'; // Make sure to use the updated CSS file

function ClubRequests() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  // Initialize EmailJS with public key
  useEffect(() => {
    emailjs.init({
      publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
    });
  }, []);

  const fetchClubs = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/clubs/clubs-req')
      .then(res => res.json())
      .then(response => {
        console.log("Fetched clubs data:", response);
        
        if (response && response.data && Array.isArray(response.data)) {
          setClubs(response.data);
        } else {
          setError("Received data is not in the expected format");
          setClubs([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching club requests:', err);
        setError("Failed to fetch club requests");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchClubs();
  }, []);
  
  // Generate a random password
  const generateRandomPassword = (length) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  // Create user in backend database
  const createUserInBackend = async (userData) => {
    try {
      const response = await fetch('http://localhost:5000/api/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || "Failed to create user in backend");
      }
      
      return data.data;
    } catch (err) {
      console.error("Error creating user in backend:", err);
      throw err;
    }
  };
  
  const handleApprove = async (id, email, clubName) => {
    try {
      setProcessingId(id);
      
      // 1. Find the complete club data from clubs array
      const clubData = clubs.find(club => club._id === id);
      if (!clubData) {
        throw new Error("Club data not found");
      }
      
      // 2. Check if email already exists in Firebase
      let userExists = false;
      let firebaseUid = null;
      
      try {
        const methods = await fetchSignInMethodsForEmail(auth, email);
        userExists = methods && methods.length > 0;
        
        if (userExists) {
          setProcessingId(null);
          alert(`Email ${email} is already registered. Please use a different email address.`);
          return;
        }
      } catch (error) {
        console.log("Error checking email existence:", error);
        throw error;
      }
      
      // 3. Generate a random password
      const password = generateRandomPassword(12);
      console.log(password);
      
      // 4. Create Firebase user
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("Created Firebase user:", userCredential.user.uid);
        firebaseUid = userCredential.user.uid;
      } catch (err) {
        console.error("Error creating Firebase user:", err);
        
        if (err.code === 'auth/email-already-in-use') {
          setProcessingId(null);
          alert(`Email ${email} is already registered. Please use a different email address.`);
          return;
        } 
        
        throw err;
      }
      
      // 5. Create user in backend database
      const userData = {
        email: clubData.contactEmail,
        clubName: clubData.clubName,
        phoneNumber: clubData.contactPhone || "",
        clubCategory: clubData.clubCategory,
        firebaseUid: firebaseUid,
        role: "club_admin",
        status: "active"
      };
      
      await createUserInBackend(userData);
      console.log("Created user in backend database");
      
      // 6. Send email with credentials
      const emailParams = {
        to_email: email,
        subject: "Your Club Account Has Been Approved",
        club_name: clubName,
        club_email: email,
        club_password: password,
        message: "Your club has been approved. You can now log in with the credentials below."
      };
      
      const emailResult = await emailjs.send(
        "service_hozkmh8",
        "template_r75f2dc",
        emailParams,
        "cDxpGfoDN7I6s16zA"
      );
      console.log("Email sent:", emailResult);
      
      // 7. Update club status in your database
      const response = await fetch(`http://localhost:5000/api/clubs/approve/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log("Club approved successfully:", data.data);
        fetchClubs();
        alert(`Club "${clubName}" approved successfully! Credentials sent to ${email}`);
      } else {
        setError(data.message || "Failed to approve club");
        alert("Failed to update club status in database");
      }
    } catch (err) {
      console.error('Error in approval process:', err);
      setError("Failed to approve club: " + err.message);
      alert("Error: " + err.message);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return <div className="container mt-5 text-center"><div className="spinner-border text-primary" role="status"></div></div>;
  }

  if (error) {
    return <div className="container mt-5 alert alert-danger">{error}</div>;
  }

  return (
    <div className="club-requests-container container mt-5">
      <h2 className="mb-4 section-title">Pending Club Requests</h2>
      
      {clubs.length === 0 ? (
        <div className="alert alert-info">No pending requests.</div>
      ) : (
        <div className="row g-4"> {/* Using g-4 for equal gutters */}
          {clubs.map((club, index) => (
            <div className="col-md-4" key={club._id || index}>
              <div className={`club-card card ${club.status ? 'approved-card' : 'pending-card'}`}>
                <div className="card-body">
                  <h5 className="card-title club-name">{club.clubName}</h5>
                  
                  <div className="club-details">
                    <div className="info-row">
                      <span className="info-label">Email:</span>
                      <span className="info-value">{club.contactEmail}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Category:</span>
                      <span className="info-value">{club.clubCategory}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Status:</span>
                      <span className={`status-badge ${club.status ? "approved-badge" : "pending-badge"}`}>
                        {club.status ? "Approved" : "Pending"}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Fixed action area at the bottom - always takes same space whether visible or not */}
                <div className="card-footer">
                  {!club.status ? (
                    <button 
                      className="btn btn-primary w-100"
                      onClick={() => handleApprove(club._id, club.contactEmail, club.clubName)}
                      disabled={processingId === club._id}
                    >
                      {processingId === club._id ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Processing...
                        </>
                      ) : 'Approve Club'}
                    </button>
                  ) : (
                    <div className="approved-placeholder"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ClubRequests;