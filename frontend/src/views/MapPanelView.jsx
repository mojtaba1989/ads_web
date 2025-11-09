import React from "react";
import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";

const MapPanelView = (
    { positions, center, startPos, handleDragEnd }
) => {
    return (
        <div className="section" style={{height:"100%", display: "flex", flexDirection: "column"}}>
          <h2>Route</h2>
          <div style={{flex: 1, overflowY: "hidden", overflowX: "hidden", marginBottom: "10px", marginRight: "10px"}}>  
            {positions.length > 0 && (
              <MapContainer center={center} zoom={13} style={{height:"100%", padding:"0px"}} >
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
        </div>
    );
};

export default MapPanelView;