import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";

const UserProfile = () => {
    const { user } = useContext(AuthContext);
    const [downloads, setDownloads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDownloads = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/user/downloads?userId=${user.userId}`);
                setDownloads(res.data);
            } catch (err) {
                console.error("Error fetching downloads:", err);
            } finally {
                setLoading(false);
            }
        };

        if (user && user.userId) {
            fetchDownloads();
        }
    }, [user]);

    if (!user) return <div>Loading...</div>;

    return (
        <div className="container mt-4 vh-100 d-flex justify-content-center align-items-center w-100 flex-column">
            <h2 className="mb-4 text-center pt-4">User Profile</h2>
            <h2>Welcome, {user.username}!</h2>
            <p>Email: {user.email}</p>

            <hr />
            <h4>Downloaded Videos</h4>

            {loading ? (
                <p>Loading your downloads...</p>
            ) : downloads.length === 0 ? (
                <p>No videos downloaded yet.</p>
            ) : (
                <div className="row">
                    {downloads.map(video => (
                        <div key={video._id} className="col-md-6 mb-4">
                            <div className="card shadow-sm border-0 relative" style={{
                                height: "250px",
                                width: "300px",
                                borderRadius: 10
                            }}>
                                <img
                                    src={`http://localhost:5000${video.thumbnail}`}
                                    height={"100%"}
                                    className="card-img-top"
                                    alt={video.title}
                                />
                                <div className="card-body mt-4">
                                    <h5 className="card-title text-white">{video.title}</h5>
                                    <p className="card-text text-truncate text-white">{video.description}</p>
                                    <Link to={`/video/${video._id}`} className="btn btn-primary w-100">Watch</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserProfile;
