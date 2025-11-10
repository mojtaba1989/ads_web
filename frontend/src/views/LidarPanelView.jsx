import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Mesh } from "../components/LidarPanel";

const LidarPanelView = (
    { lidarData, vehicleMeshUrl, humanMeshUrl }
    ) => {
    return (
        <div className="section" style={{height: "100%"}}>
          <div style={{height: "100%", position: "relative", overflow: "hidden",}}>
            <Canvas
                camera={{
                position: [-5, 5, 5],
                fov: 75,
                up: [0, 0, 1],

                }}
                style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                }}
            >
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <OrbitControls />

            <Mesh
              url={vehicleMeshUrl}
              color="rgba(0, 255, 234, 1)"
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
                    color="white"
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
            <div
                        style={{
                        position: "absolute",
                        top: "10px",
                        left: "10px",
                        color: "white",
                        background: "rgba(0, 0, 0, 0.7)",
                        padding: "6px 10px",
                        borderRadius: "6px",
                        fontSize: "14px",
                        fontWeight: "600",
                        }}>
                        LiDAR 3D View
                    </div>
          </div>
      </div>
    );
};

export default LidarPanelView;