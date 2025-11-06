import React from "react";
import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";

const MapPanelView = (
    { positions, center, startPos, handleDragEnd }
) => {
    return (
        <div class="section"
        style={{ height: "500px"}}>
      <h2>Route</h2>
      {positions.length > 0 && (
        <MapContainer center={center} zoom={13} style={{height:"85%", padding:"0px"}} >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a> contributors'
          />
          <Polyline 
            positions={positions} 
            color="blue"
            width={40}/>
          <Marker 
            position={startPos}
            draggable={true}
            eventHandlers={{dragend: handleDragEnd}}
          />
        </MapContainer>
      )}
    </div>
    );
};

export default MapPanelView;