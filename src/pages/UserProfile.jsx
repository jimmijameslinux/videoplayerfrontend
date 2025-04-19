import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";

const UserProfile = () => {
    const { user } = useContext(AuthContext);
    const { login } = useContext(AuthContext);
    const [downloads, setDownloads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dataloaded, setDataloaded] = useState(false);
    // console.log(user.userId)
    useEffect(() => {
        const fetchDownloads = async () => {
            console.log("Fetching downloads for user:", user._id);
            try {
                const res = await axios.get(`http://localhost:5000/api/user/downloads?userId=${user._id}`);
                setDownloads(res.data);
                setDataloaded(true);
                console.log("Downloads fetched:", res.data);
            } catch (err) {
                console.error("Error fetching downloads:", err);
            } finally {
                setLoading(false);
            }
        };

        console.log("User object:", user);

        if (user && user._id) {
            fetchDownloads();
        }
    }, [user]);

    if (!user) return <div>Loading...</div>;

    const handleDelete = async (videoId) => {
        try {
            console.log("Deleting video with ID:", videoId);
            console.log("User id", user._id);
            const userId = user._id;
            const res = await axios.delete(`http://localhost:5000/api/user/downloads/${userId}/${videoId}`, {
                // userId: user._id,
            });
            console.log(res)
            console.log("Delete response:", res.data);
            alert("Video deleted successfully!");
            login(res.data.user);
            setDownloads(downloads.filter(video => video._id !== videoId));
        } catch (err) {
            console.error("Error deleting video:", err);
        }
    }

    const handleEndPlan = async () => {
        try {
            const res = await axios.patch("http://localhost:5000/api/user/end_plan", {
                userId: user._id,
                newPlan: "Free",
            });
            console.log("Plan ended successfully:", res.data);
            alert("Plan ended successfully!");
            login(res.data.user);
            // setDownloads(downloads.filter(video => video._id !== videoId));
        } catch (err) {
            console.error("Error ending plan:", err);
        }
    }

    return (
        <div className={`container mt-4 d-flex justify-content-center align-items-center flex-column ${dataloaded ? "" : "vh-100"}`}>
            <h2 className="mb-4 text-center pt-4">User Profile</h2>
            <h2>Welcome, {user.username}!</h2>
            <p>Email: {user.email}</p>
            <p>Account Created: {new Date(user.createdAt).toLocaleDateString()}</p>
            <p>Plan: {user.plan}</p>
            {/* user button end plan */}
            {
                user.plan !== "Free" &&
                <button className="btn btn-danger mt-4" onClick={handleEndPlan}>End Plan</button>
            }
            <hr />
            <h4>Downloaded Videos</h4>

            {loading ? (
                <p>Loading your downloads...</p>
            ) : downloads.length === 0 ? (
                <p>No videos downloaded yet.</p>
            ) : (
                <div className="row">
                    {downloads.map(video => (
                        <>
                            <div key={video._id} className="d-flex justify-content-center align-items-center col-md-4 mb-4">
                                <div className="" style={{
                                    borderRadius: 10
                                }}>
                                    <img
                                        src={`http://localhost:5000${video.thumbnail}`}
                                        // height={"100%"}
                                        className="card-img-top"
                                        alt={video.title}
                                    />
                                    <div className="mt-4">
                                        <h5 className="text-white">{video.title}</h5>
                                        <p className="text-white">{video.description}</p>
                                        <Link to={`/video/${video._id}`} className="btn btn-primary w-100">Watch</Link>
                                        <button onClick={() => handleDelete(video._id)} className="btn btn-danger w-100 mt-2">Delete</button>
                                    </div>
                                </div>
                            </div>
                            {/* // delete video */}
                        </>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserProfile;
