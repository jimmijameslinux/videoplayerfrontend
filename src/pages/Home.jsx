import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Home = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        axios.get("http://localhost:5000/videos")
            .then(response => {
                console.log("Videos fetched:", response.data);
                setVideos(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching videos:", error);
                setLoading(false);
            });
    }, []);

    const filteredVideos = videos.filter(video =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container vh-100">
            <h2 className="mb-4 text-center pt-4">🎬 NullClass Video Library</h2>

            <div className="mb-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search videos by title..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : filteredVideos.length === 0 ? (
                <p className="text-center">No videos found for your search.</p>
            ) : (
                <div className="row">
                    {filteredVideos.map(video => (
                        <div key={video._id} className="d-flex justify-content-center align-items-center col-md-4 mb-4">
                            <div className="card shadow-sm border-0 relative" style={{
                                height: "250px",
                                // width: "300px",
                                borderRadius: 10
                            }}>
                                <img src={`http://localhost:5000${video.thumbnail}`} height={"100%"} className="card-img-top" alt={video.title} />
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

export default Home;
