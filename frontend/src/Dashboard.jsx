import React , {useState, useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";


import VideoPanel from "./components/VideoPanel";
import MapPanel from "./components/MapPanel";
import PlotPanel from "./components/PlotPanel";
import ScenarioPanel from "./components/ScenarioPanel";
import LidarPanel from "./components/LidarPanel";
import InfoPanel from "./components/InfoPanel";

function Dashboard() {
  const [jumpToTime, setJumpToTime] = useState(0);
  const [source, setSource] = useState(null);
  const [walltime, setWalltime] = useState(null);
  const { recordingId } = useParams();
  const [recording, setRecording] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8000/api/recordings/${recordingId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch recording data");
        return res.json();
      })
      .then((data) => {
        setRecording(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching recording:", err);
        setLoading(false);
      });
  }, [recordingId]);

  useEffect(() => {
    if (jumpToTime)
      fetch(`http://localhost:8000/api/info/walltime?rostime=${jumpToTime}`)
        .then(res => res.json())
        .then(data => setWalltime(data.walltime))
        .catch(err => console.error("Failed to fetch walltime:", err));
    }, [jumpToTime]);

  const handleVideoTimeChange = (time) => {
    setJumpToTime(time);
    setSource("video");
  };

  const handleMapSeek = (time) => {
    setJumpToTime(time);
    setSource("map");
  };

  const handleScenarioSelect = (time) => {
    setJumpToTime(time);
    setSource("scenario");
  };

  const handlePlotSeek = (time) => {
    setJumpToTime(time);
    setSource("plot");
  };

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.5rem",
          color: "#888",
        }}
      >
        Loading recording data...
      </div>
    );
  }

  if (!recording) {
    return <p style={{ padding: "2rem" }}>Failed to load recording.</p>;
  }

  return(
    <div
      style={{
        height: "100vh",
        gap: ".1rem",
        display: "flex",
        flexDirection: "column",
        // background: "#1f1f1f",
        padding: "1rem"
      }}>
      <div style={{ height: "5vh"}}>
        <div style={{
          gridColumn: "1 / 4",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <button
            onClick={() => navigate("/")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "2rem",
              color: "#363636ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0.3rem",
              borderRadius: "50%",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#e9ecef")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
          >
            <FaHome />
          </button>

          <div style={{ fontSize: "1.1rem", fontWeight: "500" }}>
            {recording.file}
          </div>
        </div>
      </div>
      <div
        style={{ 
          height: "85vh",
          display: "flex",
          gap: "1rem"}}>
        <div
          style={{ width: "25%" }}>
          <div
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "1rem"
            }}>
              <div style={{height: "20%"}}>
                <InfoPanel />
              </div>
              <div style={{height:"40%"}}>
                <ScenarioPanel
                  jumpToTime={jumpToTime}
                  onSelectScenario={handleScenarioSelect}
                  source={source}
                />
              </div>
              <div style={{height:"40%"}}>
                <MapPanel
                  jumpToTime={jumpToTime}
                  onSeek={handleMapSeek}
                  source={source}
                />
              </div>
          </div>
        </div>
        <div
          style={{ width: "75%", height: "100%" }}>
          <div style={{display: "flex", flexDirection: "column", height: "100%", gap: "1rem"}}>
            <div style={{display: "flex", flex: "0 0 50%", gap: "1rem"}}>
              <div style={{aspectRatio: "16 / 9"}}>
                <VideoPanel
                  recordingId={recordingId}
                  jumpToTime={jumpToTime}
                  onTimeChange={handleVideoTimeChange}
                  source={source}
                />
              </div>
              <div style={{flex: "1"}}>
                <LidarPanel
                  jumpToTime={jumpToTime}
                />
              </div>
            </div>
            
            <div style={{ flex: 1, display: "flex", minHeight: 0}}>
              <PlotPanel jumpToTime={jumpToTime} onSeek={handlePlotSeek} source={source} />
            </div>
          </div>
        </div>
      </div>
      <div style={{ height: "3vh" }}>
        <div style={{
          gridColumn: "1 / 4",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <div>ROS Time: {jumpToTime}</div>
          <div>Date/Time: {walltime}</div>
        </div>
      </div>
      <div style={{ 
        height: "5vh",
        textAlign: "center",
        color: "#afafafff",
        }}>

        © 2025 ACM Powered By MTU
      </div>
    </div>
  )
}

export default Dashboard;
