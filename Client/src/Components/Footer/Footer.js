// src/Components/Footer/Footer.js
import React from "react";
import { Box, Typography, Container, Divider } from "@mui/material";
import logo from "./images/logo.png"; // Replace with your rectangular logo image

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#19275c",
        color: "#fff",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <Container maxWidth="md">
        {/* Rectangular Logo Centered */}
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ marginBottom: "1.5rem" }}
        >
          <img
            src={logo}
            alt="Campus-Buy Logo"
            style={{
              width: "120px",
              height: "auto",
              objectFit: "contain",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            }}
          />
        </Box>

        <Divider sx={{ marginBottom: "1.5rem", backgroundColor: "#fff" }} />

        <Typography
          variant="body2"
          sx={{
            fontSize: "0.875rem",
            color: "#ccc",
          }}
        >
          &copy; {new Date().getFullYear()} Campus-Buy. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
