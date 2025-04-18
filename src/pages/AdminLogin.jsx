import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setMsg('');
        setIsSuccess(false);

        try {
            const res = await axios.post('http://localhost:5000/api/auth/adminlogin', {
                email: email.trim(),
                password: password.trim(),
            });

            localStorage.setItem('token', res.data.token);
            setMsg('Login successful!');
            setIsSuccess(true);

            setTimeout(() => navigate('/admin'), 1000);
        } catch (error) {
            if (error.response && error.response.data.message) {
                setMsg(error.response.data.message);
            } else {
                setMsg("Server error. Try again later.");
            }
            setIsSuccess(false);
        }
    };

    return (
        <div className="container mt-5 vh-100" style={{ maxWidth: 400 }}>
            {msg && (
                <div className={`alert text-center ${isSuccess ? 'alert-success' : 'alert-danger'}`}>
                    {msg}
                </div>
            )}
            <h3 className="text-center mb-4">Admin Login</h3>
            <form onSubmit={handleLogin}>
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
                <button className="btn btn-primary w-100" type="submit">
                    Login
                </button>
                <div className="text-center mt-3">
                    <p>Don't have an account? <a href="/adminsignup">Sign Up</a></p>
                </div>
            </form>
        </div>
    );
};

export default AdminLogin;
