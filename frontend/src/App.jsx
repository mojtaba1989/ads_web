import React , {useState, useEffect} from "react";
import VideoPanel from "./components/VideoPanel";
import MapPanel from "./components/MapPanel";
import PlotPanel from "./components/PlotPanel";
import ScenarioPanel from "./components/ScenarioPanel";

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
  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>React Dashboard is running!</h1>
      <p>Use this skeleton to build your dashboard components.</p>

      <div style={{ marginTop: "2rem" }}>
        <VideoPanel 
          jumpToTime={jumpToTime}
          onTimeChange={handleVideoTimeChange}
          source={source}
          />
        <MapPanel
          jumpToTime={jumpToTime}
          onSeek={handleMapSeek}
          source={source}
        />
        <PlotPanel />
        <ScenarioPanel />
      </div>
    </div>
  );
}

export default App;
