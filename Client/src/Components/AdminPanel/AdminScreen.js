import React, { useState } from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import {
  Pets as PetsIcon,
  CheckCircle as CheckCircleIcon,
  Assignment as AssignmentIcon,
  History as HistoryIcon,
} from "@mui/icons-material";
import PostingPets from "./PostingPets";
import AdoptingRequests from "./AdoptingRequests";
import AdoptedHistory from "./AdoptedHistory";
import ApprovedRequests from "./ApprovedRequests";
import AdminUser from "./AdminUsers";
const AdminScreen = () => {
  const [screen, setScreen] = useState("postingPet");

  // Navigation items with icons
  const navItems = [
    {
      label: "User",
      icon: <HistoryIcon />,
      value: "AdminUser",
    },
  ];

  // Content rendering based on selected screen
  const renderContent = () => {
    switch (screen) {
      case "postingPet":
        return <PostingPets />;
      case "approvedRequests":
        return <ApprovedRequests />;
      case "adoptingPet":
        return <AdoptingRequests />;
      case "adoptedHistory":
        return <AdoptedHistory />;
      case "AdminUser":
        return <AdminUser />;

      default:
        return <PostingPets />;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        padding: "20px 30px",
        backgroundColor: "#f1f1f1",
        height: "90vh",
      }}
    >
      {/* Left Navigation Panel */}
      <Box
        sx={{
          width: "240px",
          backgroundColor: "#121858", // Midnight Blue for the sidebar
          color: "#ffffff",
          borderRadius: "10px",
          padding: "15px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          marginRight: "20px",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            padding: "10px 0",
            textAlign: "center",
            fontWeight: "bold",
            borderBottom: "1px solid #ffffff",
          }}
        >
          Admin Panel
        </Typography>
        <List>
          {navItems.map((item) => (
            <ListItemButton
              key={item.value}
              selected={screen === item.value}
              onClick={() => setScreen(item.value)}
              sx={{
                backgroundColor: screen === item.value ? "#1e3c72" : "inherit",
                color: screen === item.value ? "#ffffff" : "inherit",
                "&:hover": { backgroundColor: "#1e3c72", color: "#ffffff" },
                borderRadius: "8px",
                margin: "5px 0",
                position: "relative",
              }}
            >
              {screen === item.value && (
                <Box
                  sx={{
                    position: "absolute",
                    left: 0,
                    height: "100%",
                    width: "4px",
                    backgroundColor: "#ffffff", // White left border for the active item
                    borderRadius: "2px",
                  }}
                />
              )}
              {item.icon && (
                <Box sx={{ marginRight: "10px", color: "inherit" }}>
                  {item.icon}
                </Box>
              )}
              <ListItemText
                primary={
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: screen === item.value ? "1.05rem" : "1rem", // Slightly larger text for active label
                      transition: "all 0.3s ease", // Smooth transition for visual changes
                    }}
                  >
                    {item.label}
                  </Typography>
                }
              />
            </ListItemButton>
          ))}
        </List>
      </Box>

      {/* Right Content Section */}
      <Box
        sx={{
          flex: 1,
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          padding: "20px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          overflowY: "auto", // Allow scrolling if content overflows
        }}
      >
        {renderContent()}
      </Box>
    </Box>
  );
};

export default AdminScreen;
