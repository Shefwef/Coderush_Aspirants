import React from "react";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { formatDistanceToNow } from "date-fns";

const UserCard = ({ user }) => {
  const getFormattedDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "Invalid date";
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return "Unknown";
    }
  };

  return (
    <Card sx={{ backgroundColor: "#fff", borderRadius: 2, p: 2, mb: 2 }}>
      <CardMedia
        component="img"
        height="230"
        image={user.img || "default-avatar.jpg"}
        alt={user.username}
        sx={{ borderRadius: 1 }}
      />
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1e3c72" }}>
          {user.username}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Email:</b> {user.email}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Description:</b> {user.desc || "No description available"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Location:</b> {user.areas?.join(", ") || "Not specified"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Joined:</b> {getFormattedDate(user.createdAt)}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default UserCard;
