import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Mesh } from "../components/LidarPanel";

const LidarPanelView = (
    { lidarData, setCurrentTime, vehicleMeshUrl, humanMeshUrl }
    ) => {
    return (
        <div class="section"
          style={{ height: "500px", padding: "0px" }}
        >
          <h2>LiDAR</h2>
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

        <Mesh
          url={vehicleMeshUrl}
          color="red"
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
                color="gray"
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
                color="gray"
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
};

export default LidarPanelView;