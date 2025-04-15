import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { auth } from '../firebase/config'; // Import auth from our shared config
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from "firebase/auth";
import emailjs from '@emailjs/browser';

function ClubRequests() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  // Initialize EmailJS with public key
  useEffect(() => {
    // Update process.env to import.meta.env for Vite
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
        
        // Check if response has a data property that is an array
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
      
      return data.data; // Return the created user data
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
          // If user already exists in Firebase, we don't want to proceed
          setProcessingId(null);
          alert(`Email ${email} is already registered. Please use a different email address.`);
          return; // Exit the function early
        }
      } catch (error) {
        console.log("Error checking email existence:", error);
        throw error; // Propagate the error
      }
      
      // 3. Generate a random password (only if we passed the previous step)
      const password = generateRandomPassword(12);
      console.log(password);
      
      // 4. Create Firebase user (we know it doesn't exist)
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("Created Firebase user:", userCredential.user.uid);
        firebaseUid = userCredential.user.uid;
      } catch (err) {
        console.error("Error creating Firebase user:", err);
        
        // If the error is about email already in use, show a specific message
        if (err.code === 'auth/email-already-in-use') {
          setProcessingId(null);
          alert(`Email ${email} is already registered. Please use a different email address.`);
          return; // Exit the function early
        } 
        
        // For any other error, just throw it to be caught by the outer catch block
        throw err;
      }
      
      // 5. Create user in backend database
      const userData = {
        email: clubData.contactEmail,
        clubName: clubData.clubName,
        phoneNumber: clubData.contactPhone || "", // Add fallback if phone might be missing
        clubCategory: clubData.clubCategory,
        firebaseUid: firebaseUid,
        role: "club_admin", // Assuming club admins have this role
        status: "active"
      };
      
      // Create the user in the backend
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
      
      // Using the updated EmailJS send method
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
        // Refresh the clubs list after approval
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
    return <div className="container mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="container mt-5 text-danger">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Pending Club Requests</h2>
      <div className="row">
        {clubs.length === 0 ? (
          <p>No pending requests.</p>
        ) : (
          clubs.map((club, index) => (
            <div className="col-md-4 mb-4" key={club._id || index}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">{club.clubName}</h5>
                  <p className="card-text"><strong>Email:</strong> {club.contactEmail}</p>
                  <p className="card-text"><strong>Category:</strong> {club.clubCategory}</p>
                  <p className="card-text">
                    <strong>Status:</strong> 
                    <span className={club.status ? "text-success" : "text-warning"}>
                      {club.status ? " Approved" : " Pending"}
                    </span>
                  </p>
                  {!club.status && (
                    <button 
                      className="btn btn-primary mt-2"
                      onClick={() => handleApprove(club._id, club.contactEmail, club.clubName)}
                      disabled={processingId === club._id}
                    >
                      {processingId === club._id ? 'Processing...' : 'Approve Club'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ClubRequests;