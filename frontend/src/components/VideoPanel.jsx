import React, { useRef, useState, useEffect } from "react";
import VideoPanelView from "../views/VideoPanelView";

const VideoPanel = ({jumpToTime, onTimeChange, source}) => {
  const videoRef = useRef(null);
  const [isError, setIsError] = useState(false);
  const [frameId, setFrameId] = useState(0);

  const videoUrl = "http://localhost:8000/api/video/file";
  const fps = 15; // video FPS

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onError = () => setIsError(true);

    const updateFrame = () => {
      const currentFrame = Math.floor(video.currentTime * fps);
      setFrameId(currentFrame);
      fetch(`http://localhost:8000/api/video/frame2rostime?frame_id=${currentFrame}`)
        .then(res => res.json())
        .then(data => {
          if (Math.abs(data.rostime - jumpToTime) > 100000000)
            onTimeChange(data.rostime);
        })
        .catch(err => console.error("Failed to get frame data:", err));
    };

    video.addEventListener("error", onError);
    video.addEventListener("timeupdate", updateFrame);

    return () => {
      video.removeEventListener("error", onError);
      video.removeEventListener("timeupdate", updateFrame);
    };
  }, [fps]);

  useEffect(() => {
    if (source === "video") return;
    console.log("Jumping to time:", jumpToTime);
    console.log("source:", source);
    const video = videoRef.current;
    console.log("video:", video.currentTime);
    fetch(`http://localhost:8000/api/video/rostime2elapsed?rostime=${jumpToTime}`)
      .then(res => res.json())
      .then(data => {
        if (data.elapsed) {
          video.currentTime = data.elapsed;
          console.log("video_new:", video.currentTime);
        }
      })
      .catch(err => console.error("Failed to get frame data:", err));
  }, [jumpToTime, source]);

  return (
    <VideoPanelView
      videoUrl={videoUrl}
      isError={isError}
      frameId={frameId}
      videoRef={videoRef}
    />
  );
};

export default VideoPanel;
