import React, { useState, useContext, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
// import {getUserLocation} from "../../utility/getLocation"; // Adjust the import path as necessary
import gpath from "../../utility/globalPath"; // Adjust the import path

const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'Hindi' },
    { code: 'ml', label: 'Malayalam' },
    { code: 'ta', label: 'Tamil' },
    { code: 'fr', label: 'French' },
    { code: 'de', label: 'German' },
    { code: 'es', label: 'Spanish' },
    { code: 'it', label: 'Italian' },
    { code: 'ja', label: 'Japanese' },
    { code: 'ko', label: 'Korean' },
    { code: 'ru', label: 'Russian' },
    { code: 'zh', label: 'Chinese' },
    { code: 'ar', label: 'Arabic' },
    { code: 'pt', label: 'Portuguese' },
    { code: 'bn', label: 'Bengali' },
    { code: 'te', label: 'Telugu' },
    { code: 'mr', label: 'Marathi' },
    { code: 'gu', label: 'Gujarati' },
    { code: 'ur', label: 'Urdu' },
    { code: 'pa', label: 'Punjabi' },
    { code: 'od', label: 'Odia' },
    { code: 'sd', label: 'Sindhi' },
    { code: 'ne', label: 'Nepali' },
    { code: 'si', label: 'Sinhala' },
    { code: 'ps', label: 'Pashto' },
];

const CommentSection = ({ videoId }) => {
    const { user } = useContext(AuthContext);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [translatedComments, setTranslatedComments] = useState({});
    const [loading, setLoading] = useState(false);
    const [commented, setCommented] = useState(false); // Track if the comment was added successfully

    // const [userLocation, setUserLocation] = useState(''); // Tracks user location

    const fetchComments = useCallback(async () => {
        try {
            // console.log("Fetching comments for videoId:", videoId);
            const response = await axios.get(`${gpath}/api/comments/get_comments/${videoId}`);
            // console.log("Response data:", response.data);
            setComments(response.data);
            // console.log("Fetched comments:", response.data);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    }, [videoId]);
    useEffect(() => {
        fetchComments();
    }, [fetchComments]); // Fetch comments when videoId or userLocation changes

    // Get user location (City)
    const getUserLocation = async () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                console.log("Geolocation is not supported by this browser.");
                resolve("Unknown City");
                return;
            }

            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                const apiKey = process.env.REACT_APP_OPENCAGE_API_KEY;
                const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

                try {
                    const response = await fetch(apiUrl);
                    console.log("API Response:", response);
                    const data = await response.json();
                    console.log("Location data:", data);
                    const components = data.results[0]?.components;
                    const city = components?.city || components?.town || components?.village || components?.state || "Unknown City";
                    console.log("City found:", city);
                    const state = components?.state || "Unknown State";
                    console.log("State found:", state);
                    const combinedlocation = `${city}, ${state}`;
                    // setUserLocation(combinedlocation); // Update state with the city
                    resolve(combinedlocation);
                } catch (error) {
                    console.log("Error fetching location:", error.message);
                    resolve("Unknown City");
                }
            });
        });
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            alert("You need to log in first!");
            return;
        }

        if (!newComment.trim()) return;

        setLoading(true);
        setCommented(false); // Reset commented state

        try {
            // Step 1: Get the user's city (wait for it before continuing)
            const cityName = await getUserLocation();

            // Step 2: Prepare the comment with location
            const commentData = {
                videoId,
                userId: user._id,
                username: user.username,
                text: newComment,
                city: cityName,
                likes: 0,
                dislikes: 0,
                timestamp: new Date().toLocaleString(),
            };

            // Step 3: Send the full comment to the backend
            const response = await axios.post(`${gpath}/api/comments/add_comment`, commentData);
            const savedComment = response.data;

            // Step 4: Update UI after comment is fully saved
            setComments([savedComment, ...comments]);
            setNewComment('');
            setCommented(true); // Set commented to true
            // alert("Comment added successfully!");
        } catch (error) {
            console.error("Error submitting comment:", error);
            alert("Failed to add comment. Please try again.");
        }
        finally {
            setLoading(false);
        }
    };




    const translateComment = async (commentId, text, targetLang) => {
        if (targetLang === 'en') {
            setTranslatedComments(prev => ({ ...prev, [commentId]: text }));
            return;
        }

        try {
            const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
            const data = await response.json();
            const translatedText = data[0]?.map(item => item[0]).join(' ') || text;

            setTranslatedComments(prev => ({ ...prev, [commentId]: translatedText }));
        } catch (error) {
            console.error("Translation failed:", error);
        }
    };
    const handleLike = async (id) => {
        try {
            const response = await axios.patch(`${gpath}/api/comments/like_comment`, {
                commentId: id,
                userId: user._id
            });

            // Update the comment with fresh data
            setComments((prevComments) =>
                prevComments.map((comment) =>
                    comment._id === id ? response.data : comment
                )
            );
        } catch (error) {
            console.error("Error liking comment:", error.response?.data?.message || error.message);
        }
    };


    const handleDislike = async (id) => {
        try {
            const response = await axios.patch(`${gpath}/api/comments/dislike_comment`, {
                commentId: id,
                userId: user._id
            });

            if (response.data.message === "Comment deleted") {
                // Remove from UI
                setComments((prevComments) =>
                    prevComments.filter((comment) => comment._id !== id)
                );
            } else {
                setComments((prevComments) =>
                    prevComments.map((comment) =>
                        comment._id === id ? response.data : comment
                    )
                );
            }
        } catch (error) {
            console.error("Error disliking comment:", error);
        }
    };

    // convert timestamp to local time
    const convertToLocalTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString(); // Adjust format as needed
    };

    // console.log("Comments:", convertToLocalTime(comments[0]?.timestamp));

    useEffect(() => {
        if (commented) {
            const timer = setTimeout(() => {
                setCommented(false);
            }, 3000); // hide after 3 seconds
            return () => clearTimeout(timer); // cleanup
        }
    }, [commented]);
    

    return (
        <div className="container mt-4">
            {commented && (
                <div className="alert alert-success alert-dismissible fade show position-fixed top-0 end-0" role="alert">
                    Comment added successfully!
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setCommented(false)}
                        aria-label="Close"
                    ></button>
                </div>
            )}
            <h3 className="text-primary">Comment Section</h3>
            {/* alert comment added successfully after commented is true for few seconds */}

            {user ? (
                // <div className="mb-3">
                //     <input
                //         type="text"
                //         className="form-control"
                //         rows="3"
                //         value={newComment}
                //         onChange={(e) => setNewComment(e.target.value)}
                //         placeholder="Write a comment..."
                //         // pattern with no special characters
                //         pattern="^[a-zA-Z0-9 ]*$"
                //     />
                //     <button className="btn btn-primary mt-2" onClick={handleCommentSubmit}>Submit</button>
                // </div>

                <form className="mb-3" onSubmit={handleCommentSubmit}>
                    <input
                        type="text"
                        className="form-control"
                        rows="3"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        // pattern with no special characters
                        pattern="^[a-zA-Z0-9 ]*$"
                    />
                    <button className="btn btn-primary mt-2" type="submit">
                        {loading ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        ) : (
                            "Post Comment"
                        )}
                    </button>
                </form>
            ) : (
                <p className="text-danger">Login to post a comment.</p>
            )}

            <div className="list-group overflow-y-auto" style={{ height: "40dvh" }}>
                {comments.map((comment) => (
                    <div key={comment._id} className="list-group-item mt-2 ">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <p className="mb-1"><strong>{comment.username}:</strong> {translatedComments[comment._id] || comment.text}</p>
                                <small className="text-muted">{comment?.timestamp ? convertToLocalTime(comment?.timestamp) : ""}</small>
                            </div>

                            <select
                                className="form-select w-auto"
                                onChange={(e) => translateComment(comment._id, comment.text, e.target.value)}
                                defaultValue="en"
                            >
                                {languages.map((lang) => (
                                    <option key={lang.code} value={lang.code}>{lang.label}</option>
                                ))}
                            </select>
                        </div>
                        <small className="text-muted">City: {comment.city}</small>

                        <div>
                            <button className="btn btn-success btn-sm me-2" onClick={() => handleLike(comment._id)}>
                                👍 {comment.likes}
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDislike(comment._id)}>
                                👎 {comment.dislikes}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommentSection;
