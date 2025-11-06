import React, { useEffect, useState} from "react";
import { MapContainer, TileLayer, Polyline, Marker} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import MapPanelView from "../views/MapPanelView";


import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
});

const MapPanel = ({ jumpToTime, onSeek, source }) => {
  const [route, setRoute] = useState([]);
  const [startPos, setStartPos] = useState(null);

  useEffect(() => {
    fetch("/api/map/route")
      .then(res => res.json())
      .then(data => {setRoute(data);
        if (data.length > 0) setStartPos([data[0].lat, data[0].lon]);
      })
      .catch(err => console.error("Map load error:", err));
  }, []);

  useEffect(() => {
    if (startPos) {
      console.log("Marker position updated to:", startPos);
    }
  }, [startPos]);

  const positions = route.map(p => [p.lat, p.lon]);
  const center = route.length > 0 ? [route[0].lat, route[0].lon] : [43.28, -83.74];

  const handleDragEnd = async (event) => {
    const marker = event.target;
    const pos = marker.getLatLng();

    try {
      const res = await fetch(`/api/map/nearest?lat=${pos.lat}&lon=${pos.lng}`);
      const data = await res.json();

      if (data.lat && data.lon) {
        const newPos = [data.lat, data.lon];
        setStartPos(newPos); // update marker
        onSeek(data.closest_time);
      }

    } catch (err) {
      console.error("Failed to get nearest point:", err);
    }
  };

  useEffect(() => {
    if (jumpToTime && source !== "map") {
      fetch(`/api/map/rostime?rostime=${jumpToTime}`)
        .then(res => res.json())
        .then(data => {
          if (data.lat && data.lon) {
            setStartPos([data.lat, data.lon]);
          }
        })
        .catch(err => console.error("Failed to get nearest point:", err));
    }
  }, [jumpToTime, source]);

  return (
    <MapPanelView
      center={center}
      positions={positions}
      startPos={startPos}
      handleDragEnd={handleDragEnd}
    />
  );
};

export default MapPanel;
