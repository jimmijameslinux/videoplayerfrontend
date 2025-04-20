import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
// import { getUserLocation } from "../utility/getLocation"; // Adjust the import path as necessary
import gpath from "../utility/globalPath";

const OtpVerification = () => {
    const location = useLocation();
    const navigate = useNavigate();
    // const [otp, setOtp] = useState("");
    const [otpDigits, setOtpDigits] = useState(Array(6).fill(""));
    const [error, setError] = useState("");
    // const [success, setSuccess] = useState("");
    const [resendStatus, setResendStatus] = useState("");
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
    const [isExpired, setIsExpired] = useState(false);

    const inputRefs = useRef([]);
    const email = location.state?.email || localStorage.getItem("signupEmail") || "";
    const phone = location.state?.phone || localStorage.getItem("signupPhone") || "";
    // const locationData = location.state?.locationData || localStorage.getItem("signupLocation") || "";

    // console.log(phone)

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

    //////////
    const handleChange = (e, index) => {
        const value = e.target.value;
        if (!isNaN(value) && value.length <= 1) {
            const newOtpDigits = [...otpDigits];
            newOtpDigits[index] = value;
            setOtpDigits(newOtpDigits);

            if (value !== "" && index < 5) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && otpDigits[index] === "" && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("Text").slice(0, 6);
        if (/^\d{6}$/.test(pastedData)) {
            const newOtpDigits = pastedData.split("");
            setOtpDigits(newOtpDigits);
            inputRefs.current[5].focus();
        }
    };

    /////////

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otp = otpDigits.join("");
        if (otp.length !== 6) {
            setError("Please enter a 6-digit OTP.");
            return;
        }
        console.log("Phone:", phone);
        try {
            if (phone) {
                console.log("Phone and location data provided:", phone, otp);
                await axios.post(`${gpath}/api/auth/verify-otp-phone`, { phone, otp });
            } else {
                await axios.post(`${gpath}/api/auth/verify-otp`, { email, otp });
            }
            localStorage.removeItem("signupEmail");
            navigate("/login");
        } catch (err) {
            setError("Invalid OTP. Please try again.");
        }
    };

    const handleResend = async () => {
        try {
            await axios.post(`${gpath}/api/auth/resend-otp`, { email });
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
            <h2 className="mb-4">OTP Verification</h2>
            {/* display countdown */}
            <div className="alert alert-info text-center max-w-400">
                <p>Time remaining: {formatTime(timeLeft)}</p>
                {isExpired && <p className="text-danger mb-0">OTP has expired. Please resend.</p>}
            </div>
            {error && <div className="alert alert-danger max-w-400">{error}</div>}
            {resendStatus && <div className="alert alert-success max-w-400">{resendStatus}</div>}
            
            <form onSubmit={handleSubmit} className="max-w-400 text-center" onPaste={handlePaste}>
                <div className="d-flex justify-content-between mb-3">
                    {otpDigits.map((digit, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            ref={(el) => (inputRefs.current[index] = el)}
                            disabled={isExpired}
                            className="form-control text-center mx-1"
                            style={{ width: "45px", height: "55px", fontSize: "24px" }}
                        />
                    ))}
                </div>
                <div className="d-flex justify-content-center">
                    <button className="btn btn-primary" type="submit" disabled={isExpired}>
                        Verify
                    </button>
                    <button
                        type="button"
                        className="btn btn-link ms-3"
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
