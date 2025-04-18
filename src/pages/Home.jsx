import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css"; // Import your custom CSS file for styling

// user context
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

const Home = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const { user } = useContext(AuthContext);
    const [sortOption, setSortOption] = useState("title-asc");


    useEffect(() => {
        axios.get("http://localhost:5000/api/videos")
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

    const filteredVideos = videos
        .filter(video =>
            video.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            switch (sortOption) {
                case "title-asc":
                    return a.title.localeCompare(b.title);
                case "title-desc":
                    return b.title.localeCompare(a.title);
                case "createdAt-asc":
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case "createdAt-desc":
                    return new Date(b.createdAt) - new Date(a.createdAt);
                default:
                    return 0;
            }
        });




    // Extract all downloaded video IDs
    let downloadedVideoIds = user?.downloadHistory?.map(item => item.videoId) || [];
    // Filter videos that match any downloaded video ID
    // let filtervideo = videos.filter(video => downloadedVideoIds.includes(video._id));

    // console.log("filter match videos", filtervideo);


    return (
        <div className="container">
            <h2 className="mb-4 text-center pt-4">🎬 NullClass Video Library</h2>

            <div className="mb-4 d-flex">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search videos by title..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
                <select
                    className="form-select w-25 ms-3"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                >
                    <option value="title-asc">Title (A-Z)</option>
                    <option value="title-desc">Title (Z-A)</option>
                    <option value="createdAt-asc">Date Created (Oldest)</option>
                    <option value="createdAt-desc">Date Created (Newest)</option>
                </select>
            </div>

            <div className="mb-4 d-flex justify-content-between align-items-center">
                {/* <input
                    type="text"
                    className="form-control w-50"
                    placeholder="Search videos by title..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                /> */}

                
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
                    {filteredVideos.map(video => {
                        const isDownloaded = downloadedVideoIds.includes(video._id);

                        return (
                            <div key={video._id} className="d-flex justify-content-center align-items-center col-md-4 mb-4">
                                <div
                                    className={`card shadow-sm border-0 relative ${isDownloaded ? 'downloaded-card' : ''}`}
                                    style={{
                                        // height: "250px",
                                        borderRadius: 10,
                                        border: isDownloaded ? "2px solid #00ffcc" : "none", // custom border color for downloaded
                                        backgroundColor: isDownloaded ? "#1a1a2e" : "#212529"  // or change bg color
                                    }}
                                >
                                    <img src={`http://localhost:5000${video.thumbnail}`} height={"100%"} className="card-img-top" alt={video.title} />
                                    <div className="card-body mt-4">
                                        <h5 className="card-title text-white">{video.title}</h5>
                                        <p className="card-text text-truncate text-white">{video.description}</p>
                                        <Link to={`/video/${video._id}`} className="btn btn-primary w-100">Watch</Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

            )}
        </div>
    );
};

export default Home;
