import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  IconButton,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StorefrontIcon from "@mui/icons-material/Storefront";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import HeroImage from "./images/marketplace-hero.jpg";
import textbooksImg from "./images/textbooks.jpg";
import gadgetsImg from "./images/gadgets.jpg";
import bikesImg from "./images/bikes.jpeg";
import tutoringImg from "./images/tutoring.jpg";
import skillswapImg from "./images/skillswap.jpeg";

const SIDEBAR_WIDTH = 72;

const categories = [
  { title: "Books", img: textbooksImg },
  { title: "Electronics", img: gadgetsImg },
  { title: "Tutoring", img: tutoringImg },
  { title: "Skill Exchange", img: skillswapImg },
  { title: "Others", img: bikesImg },
];

export default function Home() {
  const [scrollToTopVisible, setScrollToTopVisible] = useState(false);

  // Scroll effect
  const handleScroll = () =>
    window.scrollBy({ top: window.innerHeight * 0.7, behavior: "smooth" });

  // Detecting scroll position
  const checkScrollPosition = () => {
    if (window.scrollY > 500) {
      setScrollToTopVisible(true);
    } else {
      setScrollToTopVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", checkScrollPosition);
    return () => {
      window.removeEventListener("scroll", checkScrollPosition);
    };
  }, []);

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box sx={{ ml: `${SIDEBAR_WIDTH}px` }}>
      {/* Hero Section */}
      <Box
        component="section"
        sx={{
          position: "relative",
          height: { xs: "50vh", md: "65vh" },
          backgroundImage: `url(${HeroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          pt: { xs: 8, md: 10 },
        }}
      >
        <Box
          sx={{ position: "absolute", inset: 0, bgcolor: "rgba(0,0,0,0.35)" }}
        />
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            maxWidth: 600,
            px: { xs: 2, md: 5 },
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            color="common.white"
            gutterBottom
            sx={{
              fontWeight: 700,
              fontSize: { xs: "2rem", md: "3rem" },
              lineHeight: 1.15,
              letterSpacing: "0.02em",
              textShadow: "2px 2px 8px rgba(0,0,0,0.7)",
            }}
          >
            Campus Marketplace, Simplified
          </Typography>

          <Typography
            variant="subtitle1"
            color="common.white"
            sx={{
              opacity: 0.95,
              mb: 4,
              lineHeight: 1.6,
              letterSpacing: "0.005em",
              textShadow: "1px 1px 6px rgba(0,0,0,0.6)",
            }}
          >
            Buy budget-friendly textbooks, gadgets, bikes—or sell your own items
            safely to fellow students within your campus network.
          </Typography>

          {/* Buttons */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: { xs: "100%", sm: 300 },
            }}
          >
            <Button
              variant="contained"
              startIcon={<ShoppingCartIcon />}
              size="large"
              fullWidth
              sx={{
                bgcolor: "primary.main",
                borderRadius: "999px",
                height: 48,
                fontWeight: 600,
                "&:hover": { bgcolor: "primary.dark" },
              }}
              onClick={() => (window.location.href = "/listings")}
            >
              Buy a Product
            </Button>
            <Button
              variant="outlined"
              startIcon={<StorefrontIcon />}
              size="large"
              fullWidth
              sx={{
                borderRadius: "999px",
                height: 48,
                color: "primary.main",
                borderColor: "primary.main",
                backgroundColor: "#fff",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "#F0F0F0",
                  borderColor: "#E0E0E0",
                },
              }}
              onClick={() => (window.location.href = "/listings/create")}
            >
              Sell a Product
            </Button>
          </Box>
        </Box>

        {/* Scroll-down arrow */}
        <IconButton
          onClick={handleScroll}
          sx={{
            position: "absolute",
            bottom: 16,
            right: 16,
            bgcolor: "#ffd500",
            "&:hover": { bgcolor: "#e6c800" },
            color: "common.black",
            width: 56,
            height: 56,
            borderRadius: "50%",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          <KeyboardArrowDownIcon fontSize="large" />
        </IconButton>
      </Box>

      {/* Categories Section */}
      <Box
        component="section"
        sx={{ py: 6, px: 2, maxWidth: 1200, mx: "auto" }}
      >
        <Typography variant="h4" fontWeight="700" gutterBottom>
          Categories
        </Typography>
        <Grid container spacing={4}>
          {categories.map(({ title, img }) => (
            <Grid key={title} item xs={12} sm={6} md={4} lg={3}>
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: 3,
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "scale(1.03)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardActionArea
                  onClick={() =>
                    (window.location.href = `/listings?category=${title.toLowerCase()}`)
                  }
                >
                  <CardMedia
                    component="img"
                    image={img}
                    alt={title}
                    sx={{ height: 180, objectFit: "cover" }}
                  />
                  <CardContent>
                    <Typography variant="h6" fontWeight="600">
                      {title}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Scroll-to-top button */}
      {scrollToTopVisible && (
        <IconButton
          onClick={scrollToTop}
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            bgcolor: "#ffd500",
            color: "common.black",
            width: 56,
            height: 56,
            borderRadius: "50%",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            zIndex: 1000,
            "&:hover": { bgcolor: "#e6c800" },
          }}
        >
          <KeyboardArrowUpIcon fontSize="large" />
        </IconButton>
      )}
    </Box>
  );
}
