import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Collapse,
  Card,
  CardContent,
  IconButton,
  Grid,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { Heart, HelpCircle, Home } from "lucide-react";
import listProductsImage from "./images/product-image.png";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const ListProductsSection = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <Box
      sx={{
        marginLeft: "7%",
        maxWidth: "auto",
        margin: "4rem",
        padding: "4rem",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: 3,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            mb: 3,
            color: "#121858",
          }}
        >
          List Your Products!
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: "center", marginBottom: "1rem" }}
      >
        <img
          src={listProductsImage}
          sx={{
            width: "100%",
            maxWidth: "400px",
            borderRadius: "5%",
            cursor: "pointer",
            objectFit: "cover",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          }}
          alt="List Your Products"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Typography
          variant="body1"
          sx={{ mb: 3, textAlign: "center", color: "#555" }}
        >
          Selling your used products can be a great way to earn extra money,
          help others, and give your items a second life. Whether you're a
          student or just looking to declutter, listing your products can
          benefit both you and potential buyers.
        </Typography>
      </motion.div>

      {/* Questions Section */}
      <Grid container spacing={3}>
        {/* Why Sell Your Old Products */}
        <Grid item xs={12} md={4}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Card
              sx={{
                backgroundColor: "#ffffff",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => toggleSection("whySell")}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Heart color="#121858" />
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      Why Sell Your Old Products?
                    </Typography>
                  </Box>
                  <IconButton>
                    {openSection === "whySell" ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )}
                  </IconButton>
                </Box>
                <Collapse in={openSection === "whySell"}>
                  <Box sx={{ mt: 2, color: "#555" }}>
                    <ul>
                      <li>
                        Provide affordable, reliable products for others who
                        can't afford new items.
                      </li>
                      <li>
                        Help the environment by reducing waste and giving items
                        a second life.
                      </li>
                      <li>Earn extra money by selling unused products.</li>
                    </ul>
                  </Box>
                </Collapse>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* How to List Your Products */}
        <Grid item xs={12} md={4}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Card
              sx={{
                backgroundColor: "#ffffff",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => toggleSection("howToList")}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <HelpCircle color="#121858" />
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      How to List Your Products
                    </Typography>
                  </Box>
                  <IconButton>
                    {openSection === "howToList" ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )}
                  </IconButton>
                </Box>
                <Collapse in={openSection === "howToList"}>
                  <Box sx={{ mt: 2, color: "#555" }}>
                    <ol>
                      <li>Take clear photos of the product you're selling.</li>
                      <li>Write a detailed and honest description.</li>
                      <li>
                        Set a reasonable price based on the product's condition.
                      </li>
                    </ol>
                  </Box>
                </Collapse>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Benefits of Listing Used Products */}
        <Grid item xs={12} md={4}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Card
              sx={{
                backgroundColor: "#ffffff",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => toggleSection("productBenefits")}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Home color="#121858" />
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      Benefits of Listing Used Products
                    </Typography>
                  </Box>
                  <IconButton>
                    {openSection === "productBenefits" ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )}
                  </IconButton>
                </Box>
                <Collapse in={openSection === "productBenefits"}>
                  <Box sx={{ mt: 2, color: "#555" }}>
                    <Typography variant="body1">
                      Listing your used products allows you to declutter your
                      home, make extra money, and provide others with affordable
                      products they may need. Plus, you can help the environment
                      by promoting sustainability!
                    </Typography>
                  </Box>
                </Collapse>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Find Your Perfect Buyer Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        style={{ textAlign: "center", marginTop: "3rem" }}
      >
        <Link to="/listings" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={scrollToTop}
            sx={{
              padding: "12px 30px", 
              fontWeight: "bold",
              fontSize: "1.1rem", 
              background: "linear-gradient(45deg, #121858 30%, #474f97 90%)", 
              borderRadius: "50px", 
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)", 
              textTransform: "none", 
              transition: "all 0.3s ease", 
              "&:hover": {
                background: "linear-gradient(45deg, #474f97 30%, #121858 90%)", 
                boxShadow: "0 6px 18px rgba(0, 0, 0, 0.2)", 
                transform: "scale(1.05)", 
              },
            }}
          >
            Find Your Perfect Buyer
          </Button>
        </Link>
      </motion.div>
    </Box>
  );
};

export default ListProductsSection;
