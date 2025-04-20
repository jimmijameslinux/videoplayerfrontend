import React, { useState, useRef, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import CommentSection from "../Comments/CommentSection";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "./VideoPlayer.css";
import gpath from "../../utility/globalPath";

const VideoPlayer = ({ setDisablepricing }) => {
  const { id } = useParams(); // Fix: Use id instead of videoId
  const navigate = useNavigate();
  const [videoData, setVideoData] = useState(null);
  const [quality, setQuality] = useState("720p");
  // const [volume, setVolume] = useState(0.8);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  // const [isFullscreen, setIsFullscreen] = useState(false);
  const [played, setPlayed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showComments, setShowComments] = useState(true);
  const [gestureMessage, setGestureMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const playerRef = useRef(null);
  // const [isReady, setIsReady] = useState(false);
  const [timeLimit, setTimeLimit] = useState(5 * 60);
  const [hasDownloaded, setHasDownloaded] = useState(false);

  const { user } = useContext(AuthContext);
  const { login } = useContext(AuthContext);


  const [message, setMessage] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  //user.plan
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${gpath}/api/videos/${id}`, {
        params: { userId: user?.userId }
      })
      .then((response) => {
        const data = response.data;
        setVideoData(data);
        setHasDownloaded(data.hasDownloaded);
        console.log(response.data.qualities);
        setLoading(false);
        console.log("Video data fetched:", response.data);
        console.log("ID:", id);
        const availableQualities = Object.keys(data.qualities);
        if (!availableQualities.includes("720p")) {
          setQuality(availableQualities[0]);
        }
      })
      .catch((error) => {
        console.error("Error fetching video data:", error);
        setError("Failed to load video.");
        setLoading(false);
        navigate("/");
      });
  }, [id, user?.userId, navigate]);

  // if(user.plan==="Gold"){
  //   setDisablepricing(true);
  // }

  useEffect(() => {
    if (!user) {
      setTimeLimit(5); // 5 minutes for non-logged-in users
      // navigate("/login");
      return;
    }

    switch (user.plan) {
      case "Bronze":
        setTimeLimit(10);
        break;
      case "Silver":
        setTimeLimit(35);
        break;
      case "Gold":
        setTimeLimit(Infinity);
        break;
      case "Free":
        setTimeLimit(5);
        break;
      default:
        setTimeLimit(5);
    }
  }, [user]);

  // useEffect(() => {
  //   if (playerRef.current && isReady) {
  //     playerRef.current.seekTo(played, "seconds");
  //   }
  // }, [quality, isReady]);


  // const toggleFullscreen = () => {
  //   if (playerRef.current?.wrapper) {
  //     if (!document.fullscreenElement) {
  //       playerRef.current.wrapper.requestFullscreen();
  //       setIsFullscreen(true);
  //     } else {
  //       document.exitFullscreen();
  //       setIsFullscreen(false);
  //     }
  //   }
  // };

  useEffect(() => {
    if (!hasDownloaded && played >= timeLimit) {
      setIsPlaying(false);
      navigate("/plans");
    }
  }, [played, timeLimit, navigate, hasDownloaded]);


  const handleGesture = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!playerRef.current) return;

    if (event.detail === 1) {
      setIsPlaying((prev) => !prev);
      setGestureMessage(isPlaying ? "Paused" : "Playing");
    } else if (event.detail === 2) {
      const direction = event.clientX > window.innerWidth / 2 ? "forward" : "backward";
      playerRef.current.seekTo(played + (direction === "forward" ? 10 : -10), "seconds");
      setGestureMessage(direction === "forward" ? "+10s" : "-10s");
    } else if (event.detail === 3) {
      setShowComments(!showComments);
      // document.exitFullscreen();
      setGestureMessage(showComments ? "Hiding Comments" : "Showing Comments");
    }
    setTimeout(() => setGestureMessage(""), 1500);
  };


  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-danger">{error}</p>;
  }

  if (!videoData || !videoData.qualities ) {
    return <p className="text-center text-muted">No video available.</p>;
  }


  const handleDownload = async (e) => {
    e.preventDefault();

    if (!user) {
      setMessage("Please login to download.");
      return;
    }

    // user can download only one video in a day if user is not Gold
    // if (user.plan !== "Gold") {
    //   setMessage("You can only download one video per day. Upgrade to Gold for unlimited downloads.");
    //   return;
    // }

    // check if user has already downloaded the video
    if (hasDownloaded) {
      setMessage("You have already downloaded this video.");
      return;
    }


    // check if user has already downloaded the video in the last 24 hours
    const currentTime = new Date().getTime();
    const lastDownloadedTime = user.lastDownloadDate;
    console.log("Last Downloaded Time:", lastDownloadedTime);
    if (lastDownloadedTime && currentTime - lastDownloadedTime < 24 * 60 * 60 * 1000 && user.plan!=="Gold") {
      setMessage("You can only download one video every 24 hours. Please try again later.");
      return;
    }
    try {
      const res = await axios.post(
        `${gpath}/api/upload/download/${id}`,
        { userId: user._id }  // sending userId in the request body
      );
      setMessage("");
      // console.log("User ID:", user._id);

      setIsDownloading(true);
      // const downloadUrl = res.data.downloadUrl;
      const newhasdownloaded = res.data.hasDownloaded;
      // console.log("Download URL:", res.data.downloadUrl);
      // console.log("Has Downloaded:", newhasdownloaded);
      setHasDownloaded(newhasdownloaded);

      // Trigger browser download
      // const link = document.createElement("a");
      // link.href = downloadUrl;
      // link.download = ""; // optional: you can set filename here
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);
      // console.log(hasDownloaded);
      // setHasDownloaded(true);

      setMessage("Download started!");
      // download complete
      if (newhasdownloaded) {
        setMessage("Download completed!");
      }

      // console.log(res.data)
      login(res.data.user);

    } catch (err) {
      setMessage(err.response?.data?.message || "Download failed.");
    } finally {
      setIsDownloading(false);
    }
  };

  let hasDownloadedconfirm;
  // loop through user.downloadHistory and match id with videoId
  if (user) {
    hasDownloadedconfirm = user.downloadHistory?.some((video) => video.videoId === id);
    // console.log("Has Downloaded Confirm:", hasDownloadedconfirm);
  }


  // fetch video qualities from server

  return (
    <div className="">
      <div className="container text-center pt-4">
        <h2>{videoData.title}</h2>
        <p>{videoData.description}</p>
        <div className="video-container" onClick={handleGesture}>
          <ReactPlayer
            ref={playerRef}
            url={`${gpath}${videoData.qualities[quality]}`}
            controls
            playing={isPlaying}
            width="100%"
            // volume={volume}
            playbackRate={playbackRate}
            onProgress={(progress) => setPlayed(progress.playedSeconds)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
          {gestureMessage && (
            <div className="position-absolute top-50 start-50 translate-middle bg-dark text-white px-4 py-2 rounded text-lg opacity-80">
              {gestureMessage}
            </div>
          )}
        </div>

        <div className="mt-3 d-flex justify-content-center align-items-center flex-wrap">
          <div className="mb-3 d-flex justify-content-center align-items-center">
            <label className="form-label">Select Quality:</label>
            <select
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              className="form-select w-auto d-inline-block"
            >
              {
                Object.keys(videoData.qualities).sort().map((q) => (
                <option key={q} value={q}>{q}</option>
              ))}
            </select>
          </div>

          <div className=" ms-3 mb-3 d-flex justify-content-center align-items-center">
            <label className="form-label">Speed:</label>
            <select
              value={playbackRate}
              onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
              className="form-select w-auto d-inline-block"
            >
              {[0.5, 1.0, 1.5, 2.0].map((speed) => (
                <option key={speed} value={speed}>
                  {speed}x
                </option>
              ))}
            </select>
          </div>

          {/* download button */}
          <div className="ms-3 mb-3 d-flex justify-content-center align-items-center">
            <button
              onClick={handleDownload}
              className="btn btn-primary"
              disabled={isDownloading || hasDownloadedconfirm}
            >
              {hasDownloadedconfirm
                ? "Already Downloaded"
                : isDownloading
                  ? "Downloading..."
                  : "Download"}
            </button>

            {/* {message && <p className="text-danger ms-2">{message}</p>} */}
            {/* bootstrap alert */}
            {message && (
              <>
              <div className="alert alert-danger mt-2 position-fixed top-0 end-0" role="alert">
                {message}
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close">
                  {/* <span aria-hidden="true">&times;</span> */}
                </button>
              </div>
                </>
              // close button
            )}

            {/* show message if user has already downloaded */}


            {/* {hasDownloadedconfirm && (
              <div className="alert alert-success mt-2 position-fixed top-0 end-0" role="alert">
                You have already downloaded this video.
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close">
                  </button>
              </div>
            )} */}

            {/*  */}


          </div>

          {/* <div className="mb-3 d-flex justify-content-center align-items-center">
            <button onClick={toggleFullscreen} className="btn btn-primary">
              {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            </button>
          </div> */}
        </div>
      </div>
      {
        // !hasDownloadedconfirm && (
        <div className="pb-4">
          {showComments && <CommentSection videoId={id} />}
        </div>
        // )
      }
    </div>
  );
};

export default VideoPlayer;
