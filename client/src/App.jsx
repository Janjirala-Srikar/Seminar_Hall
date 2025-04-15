import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Header from './components/Header/Header';
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from './components/Footer';
import DirectorDashboard from './components/Director/DirectorDashboard';
import SigInComponent from './components/SignIn/SignInComponent';
import ClubInfoCard from './components/Club Registration/ClubInfoCard';
import ClubRegistrationLanding from './components/Club Registration/ClubRegistrationLanding';
import Main from './components/Main/Main';
import BookingCalendar from './components/Calender/BookingCalender';
import ClubRequests from './components/Auth/ClubRequests';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Home route with Header and Footer */}
          <Route 
            path="/" 
            element={
              <>
                <Header />
                <Home />
                <Footer />
              </>
            } 
          />
          
          {/* All other routes without Header and Footer */}
          <Route path="/calendar" element={<BookingCalendar />} />
          <Route path="/signin" element={<SigInComponent />} />
          <Route path="/Home" element={<Main />} />
          <Route path="/director" element={<DirectorDashboard />} />
          <Route path="/club" element={<ClubInfoCard />} />
          <Route path="/clubreg" element={<ClubRegistrationLanding />} />
          <Route path="/clubreq" element={<ClubRequests />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;