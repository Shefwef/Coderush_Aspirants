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
        <Typography variant="body2" color="text.secondary">
          <b>Program:</b>{" "}
          {Array.isArray(user.program)
            ? user.program.join(", ")
            : user.program || "Not specified"}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          <b>University:</b>{" "}
          {Array.isArray(user.university)
            ? user.university.join(", ")
            : user.university || "Not specified"}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          <b>Year of Study:</b>{" "}
          {Array.isArray(user.yearOfStudy)
            ? user.yearOfStudy.join(", ")
            : user.yearOfStudy || "Not specified"}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          <b>Date of Birth:</b>{" "}
          {Array.isArray(user.dob)
            ? user.dob.join(", ")
            : user.dob || "Not specified"}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          <b>Contact:</b>{" "}
          {Array.isArray(user.contactNo)
            ? user.contactNo.join(", ")
            : user.contactNo || "Not specified"}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default UserCard;
