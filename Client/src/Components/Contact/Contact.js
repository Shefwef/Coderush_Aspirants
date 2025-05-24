import React from "react";
import { Box, Typography, Link, Avatar, Container } from "@mui/material";
import { Email as EmailIcon, GitHub as GitHubIcon } from "@mui/icons-material";
import developerPng from "./images/developer.jpg";

const Contact = () => {
  return (
    <Container
      maxWidth="lg"
      sx={{
        display: "flex",
        justifyContent: "center",
        marginTop: 5,
        flexDirection: "column",
        gap: 4,
      }}
    >
      {/* Avatar Section */}
      <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
        <Avatar
          src={developerPng}
          alt="Developer Profile"
          sx={{
            width: 200,
            height: 200,
            borderRadius: "50%",
            boxShadow: 5,
          }}
        />
      </Box>

      {/* Contact Details Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          flexWrap: "wrap",
          gap: 3,
        }}
      >
        {[
          {
            id: "210042111",
            name: "Nabila Islam",
            email: "nabilaislam21@iut-dhaka.edu",
            github: "https://github.com/nabila-sheona",
          },
          {
            id: "210042114",
            name: "Nazifa Tasneem",
            email: "nazifatasneem@iut-dhaka.edu",
            github: "https://github.com/nazifatasneem13",
          },
          {
            id: "210042141",
            name: "Shefayat E Shams Adib",
            email: "shefayatadib@iut-dhaka.edu",
            github: "https://github.com/shefwef",
          },
        ].map((contact, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: 3,
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              boxShadow: 2,
              width: { xs: "100%", sm: "45%", md: "30%" },
              transition: "box-shadow 0.3s ease-in-out",
              "&:hover": { boxShadow: 6 },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#2d2d2d",
                marginBottom: 2,
                textAlign: "center",
              }}
            >
              {contact.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#828282",
                marginBottom: 1,
                fontStyle: "italic",
                textAlign: "center",
              }}
            >
              ID: {contact.id}
            </Typography>

            {/* Email */}
            <Box
              sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}
            >
              <EmailIcon sx={{ color: "#ff7e00", marginRight: 1 }} />
              <Link
                href={`mailto:${contact.email}`}
                underline="hover"
                sx={{
                  color: "#0a74da",
                  fontWeight: "bold",
                  "&:hover": { color: "#003366" },
                }}
              >
                {contact.email}
              </Link>
            </Box>

            {/* GitHub */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <GitHubIcon sx={{ color: "#24292f", marginRight: 1 }} />
              <Link
                href={contact.github}
                underline="hover"
                target="_blank"
                sx={{
                  color: "#24292f",
                  fontWeight: "bold",
                  "&:hover": { color: "#0366d6" },
                }}
              >
                {contact.github.split("https://github.com/")[1]}
              </Link>
            </Box>
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default Contact;
