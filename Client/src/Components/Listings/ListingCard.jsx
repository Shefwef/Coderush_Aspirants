import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Button,
  CardActions,
  IconButton,
  Box,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import axios from "axios";

export default function ListingCard({ listing }) {
  const navigate = useNavigate(); // To handle redirection after chat creation

  // Handle chat creation and redirect
  const handleCreateChat = async () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const token = localStorage.getItem("token"); // Fetch token from localStorage

    if (!currentUser || !token) {
      alert("You need to be logged in to start a chat.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:4000/listings/create-chat/${currentUser._id}`, // Pass currentUser._id in the URL
        {
          listingId: listing._id, // Send the listing's ID in the body
          status: "active", // You can adjust the status as per your requirements
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send the token in the Authorization header
          },
        }
      );

      if (response.status === 200) {
        alert("Chat created successfully. Redirecting to communication...");
        // Optionally, navigate to the chat page or communication page
        navigate(`/communication/${response.data.chat._id}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error creating chat. Please try again.");
    }
  };

  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 3,
        paddingBottom: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        maxWidth: 350,
        margin: 2,
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {listing.title}
        </Typography>

        <Typography variant="body2">
          <b>Type:</b> {listing.type}
        </Typography>
        <Typography variant="body2">
          <b>Category:</b> {listing.category}
        </Typography>
        <Typography variant="body2">
          <b>Price:</b> {listing.price} ({listing.priceType})
        </Typography>
        <Typography variant="body2">
          <b>Condition:</b> {listing.condition}
        </Typography>
        <Typography variant="body2">
          <b>Visibility:</b> {listing.visibility}
        </Typography>
        <Typography variant="body2">
          <b>University:</b> {listing.university}
        </Typography>
        <Typography variant="body2">
          <b>Status:</b> {listing.status}
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: "space-between", px: 2 }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#19275c",
            borderRadius: "6px",
            textTransform: "none",
            fontWeight: 600,
            fontSize: 14,
            "&:hover": { backgroundColor: "#121858" },
          }}
          component={Link}
          to={`/listings/${listing._id}`}
        >
          Show Details
        </Button>

        {/* Start Chat Button */}
        <Button
          variant="outlined"
          color="primary"
          sx={{ fontSize: 14, fontWeight: 600 }}
          onClick={handleCreateChat}
        >
          Start Chat
        </Button>

        <IconButton color="primary">
          <FavoriteBorderIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
