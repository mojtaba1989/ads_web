import React from "react";
import VideoPanel from "./components/VideoPanel";
import MapPanel from "./components/MapPanel";
import PlotPanel from "./components/PlotPanel";
import ScenarioPanel from "./components/ScenarioPanel";

function App() {
  // const handlePositionSelect = (timestamp) => {
  //   console.log("Selected timestamp:", timestamp);
  //   // TODO: link this to your video slider or playback component
  // };
  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>React Dashboard is running!</h1>
      <p>Use this skeleton to build your dashboard components.</p>

      <div style={{ marginTop: "2rem" }}>
        <VideoPanel />
        <MapPanel/>
        {/* <MapPanel onPositionSelect={handlePositionSelect} /> */}
        <PlotPanel />
        <ScenarioPanel />
      </div>
    </div>
  );
}

export default App;
