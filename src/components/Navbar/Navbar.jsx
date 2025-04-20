import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
// import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useNavigate,useLocation } from "react-router-dom";

const Navbar = ({ disablepricing, theme,setTheme }) => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation(); // Get the current location
    
    const handleLogout = () => {
        logout();               // Clear user from context/localStorage
        navigate("/login");     // Redirect to login page
    };

    // console.log("Navbar user:", user.plan);

   

    return (
        <>
            {/* Regular Navbar - visible on md and larger */}
            <nav className={`navbar navbar-expand-md ${theme === "light" ? "light-theme" : "navbar-dark"}  ${location.pathname.includes("/admin") ? "d-none" : "d-md-flex"}`}>
                <div className="container">
                    <Link className="navbar-brand navbar-collapse collapse" to="/">NullClass Video Library</Link>
                    <div className="collapse navbar-collapse justify-content-end">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">Home</Link>
                            </li>
                            {((!user) || (user?.plan === "Free")) && (
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
                                        <button className={`btn ms-2 ${theme==="light"?"btn-outline-dark":"btn-outline-light"}`} onClick={handleLogout}>Logout</button>
                                    </li>
                                </>
                            )}
                            {/* adminlogin */}
                                <li className="nav-item">
                                    <Link className="nav-link" to="/adminlogin">Admin</Link>
                                </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Offcanvas Navbar - visible only on small devices */}
            <nav className={`navbar ${theme === "light" ? "light-theme" : "navbar-dark"} d-flex d-md-none`}>
                <div className="container-fluid">
                    <button
                        className={`btn text-dark me-2 ${theme==="light"?"btn-outline-light":"btn-outline-dark"} `}
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
                className={`offcanvas offcanvas-start ${theme==="light"?"bg-light":"bg-dark text-white"} d-md-none`}
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
                        {user?.plan!=="Free" && !user?(
                                <li className="nav-item">
                                    <Link className="nav-link" to="/plans">Pricing</Link>
                                </li>
                            ):""}
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
                                    <button className={`btn ${theme==="light"?"btn-outline-dark":"btn-outline-light"} mt-2`} onClick={logout}>Logout</button>
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
