import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminDashboard = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ message: "", type: "" });

    const handleUpload = async () => {
        if (!title || !description || !file) {
            setAlert({ message: "All fields are required!", type: "danger" });
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("video", file);

        try {
            await axios.post("http://localhost:5000/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setAlert({ message: "Video uploaded successfully!", type: "success" });
            setTitle("");
            setDescription("");
            setFile(null);
        } catch (error) {
            console.error("Upload failed:", error);
            setAlert({ message: "Upload failed!", type: "danger" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4 d-flex flex-column vh-100">
            <h2>Admin Dashboard - Upload Video</h2>
            {alert.message && (
                <div className={`alert alert-${alert.type}`} role="alert">
                    {alert.message}
                </div>
            )}
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <textarea
                    className="form-control"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <input
                    type="file"
                    className="form-control"
                    onChange={(e) => setFile(e.target.files[0])}
                />
            </div>
            <button className="btn btn-success" onClick={handleUpload} disabled={loading}>
                {loading ? (
                    <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Uploading...
                    </>
                ) : (
                    "Upload"
                )}
            </button>
        </div>
    );
};

export default AdminDashboard;
