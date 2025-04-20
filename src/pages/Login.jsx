import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import gpath from "../utility/globalPath";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    // const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${gpath}/api/auth/login`, { email, password });
            // const userWithId = {
            //     ...response.data.user,
            //     userId: response.data.user._id,
            // };
            login(response.data.user);
            console.log("User logged in:", response.data.user);
            // login(userWithId);
            // localStorage.setItem("user", JSON.stringify(userWithId));
            navigate("/");
        } catch (err) {
            setError("Invalid email or password");
        }
    };

    return (
        <div className={`container d-flex justify-content-center align-items-center w-100 flex-column vh-100 pb-5 overflow-hidden`}>
            <h2>Login</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit} className="w-50">
                <div className="mb-3">
                    <input type="email" className="form-control" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <input type="password" className="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button className="btn btn-primary w-100" type="submit">Login</button>
                <div className="mt-3 text-center">
                    <p>Don't have an account? 
                        <Link to="/signup">Sign Up</Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default Login;
