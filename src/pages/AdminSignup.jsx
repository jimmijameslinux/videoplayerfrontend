import React, { useState } from 'react';
import axios from 'axios';
import gpath from '../utility/globalPath';
import { Link } from 'react-router-dom';

const AdminSignup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [msg, setMsg] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        setIsSuccess(false);

        if (password !== confirm) {
            setMsg("Passwords don't match");
            return;
        }

        setMsg('Creating account...');

        try {
            await axios.post(`${gpath}/api/auth/adminsignup`, {
                email: email.trim(),
                password: password.trim(),
            });

            setMsg('Signup successful! You can now login.');
            setIsSuccess(true);
        } catch (error) {
            if (error.response && error.response.data.message) {
                setMsg(error.response.data.message);
            } else {
                setMsg('Signup failed. Try again.');
            }
            setIsSuccess(false);
        }
    };

    return (
        <div className="container pt-5 vh-100" style={{ maxWidth: 400 }}>
            {msg && (
                <div className={`alert text-center ${isSuccess ? 'alert-success' : 'alert-danger'}`}>
                    {msg}
                </div>
            )}
            <h3 className="text-center mb-4">Admin Signup</h3>
            <form onSubmit={handleSignup}>
                <input
                    type="email"
                    className="form-control mb-3"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    className="form-control mb-3"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    className="form-control mb-3"
                    placeholder="Confirm Password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                />
                <button className="btn btn-success w-100" type="submit">
                    Sign Up
                </button>
                <div className="text-center mt-3">
                    <p>Already have an account? 
                            
                            <Link to="/adminlogin">Login</Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default AdminSignup;
