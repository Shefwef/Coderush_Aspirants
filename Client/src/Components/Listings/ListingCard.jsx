import React from "react";
import { Link } from "react-router-dom";

export default function ListingCard({ listing }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: 15,
        marginBottom: 15,
        borderRadius: 6,
      }}
    >
      <h3>{listing.title}</h3>
      <p>
        <b>Type:</b> {listing.type}
      </p>
      <p>
        <b>Category:</b> {listing.category}
      </p>
      <p>
        <b>Price:</b> {listing.price} ({listing.priceType})
      </p>
      <p>
        <b>Condition:</b> {listing.condition}
      </p>
      <p>
        <b>Visibility:</b> {listing.visibility}
      </p>
      <p>
        <b>University:</b> {listing.university}
      </p>
      <p>
        <b>Status:</b> {listing.status}
      </p>
      <Link to={`/listings/${listing._id}`}>View Details</Link>
    </div>
  );
}
