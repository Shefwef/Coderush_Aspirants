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
  Train as TrainIcon,
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

const Sidebar = ({ title }) => {
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

    const restrictedRoutes = ["/profile", "/services", "/pets", "/mypets"];
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
        width: isCollapsed ? "90px" : "250px",
        height: "100vh",
        backgroundColor: "#002a45",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        zIndex: 1100,
        transition: "width 0.3s ease",
        overflow: "hidden",
      }}
    >
      {/* Toggle Button */}
      <IconButton
        onClick={handleToggle}
        sx={{
          position: "absolute",
          top: 20,
          right: -20,
          backgroundColor: "#002a45",
          color: "#fff",
          zIndex: 15,
        }}
      >
        {isCollapsed ? <ArrowForwardIosIcon /> : <ArrowBackIosIcon />}
      </IconButton>

      {/* Logo */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 2,
          borderBottom: "1px solid #004866",
          height: "100px",
        }}
      >
        <img
          src={logo}
          alt="Logo"
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            cursor: "pointer",
            boxShadow: "0 4px 8px rgba(255, 255, 255, 0.1)",
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
          onClick={() => navigate("/")}
        />
      </Box>

      {/* Navigation Area */}
      <Box
        sx={{
          flex: 1,
          overflowY: isCollapsed ? "hidden" : "auto",
          overflowX: "hidden",
          mt: 1,
          px: 1,
          "&::-webkit-scrollbar": {
            width: isCollapsed ? "0px" : "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#ccc",
            borderRadius: "4px",
          },
        }}
      >
        {currentUser && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              p: 1,
              borderRadius: 2,
              backgroundColor: "#004d6d",
              mb: 2,
            }}
          >
            <Avatar
              src={currentUser.img || ""}
              alt="User"
              sx={{ width: 48, height: 48, mr: 1 }}
              onClick={() => navigate("/profile")}
            />
            {!isCollapsed && (
              <Typography fontWeight="bold">{currentUser.username}</Typography>
            )}
          </Box>
        )}

        {[
          { label: "Home", icon: <HomeIcon />, path: "/" },
          { label: "Wishlist", icon: <WishlistIcon />, path: "/wishlist" },
          { label: "My Pets", icon: <ProfileIcon />, path: "/mypets" },
          {
            label: "Give a Pet",
            icon: <VolunteerActivismIcon />,
            path: "/post-pet",
          },
          { label: "Find Pets", icon: <PetsIcon />, path: "/pets" },
          {
            label: "Train Pets",
            icon: <FitnessCenterIcon />,
            path: "/trainpets",
          },
          { label: "Find Vets", icon: <VetsIcon />, path: "/nearby-vets" },
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
          <Tooltip title={item.label} key={item.label} placement="right">
            <Box
              sx={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                p: 1.5,
                borderRadius: 2,
                mb: 1,
                backgroundColor:
                  location.pathname === item.path ? "#005580" : "#003954",
                "&:hover": {
                  backgroundColor: "#004d6d",
                },
                transition: "all 0.3s ease",
              }}
              onClick={() => handleRestrictedNavigation(item.path)}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: isCollapsed ? "center" : "flex-start",
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    minWidth: isCollapsed ? "auto" : "40px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </Box>
                {!isCollapsed && (
                  <Typography sx={{ ml: 2 }}>{item.label}</Typography>
                )}
              </Box>
            </Box>
          </Tooltip>
        ))}
      </Box>

      {/* Bottom Section */}
      <Box sx={{ p: 1 }}>
        {!currentUser ? (
          <Box
            sx={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              p: 1.5,
              borderRadius: 2,
              backgroundColor: "#004d6d",
              "&:hover": { backgroundColor: "#005d7f" },
              transition: "all 0.3s ease",
            }}
            onClick={handleLogin}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: isCollapsed ? "center" : "flex-start",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  minWidth: isCollapsed ? "auto" : "40px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <LoginIcon />
              </Box>
              {!isCollapsed && <Typography sx={{ ml: 2 }}>Login</Typography>}
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              p: 1.5,
              borderRadius: 2,
              backgroundColor: "#004d6d",
              "&:hover": { backgroundColor: "#005d7f" },
              transition: "all 0.3s ease",
            }}
            onClick={handleLogout}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: isCollapsed ? "center" : "flex-start",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  minWidth: isCollapsed ? "auto" : "40px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <LogoutIcon />
              </Box>
              {!isCollapsed && <Typography sx={{ ml: 2 }}>Logout</Typography>}
            </Box>
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
