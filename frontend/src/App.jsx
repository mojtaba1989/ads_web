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
      <div style={{ height: "5vh" }}>
        Top Pannel
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
          <div>Date/Time Placeholder</div>
        </div>
      </div>
      <div style={{ 
        height: "5vh",
        textAlign: "center",
        color: "#afafafff",
        }}>

        © MTU@ACM
        2025
      </div>
    </div>
  )
}

export default App;
