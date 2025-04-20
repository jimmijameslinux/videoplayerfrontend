import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import gpath from '../utility/globalPath';

const AdminDashboard = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quality, setQuality] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [editVideo, setEditVideo] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedDesc, setUpdatedDesc] = useState('');
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const {admin} = useContext(AuthContext);
  const navigate = useNavigate();


 
console.log(admin)
  const fetchVideos = async () => {
    const res = await axios.get(`${gpath}/api/videos`);
    setVideos(res.data);
  };

  const fetchUsers = async () => {
    const res = await axios.get(`${gpath}/api/admin/videos/users`);
    setUsers(res.data);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  let totaldownload =0;
  // console.log(totaldownload)

  // loop through users and add the total downloads
  users.forEach(user => {
    totaldownload += user.downloads;
  });
  // console.log(totaldownload)

  // total downloads in useEffect


  const handleUpload = async (e) => {
    console.log("upload")
    e.preventDefault();
    setUploading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('video', videoFile);
    formData.append('quality', quality);

    try {
      await axios.post(`${gpath}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log(formData);

      setTitle('');
      setDescription('');
      setVideoFile(null);
      setQuality('');
      setShowUploadModal(false);
      fetchVideos();
    } catch (err) {
      alert("Upload failed");
      console.error(err.message);
      // console.log(err.response.details)
      setError(err.response ? err.response.data.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;
    setDeletingId(id);
    try {
      await axios.delete(`${gpath}/api/admin/videos/delete/${id}`);
      setVideos(videos.filter(v => v._id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const openEditModal = (video) => {
    setEditVideo(video);
    setUpdatedTitle(video.title);
    setUpdatedDesc(video.description);
  };

  const handleEditSubmit = async () => {
    setEditing(true);
    try {
      const res = await axios.put(`${gpath}/api/admin/videos/update/${editVideo._id}`, {
        title: updatedTitle,
        description: updatedDesc
      });

      setVideos(videos.map(v => v._id === res.data._id ? res.data : v));
      setEditVideo(null);
    } catch (err) {
      console.error(err);
      alert("Update failed");
    } finally {
      setEditing(false);
    }
  };

  // // check if admin is logged in or not
  useEffect(() => {
  if(!admin) {
    navigate('/adminlogin');
  }
  }, [admin, navigate]);

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Admin Dashboard</h2>
        {/* admin name */}
        <div>
        <button className="btn btn-success" onClick={() => setShowUploadModal(true)}>
          Upload Video
        </button>
        <button className="btn btn-danger ms-2" onClick={() => {localStorage.removeItem('token'); localStorage.removeItem('admin'); navigate('/adminlogin')}}>
          Logout
        </button>
        </div>
      </div>

      <h5 className="me-3 mb-5">Welcome, {admin?.email}</h5>
      {/* no. of users */}
      <div className="d-flex align-items-center">
        <h5 className="me-3">Total Users: {users.length}</h5>
        <h5 className="me-3">Total Downloads: {totaldownload}</h5>
        <h5 className="me-3">Total Videos: {videos.length}</h5>
      </div>

      {/* Video Cards */}
      <div className="row">
        {videos.map(video => (
          <div className="col-md-4 mb-4" key={video._id}>
            <div className="card h-100 shadow-sm">
              <img src={`${gpath}${video.thumbnail}`} className="card-img-top" alt={video.title} />
              <div className="card-body">
                <h5 className="card-title">{video.title}</h5>
                <p className="card-text">{video.description}</p>
                <button
                  className="btn btn-primary me-2"
                  onClick={() => openEditModal(video)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(video._id)}
                  disabled={deletingId === video._id}
                >
                  {deletingId === video._id ? (
                    <span className="spinner-border spinner-border-sm" />
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal show fade d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <form onSubmit={handleUpload}>
                <div className="modal-header">
                  <h5 className="modal-title">Upload Video</h5>
                  <button type="button" className="btn-close" onClick={() => setShowUploadModal(false)}></button>
                </div>
                <div className="modal-body">
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Video Title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                  />
                  <textarea
                    className="form-control mb-2"
                    placeholder="Video Description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    required
                  />
                  <input
                    type="file"
                    accept="video/*"
                    className="form-control"
                    onChange={e => setVideoFile(e.target.files[0])}
                    required
                  />
                  {/* checkbox the mutiple qualities like 360p,480p etc.. need to be converted */}
                  <h6 className="mt-3">Select Quality:</h6>
                  <div className="form-check mt-2">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="qualityCheck360p"
                      
                      onChange={e => setQuality(e.target.checked ? '360p' : '')}
                    />
                    <label className="form-check-label" htmlFor="qualityCheck360p">360p</label>
                  </div>

                  <div className="form-check mt-2">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="qualityCheck480p"
                      onChange={e => setQuality(e.target.checked ? '480p' : '')}
                    />
                    <label className="form-check-label" htmlFor="qualityCheck480p">480p</label>
                  </div>

                  <div className="form-check mt-2">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="qualityCheck720p"
                      onChange={e => setQuality(e.target.checked ? '720p' : '')}
                    />
                    <label className="form-check-label" htmlFor="qualityCheck720p">720p</label>
                  </div>

                  <div className="form-check mt-2">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="qualityCheck1080p"
                      onChange={e => setQuality(e.target.checked ? '1080p' : '')}
                    />
                    <label className="form-check-label" htmlFor="qualityCheck1080p">1080p</label>
                  </div>

                  {/* all the above qulities checkbox together checked */}
                  {/* <div className="form-check mt-2">
                    <input

                      type="checkbox"
                      className="form-check-input"
                      id='qualityCheckAll'
                      onChange={e => {
                        if (e.target.checked) {
                          setQuality('360p, 480p, 720p, 1080p');
                        } else {
                          setQuality('');
                        }
                      }}
                    />
                    <label className="form-check-label" htmlFor="qualityCheckAll">All Qualities</label>
                  </div> */}



                  
                  {/* error message from backend */}

                  {error && <div className="alert alert-danger mt-2">{error}</div>}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowUploadModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-success" disabled={uploading}>
                    {uploading ? (
                      <span className="spinner-border spinner-border-sm" />
                    ) : (
                      'Upload'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editVideo && (
        <div className="modal show fade d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Video</h5>
                <button type="button" className="btn-close" onClick={() => setEditVideo(null)}></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-2"
                  value={updatedTitle}
                  onChange={(e) => setUpdatedTitle(e.target.value)}
                  placeholder="Title"
                />
                <textarea
                  className="form-control"
                  value={updatedDesc}
                  onChange={(e) => setUpdatedDesc(e.target.value)}
                  placeholder="Description"
                ></textarea>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setEditVideo(null)}>Cancel</button>
                <button className="btn btn-success" onClick={handleEditSubmit} disabled={editing}>
                  {editing ? (
                    <span className="spinner-border spinner-border-sm" />
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
