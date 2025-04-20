import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VideoPlayer from './components/VideoPlayer/VideoPlayer';
import VideoPlans from './pages/VideoPlans';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import React, { useState, useEffect, useContext} from 'react';
// import axios from 'axios';
import Navbar from './components/Navbar/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import OtpVerification from './pages/OtpVerification';
import UserProfile from './pages/UserProfile';
import AdminLogin from './pages/AdminLogin';
import AdminSignup from './pages/AdminSignup';
import Payment from './pages/Payment';
import {getUserLocation} from "./utility/getLocation"; // Adjust the import path as necessary
import { AuthContext } from './context/AuthContext'; // Import AuthContext if needed
import "bootstrap-icons/font/bootstrap-icons.css";



function App() {
  const [plan, setPlan] = useState("Free"); // Default plan is Free
  const [theme, setTheme] = useState("dark"); // Default theme is light
  const [loading, setLoading] = useState(true); // <-- new loading state
  const { setUserLocation } = useContext(AuthContext); // Set user location from context

  // setTheme("light");

 console.log(plan)
  useEffect(() => {
    const checkTimeAndLocation = async () => {
      const currentHour = new Date().getHours();
      try {
        const location = await getUserLocation(); // Get the user's location
        setUserLocation(location); //
        const southIndiaStates = ["Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana"];
        console.log("Current Hour:", currentHour);
        console.log("User State:", location);

        if ((currentHour >= 10 && currentHour < 12) && southIndiaStates.includes(location)) {
          setTheme("light");
        } else {
          setTheme("dark");
        }
        setLoading(false); // Set loading to false after fetching location
      } catch (error) {
        console.error("Error fetching location:", error);
        setTheme("dark"); // Default to dark theme in case of an error
      }
    };
    checkTimeAndLocation();
  }, []);

  // Function to handle the selection of a plan
  const onPlanSelect = (selectedPlan) => {
    setPlan(selectedPlan); // Update the plan state
    console.log("Selected Plan:", selectedPlan);
  };

  const [disablepricing, setDisablepricing] = useState(false);

  if (loading) {
    return (
      <div className="d-flex flex-column vh-100 justify-content-center align-items-center bg-dark text-white">
        <h2>Loading your experience...</h2>
        <div className="spinner-border text-light ms-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${theme === "light" ? "light-theme" : "dark-theme"} container-fluid w-100`}>
    {/* <div className={`text-white ${isDarkMode ? 'bg-dark' : 'bg-light'}`}> */}
      {/* <AuthProvider> */}
        <Router>
          <Navbar disablepricing={disablepricing} theme={theme} setTheme={setTheme} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/video/:id" element={<VideoPlayer setDisablepricing={setDisablepricing} />} />
            <Route path="/plans" element={<VideoPlans onPlanSelect={onPlanSelect} />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-otp" element={<OtpVerification/>} />
            {/* admin login and signup */}
            <Route path="/adminlogin" element={<AdminLogin />} />
            <Route path="/adminsignup" element={<AdminSignup />} />
            {/* invalid route */}
            <Route path="*" element={<div className="container mt-4 vh-100">
              <h1>404 Not Found</h1>
              <p>The page you are looking for does not exist.</p>
            </div>} />
            {/* Uncomment the below line when Profile component is ready */}
             <Route path="/profile" element={<UserProfile />} />
          </Routes>
        </Router>
      {/* </AuthProvider> */}
    </div>
  );
}

export default App;
