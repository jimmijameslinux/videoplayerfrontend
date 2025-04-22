import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import gpath from '../utility/globalPath';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();
    
    const { loginAdmin } = useContext(AuthContext);
    const handleLogin = async (e) => {
        e.preventDefault();
        setMsg('');
        setIsSuccess(false);

        try {
            const res = await axios.post(`${gpath}/api/auth/adminlogin`, {
                email: email.trim(),
                password: password.trim(),
            });

            localStorage.setItem('token', res.data.token);
            loginAdmin(res.data.admin); // Store admin data in context
            console.log(res.data.admin)
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
        <div className="container pt-5 min-dvh-100" style={{ maxWidth: 400 }}>
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
                    <p>Don't have an account? 
                        <Link to="/adminsignup">Sign Up</Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default AdminLogin;
