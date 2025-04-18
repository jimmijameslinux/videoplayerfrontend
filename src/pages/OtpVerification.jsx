import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const OtpVerification = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    // const [success, setSuccess] = useState("");
    const [resendStatus, setResendStatus] = useState("");
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
    const [isExpired, setIsExpired] = useState(false);
    const email = location.state?.email || localStorage.getItem("signupEmail") || "";


    useEffect(() => {
        if (!email) {
            navigate("/signup");
        }
        // Start the countdown
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    setIsExpired(true);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000); // Update every second

        return () => clearInterval(timer); // Cleanup on component unmount
    }, [email, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/auth/verify-otp", { email, otp });
            localStorage.removeItem("signupEmail");
            navigate("/login");
        } catch (err) {
            setError("Invalid OTP. Please try again.");
        }
    };

    const handleResend = async () => {
        try {
            const response = await axios.post("http://localhost:5000/api/auth/resend-otp", { email });
            setResendStatus("OTP resent to your email.");
            setError("");
        } catch (err) {
            setError("Failed to resend OTP.");
            setResendStatus("");
        }
    };

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    return (
        <div className="container mt-4 vh-100 d-flex justify-content-center align-items-center w-100 flex-column">
            <h2>Verify OTP</h2>
            {/* display countdown */}
            <div className="alert alert-info mb-3">
                <p>Time remaining: {formatTime(timeLeft)}</p>
                {isExpired && <p className="text-danger">OTP has expired. Please request a new one.</p>}
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            {resendStatus && <div className="alert alert-success">{resendStatus}</div>}
            <form onSubmit={handleSubmit} className="w-50">
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        disabled={isExpired} // Disable input if OTP is expired
                    />
                </div>
                <div className="mb-3 d-flex align-items-center justify-content-center">
                <button className="btn btn-primary" type="submit">
                    Verify
                </button>
                <button
                    type="button"
                    className="btn ms-3"
                    onClick={handleResend}
                >
                    Resend OTP
                </button>
                </div>
            </form>
        </div>
    );
};

export default OtpVerification;
