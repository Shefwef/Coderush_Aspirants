// src/Components/Map/CampusMap.jsx
import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";

// Fix Leaflet's default icon issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const landmarks = [
  { id: 1, name: "Main Gate", lat: 23.7807, lng: 90.2796 },
  { id: 2, name: "Library", lat: 23.781, lng: 90.2801 },
  { id: 3, name: "Student Center", lat: 23.7803, lng: 90.279 },
];

function LocationSelector({ onSelect }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onSelect(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>You selected this meetup spot</Popup>
    </Marker>
  );
}

export default function CampusMap({ onSelectLocation }) {
  const center = [23.7806, 90.2794]; // Campus center

  return (
    <MapContainer
      center={center}
      zoom={16}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {landmarks.map(({ id, name, lat, lng }) => (
        <Marker key={id} position={[lat, lng]}>
          <Popup>{name}</Popup>
        </Marker>
      ))}

      <LocationSelector onSelect={onSelectLocation} />
    </MapContainer>
  );
}
