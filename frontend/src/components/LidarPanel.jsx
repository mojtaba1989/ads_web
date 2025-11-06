import React, { useState, useEffect } from "react";
import { useLoader } from "@react-three/fiber";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import LidarPanelView from "../views/LidarPanelView";

export function Mesh({ url, color = "red", scale = 1, rotation = [0, 0, 0], position = [0, 0, 0] }) {
  const geometry = useLoader(STLLoader, url);

  return (
    <mesh geometry={geometry} position={position} scale={scale} rotation={rotation}>
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function LidarPanel({jumpToTime}) {
  const vehicleMeshUrl="/meshes/car.stl"
  const humanMeshUrl="/meshes/human.stl"

  const [lidarData, setLidarData] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    fetch(`/api/lidar/objects?rostime=${currentTime}`)
      .then(res => res.json())
      .then(data => {
        setLidarData(Array.isArray(data) ? data : [])
        console.log("Received lidar data:", data);
      })
      .catch(err => console.error("Failed to fetch lidar data:", err));
  }, [currentTime]);

  useEffect(() => {
    if (jumpToTime) {
      setCurrentTime(jumpToTime);
    }
  }, [jumpToTime]);

  return (
    <LidarPanelView
      lidarData={lidarData}
      setCurrentTime={setCurrentTime}
      vehicleMeshUrl={vehicleMeshUrl}
      humanMeshUrl={humanMeshUrl}
    />
  );

}

export default LidarPanel;

