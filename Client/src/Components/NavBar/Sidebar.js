import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  IconButton,
  Typography,
  Avatar,
  Snackbar,
  Tooltip,
} from "@mui/material";
import {
  Home as HomeIcon,
  Pets as PetsIcon,
  LocalHospital as VetsIcon,
  Favorite as WishlistIcon,
  Logout as LogoutIcon,
  Login as LoginIcon,
  AccountCircle as ProfileIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
  ArrowBackIos as ArrowBackIosIcon,
  Storefront as StorefrontIcon,
  AddCircleOutline as AddCircleOutlineIcon,
} from "@mui/icons-material";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import MessageModal from "../MessageModal/MessageModal";
import logo from "./images/logo.png";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser"))
  );
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  const handleToggle = () => setIsCollapsed(!isCollapsed);

  const closeModal = () => {
    setIsModalOpen(false);
    navigate("/login");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    navigate("/login");
  };

  const handleLogin = () => navigate("/login");

  const handleRestrictedNavigation = (path) => {
    if (currentUser) {
      navigate(path);
    } else {
      setIsModalOpen(true);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));

    const restrictedRoutes = ["/profile", "/services", "/pets", "/myproducts"];
    const isRestrictedRoute = restrictedRoutes.includes(location.pathname);

    if (isRestrictedRoute && (!token || !storedUser)) {
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
      setCurrentUser(null);
      navigate("/login");
    } else {
      setCurrentUser(storedUser);
    }
  }, [location, navigate]);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: isCollapsed ? "80px" : "250px",
        height: "100vh",
        backgroundColor: "#002a45",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        zIndex: 1100,
        transition: "all 0.3s ease",
        boxShadow: "4px 0 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <IconButton
        onClick={handleToggle}
        sx={{
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          right: -12,
          backgroundColor: "#002a45",
          color: "#fff",
          zIndex: 15,
          width: "24px",
          height: "64px",
          borderRadius: "0 8px 8px 0",
          "&:hover": {
            backgroundColor: "#003954",
          },
          boxShadow: "4px 0 8px rgba(0, 0, 0, 0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isCollapsed ? (
          <ArrowForwardIosIcon sx={{ fontSize: 14 }} />
        ) : (
          <ArrowBackIosIcon sx={{ fontSize: 14 }} />
        )}
      </IconButton>

      <Box sx={{ height: "100%", overflow: "auto" }}>
        <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
          <img
            src={logo}
            alt="Logo"
            style={{
              width: isCollapsed ? "44px" : "60px",
              height: isCollapsed ? "44px" : "60px",
              borderRadius: "50%",
              cursor: "pointer",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              border: "2px solid rgba(255, 255, 255, 0.1)",
            }}
            onClick={() => navigate("/")}
          />
        </Box>

        {currentUser && (
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <Avatar
              src={currentUser.img || ""}
              alt="User"
              sx={{ width: 36, height: 36 }}
            />
          </Box>
        )}

        {[
          { label: "Home", icon: <HomeIcon />, path: "/" },
          { label: "Wishlist", icon: <WishlistIcon />, path: "/wishlist" },
          { label: "My Products", icon: <ProfileIcon />, path: "/myproducts" },
          {
            label: "Browse Listings",
            icon: <StorefrontIcon />,
            path: "/listings",
          },
          {
            label: "Create Listing",
            icon: <AddCircleOutlineIcon />,
            path: "/listings/create",
          },
        ].map((item) => (
          <Tooltip
            title={isCollapsed ? item.label : ""}
            key={item.label}
            placement="right"
          >
            <Box
              sx={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: isCollapsed ? "center" : "flex-start",
                p: 1.5,
                borderRadius: 2,
                mb: 0.5,
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                },
              }}
              onClick={() => handleRestrictedNavigation(item.path)}
            >
              {item.icon}
              {!isCollapsed && (
                <Typography sx={{ ml: 1.5 }}>{item.label}</Typography>
              )}
            </Box>
          </Tooltip>
        ))}
      </Box>

      <Box sx={{ p: 2 }}>
        {!currentUser ? (
          <Box
            onClick={handleLogin}
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          >
            <LoginIcon />
            {!isCollapsed && <Typography sx={{ ml: 1 }}>Login</Typography>}
          </Box>
        ) : (
          <Box
            onClick={handleLogout}
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          >
            <LogoutIcon />
            {!isCollapsed && <Typography sx={{ ml: 1 }}>Logout</Typography>}
          </Box>
        )}
      </Box>

      <Snackbar
        open={openSnackbar}
        message="Please log in to access this page"
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      />
      <MessageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        message="You have to log in to access this feature."
      />
    </Box>
  );
};

export default Sidebar;
