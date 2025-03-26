import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Header from './components/Header/Header';
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from './components/Footer';
import Calender from './components/Calender/Calender';
import DirectorDashboard from './components/Director/DirectorDashboard';
import SigInComponent from './components/SignIn/SignInComponent';
import ClubInfoCard from './components/clubinfocard';
import ClubRegistrationLanding from './components/ClubRegistrationLanding';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calendar" element={<Calender />} />
          <Route path="/signin" element={<SigInComponent />} />
          <Route path="/signup" element={<SigInComponent />} />
          <Route path="/director" element={<DirectorDashboard />} />
          <Route path="/club" element={<ClubInfoCard />} />
          <Route path="/clubreg" element={<ClubRegistrationLanding />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;