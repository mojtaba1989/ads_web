import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapPanel = ({ onPositionSelect }) => {
  const [route, setRoute] = useState([]);

  useEffect(() => {
    fetch("/api/map/route")
      .then(res => res.json())
      .then(data => setRoute(data))
      .catch(err => console.error("Map load error:", err));
  }, []);

  const positions = route.map(p => [p.lat, p.lon]);

  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        fetch(`/api/map/nearest?lat=${e.latlng.lat}&lon=${e.latlng.lng}`)
          .then(res => res.json())
          .then(data => {
            console.log("Closest timestamp:", data.closest_time);
            if (onPositionSelect) onPositionSelect(data.closest_time);
          });
      }
    });
    return null;
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MapContainer center={[42.28, -83.74]} zoom={15} style={{ height: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {positions.length > 0 && (
          <Polyline positions={positions} color="blue" />
        )}
        <MapClickHandler />
      </MapContainer>
    </div>
  );
};

// export default function MapPanel() {
//   return (
//     <div style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
//       <h2>Video Panel</h2>
//       <p>Video component will appear here.</p>
//     </div>
//   );
// }

export default MapPanel;
