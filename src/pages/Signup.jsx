// Signup.js
import React, {useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../pages/Signup.css"; // Import your CSS file
// import { getUserLocation } from "../utility/getLocation"; // Adjust the import path as necessary
import { AuthContext } from "../context/AuthContext"; // Import AuthContext if needed
import gpath from "../utility/globalPath";

const Signup = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPh] = useState("");
    const [countryCode, setCountryCode] = useState("+91");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    // const location = useLocation();
    const [showPassword, setShowPassword] = useState(false);
    // const [locationData, setLocationData] = useState(null); // State to store location data
    const { authcontextlocation } = useContext(AuthContext); // Get user from context if needed

    const southIndiaStates = ["Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana"];

    console.log("Auth Context Location:", authcontextlocation);


    // useEffect(() => {
    //     const fetchLocation = async () => {
    //         try {
    //             const location = await getUserLocation(); // Get the user's location
    //             setLocationData(location); // Set the location data in state

    //         } catch (error) {
    //             console.error("Error fetching location:", error);
    //         }
    //     };
    //     fetchLocation();
    // }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (phone && southIndiaStates.includes(authcontextlocation)) {
                await axios.post(`${gpath}/api/auth/signup-phone`, {
                    username,
                    email,
                    password,
                    phone: `${countryCode}${phone}`,
                    authcontextlocation
                });

                // Pass email to OTP page via state

                navigate("/verify-otp", { state: { email, phone, authcontextlocation } });
            } else {
                await axios.post(`${gpath}/api/auth/signup`, {
                    username,
                    email,
                    password,
                });

                // Pass email to OTP page via state
                localStorage.setItem("signupEmail", email);
                navigate("/verify-otp", { state: { email } });
            }
        } catch (err) {
            setError(`Signup failed. Try again.${err.response ? ` ${err.response.data.message}` : ""}`);
        }
    };

    console.log("Location Data:", authcontextlocation);

    return (
        <div className={`container d-flex justify-content-center align-items-center w-100 flex-column vh-100 pb-5 overflow-hidden`}>
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
                <div className="mb-3 position-relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                        // can add special symbols too
                        pattern="^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$"
                        title="Password must be at least 8 characters long and contain at least one letter and one number."


                    />

                    {/* eye icon */}
                    <i
                        className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} position-absolute`}
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                            top: "50%",
                            right: "15px",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                            color: "#6c757d",
                        }}
                    ></i>
                </div>
                {/* confirm password */}
                <div className="mb-3 position-relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        placeholder="Confirm Password"
                        required
                        minLength={8}
                        title="Password must be at least 8 characters long and contain at least one letter and one number."
                        onChange={(e) => {
                            if (e.target.value !== password) {
                                setError("Passwords do not match.");
                            } else {
                                setError("");
                            }
                        }}
                    />

                    {/* show password */}
                    {/* <i
                        className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} position-absolute`}
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                            top: "50%",
                            right: "15px",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                            color: "#6c757d",
                        }}
                    ></i> */}
                </div>
                {/* phone number */}
                {
                    southIndiaStates.includes(authcontextlocation) &&
                    <div className="mb-3 d-flex justify-content-between align-items-center">
                        {/* select country code */}
                        <select className="form-select ms-0" value={countryCode} onChange={(e) => setCountryCode(e.target.value)} style={{ width: "auto" }}>
                            <option value="+1">🇺🇸 USA (+1)</option>
                            <option value="+91">🇮🇳 India (+91)</option>
                            <option value="+44">🇬🇧 UK (+44)</option>
                            <option value="+61">🇦🇺 Australia (+61)</option>
                            <option value="+81">🇯🇵 Japan (+81)</option>
                            <option value="+49">🇩🇪 Germany (+49)</option>
                            <option value="+33">🇫🇷 France (+33)</option>
                            <option value="+39">🇮🇹 Italy (+39)</option>
                            <option value="+86">🇨🇳 China (+86)</option>
                            <option value="+7">🇷🇺 Russia (+7)</option>
                            <option value="+82">🇰🇷 South Korea (+82)</option>
                            <option value="+971">🇦🇪 UAE (+971)</option>
                            <option value="+92">🇵🇰 Pakistan (+92)</option>
                            <option value="+880">🇧🇩 Bangladesh (+880)</option>
                            <option value="+20">🇪🇬 Egypt (+20)</option>
                            <option value="+34">🇪🇸 Spain (+34)</option>
                            <option value="+46">🇸🇪 Sweden (+46)</option>
                            <option value="+41">🇨🇭 Switzerland (+41)</option>
                            <option value="+48">🇵🇱 Poland (+48)</option>
                            <option value="+32">🇧🇪 Belgium (+32)</option>
                            <option value="+31">🇳🇱 Netherlands (+31)</option>
                            <option value="+966">🇸🇦 Saudi Arabia (+966)</option>
                            <option value="+63">🇵🇭 Philippines (+63)</option>
                            <option value="+55">🇧🇷 Brazil (+55)</option>
                            <option value="+64">🇳🇿 New Zealand (+64)</option>
                            <option value="+351">🇵🇹 Portugal (+351)</option>
                            <option value="+90">🇹🇷 Turkey (+90)</option>
                            <option value="+234">🇳🇬 Nigeria (+234)</option>
                            <option value="+27">🇿🇦 South Africa (+27)</option>
                        </select>

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Phone Number"
                            required
                            value={phone}
                            onChange={(e) => {
                                const value = e.target.value;
                                // allow only numbers and length of 10
                                if (/^\d*$/.test(value) && value.length <= 10) {
                                    setPh(value);
                                    setError("");
                                } else {
                                    setError("Phone number must be 10 digits.");
                                }
                            }}
                            // pattern 10 digits and all numbers can't be same and user unable to input more than 10
                            pattern="^[0-9]{10}$"
                            maxLength={10}
                            title="Phone number must be 10 digits."
                        />
                    </div>
                }
                <button className="btn btn-primary w-100" type="submit">
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
