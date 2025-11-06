import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";

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
    <div style={{ height: "500px", width: "100%", position: "relative" }}>
      <Canvas
        camera={{
          position: [-5, 5, 5],
          fov: 75,
          up: [0, 0, 1],
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <OrbitControls />

        {/* Ego vehicle (your car) at the origin */}
        <Mesh
          url={vehicleMeshUrl}
          color="blue"
          scale={1.2}
          rotation={[0, 0, Math.PI]}
          position={[0, 0, 0]}
        />

        {/* LiDAR-detected objects */}
        {lidarData.map((obj, idx) => {
          const [x, y, yaw, type] = obj;
          if (Math.abs(y) < 0.5 && Math.abs(x) < 3) return null;

          if (type === "car" || type === "truck") {
            return (
              <Mesh
                key={idx}
                url={vehicleMeshUrl}
                color="red"
                scale={1}
                rotation={[0, 0, yaw * (Math.PI / 180) + Math.PI]}
                position={[x, y, 0]}
              />
            );
          } else if (type === "pedestrian") {
            return (
              <Mesh
                key={idx}
                url={humanMeshUrl}
                color="white"
                scale={0.1}
                rotation={[Math.PI / 2, 0, yaw * (Math.PI / 180)]}
                position={[x, y, 0]}
              />
            );
          }
          return null;
        })}
      </Canvas>
    </div>
  );

}

export default LidarPanel;

