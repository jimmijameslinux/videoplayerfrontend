import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
// import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useNavigate } from "react-router-dom";

const Navbar = ({ disablepricing, theme,setTheme }) => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const handleLogout = () => {
        logout();               // Clear user from context/localStorage
        navigate("/login");     // Redirect to login page
    };

   

    return (
        <>
            {/* Regular Navbar - visible on md and larger */}
            <nav className={`navbar navbar-expand-md ${theme === "light" ? "" : "navbar-dark"} d-none d-md-flex`}>
                <div className="container">
                    <Link className="navbar-brand" to="/">NullClass Video Library</Link>
                    <div className="collapse navbar-collapse justify-content-end">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">Home</Link>
                            </li>
                            {!disablepricing && (
                                <li className="nav-item">
                                    <Link className="nav-link" to="/plans">Pricing</Link>
                                </li>
                            )}
                            {!user ? (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/login">Login</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/signup">Signup</Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/profile">{user.username}</Link>
                                    </li>
                                    <li className="nav-item">
                                        <button className="btn btn-outline-light ms-2" onClick={handleLogout}>Logout</button>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Offcanvas Navbar - visible only on small devices */}
            <nav className={`navbar ${theme === "light" ? "" : "navbar-dark"} d-flex d-md-none`}>
                <div className="container-fluid">
                    <button
                        className="btn text-dark me-2 btn-outline-light"
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasNavbar"
                        aria-controls="offcanvasNavbar"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <Link className="navbar-brand ms-2" to="/">NullClass</Link>
                </div>
            </nav>

            <div
                className="offcanvas offcanvas-start bg-dark text-white d-md-none"
                tabIndex="-1"
                id="offcanvasNavbar"
                aria-labelledby="offcanvasNavbarLabel"
            >
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasNavbarLabel">Menu</h5>
                    <button
                        type="button"
                        className="btn-close btn-close-white"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                    ></button>
                </div>
                <div className="offcanvas-body">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        {!disablepricing && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/plans">Pricing</Link>
                            </li>
                        )}
                        {!user ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/signup">Signup</Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/profile">{user.username}</Link>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-outline-light mt-2" onClick={logout}>Logout</button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default Navbar;
