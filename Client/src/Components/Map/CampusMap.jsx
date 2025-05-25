import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet.markercluster"; // Import leaflet.markercluster

// Fix Leaflet's default icon issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Define custom icon for markers
const customIcon = new L.Icon({
  iconUrl: "https://example.com/path-to-your-custom-icon.png", // Replace with your custom icon URL
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  shadowUrl: "https://example.com/path-to-your-shadow.png",
  shadowSize: [50, 64],
  shadowAnchor: [10, 40],
});

// Sample landmarks data
const landmarks = [
  { id: 1, name: "Main Gate", lat: 23.7807, lng: 90.2796 },
  { id: 2, name: "Library", lat: 23.781, lng: 90.2801 },
  { id: 3, name: "Student Center", lat: 23.7803, lng: 90.279 },
];

// Component for selecting location & showing safety status
function LocationSelector({ onSelect, universityName }) {
  const [position, setPosition] = useState(null);
  const [safetyStatus, setSafetyStatus] = useState("");

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onSelect(e.latlng);
      checkLocationSafety(e.latlng, universityName);
    },
  });

  const checkLocationSafety = async (latlng, universityName) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/safelocation/check-safety",
        {
          universityName,
          lat: latlng.lat,
          lng: latlng.lng,
        }
      );

      setSafetyStatus(response.data.status);
    } catch (error) {
      console.error("Safety check failed:", error);
      setSafetyStatus("Unknown");
    }
  };

  return (
    <>
      {position && (
        <Marker position={position} icon={customIcon}>
          <Popup>
            You selected this location
            <br />
            <strong>
              Safety Status:{" "}
              <span
                style={{
                  color:
                    safetyStatus === "Safe"
                      ? "green"
                      : safetyStatus === "Unsafe"
                      ? "red"
                      : "gray",
                  fontWeight: "bold",
                }}
              >
                {safetyStatus || "Checking..."}
              </span>
            </strong>
          </Popup>
        </Marker>
      )}
      {position && (
        <div
          style={{
            position: "fixed",
            bottom: 30,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "10px 20px",
            backgroundColor:
              safetyStatus === "Safe"
                ? "#d4edda"
                : safetyStatus === "Unsafe"
                ? "#f8d7da"
                : "#fff3cd",
            color:
              safetyStatus === "Safe"
                ? "#155724"
                : safetyStatus === "Unsafe"
                ? "#721c24"
                : "#856404",
            borderRadius: 6,
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            fontWeight: "bold",
            zIndex: 1000,
          }}
        >
          Location is: {safetyStatus || "Checking..."}
        </div>
      )}
    </>
  );
}

export default function CampusMap({ universityName, onSelectLocation }) {
  const center = [23.7806, 90.2794];
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  }, []);

  const markerClusterGroup = new L.MarkerClusterGroup();

  return (
    <MapContainer
      center={center}
      zoom={16}
      style={{ height: "500px", width: "100%" }}
      scrollWheelZoom={true}
      zoomControl={true}
      whenCreated={(map) => {
        map.addLayer(markerClusterGroup);
      }}
    >
      {/* Use Carto light basemap */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://carto.com/attributions">CartoDB</a>'
      />

      {/* Predefined landmarks */}
      {landmarks.map(({ id, name, lat, lng }) => {
        const marker = new L.Marker([lat, lng], { icon: customIcon });
        marker.bindPopup(name);
        marker.bindTooltip(name, { direction: "top" });
        markerClusterGroup.addLayer(marker);
        return null;
      })}

      {/* Location selector with safety check */}
      <LocationSelector
        onSelect={onSelectLocation}
        universityName={universityName}
      />

      {/* Loading Spinner */}
      {loading && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#19275c",
            fontSize: "24px",
          }}
        >
          Loading Map...
        </div>
      )}
    </MapContainer>
  );
}
