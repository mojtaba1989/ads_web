import React , {useState, useEffect} from "react";
import VideoPanel from "./components/VideoPanel";
import MapPanel from "./components/MapPanel";
import PlotPanel from "./components/PlotPanel";
import ScenarioPanel from "./components/ScenarioPanel";
import LidarPanel from "./components/LidarPanel";
import InfoPanel from "./components/InfoPanel";
import { GridLayer, gridLayer } from "leaflet";

function App() {
  const [jumpToTime, setJumpToTime] = useState(0);
  const [source, setSource] = useState(null);

  useEffect(() => {
    if (jumpToTime)
      console.log("Jumping to time:", jumpToTime);
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

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "25% 75%",
        gap: ".1rem",
        height: "100vh",
        background: "#f3f4f602",
      }}
    >
      <div>
        <div>
          <InfoPanel />
        </div>
        <div>
          <ScenarioPanel
            jumpToTime={jumpToTime}
            onSelectScenario={handleScenarioSelect}
            source={source}
          />
        </div>
        <div>
          <MapPanel
            jumpToTime={jumpToTime}
            onSeek={handleMapSeek}
            source={source}
          />
        </div>
      </div>

      <dev
        style={{
          display: "grid",
          GridLayer: "75% 25%"
        }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "60% 40%"
            }}>
            <div>
              <VideoPanel
                jumpToTime={jumpToTime}
                onTimeChange={handleVideoTimeChange}
                source={source}
              />
            </div>
            <div>
              <LidarPanel jumpToTime={jumpToTime} />
            </div>
          </div>
      
          <div>
            <PlotPanel
              jumpToTime={jumpToTime}
              onSeek={handlePlotSeek}
              source={source}
            />
          </div>
      </dev>

      {/* ---------- Bottom Controls ---------- */}
      <div
        style={{
          gridColumn: "1 / 4",
          borderTop: "1px solid #ccc",
          background: "#f9fafb",
          padding: "0.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "50px",
        }}
      >
        <div>ROS Time: {jumpToTime}</div>
        <div>Date/Time Placeholder</div>
      </div>
    </div>

  );
}

export default App;
