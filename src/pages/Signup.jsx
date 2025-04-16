// Signup.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../pages/Signup.css"; // Import your CSS file

const Signup = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/signup", {
                username,
                email,
                password,
            });

            // Pass email to OTP page via state
            localStorage.setItem("signupEmail", email);
            navigate("/verify-otp", { state: { email } });
        } catch (err) {
            setError(`Signup failed. Try again.${err.response ? ` ${err.response.data.message}` : ""}`);
        }
    };

    // password regex
    // const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    // // Check if password is valid
    // const isPasswordValid = passwordRegex.test(password);

    return (
        <div className="container mt-4 vh-100 d-flex justify-content-center align-items-center w-100 flex-column">
            <h2>Signup</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit} className="w-50">
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                        pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
                        title="Password must be at least 8 characters long and contain at least one letter and one number."
                    />
                </div>
                <button className="btn btn-success" type="submit">
                    Signup
                </button>
                <div className="mt-3 text-center">
                    <p>Already have an account? <a href="/login">Login</a></p>
                </div>
            </form>
        </div>
    );
};

export default Signup;
