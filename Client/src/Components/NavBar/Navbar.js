import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  Avatar,
  Box,
  Badge,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { Notifications, Chat } from "@mui/icons-material";
import NotificationsPage from "../NotificationPanel/NotificationsPage";
import MessageModal from "../MessageModal/MessageModal";
import axios from "axios";

const Navbar = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser"))
  );
  const [notifications, setNotifications] = useState([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:4000/notifications/notifications/unread",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUnreadCount(response.data.unreadCount || 0);
    } catch (err) {
      console.error("Error fetching unread count:", err);
    }
  };

  const fetchAndMarkNotificationsAsRead = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://localhost:4000/notifications/notifications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications(response.data);

      await axios.put(
        "http://localhost:4000/notifications/notifications/read",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUnreadCount(0);
    } catch (err) {
      console.error("Error handling notifications:", err);
    }
  };

  const handleToggleNotifications = () => {
    setIsNotificationOpen((prev) => !prev);
    if (!isNotificationOpen) {
      fetchAndMarkNotificationsAsRead();
    }
  };

  const handleRestrictedNavigation = (path) => {
    if (currentUser) {
      navigate(path);
    } else {
      setIsModalOpen(true);
    }
  };

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

  useEffect(() => {
    fetchUnreadCount();
    const validateUser = () => {
      const token = localStorage.getItem("token");
      const storedUser = JSON.parse(localStorage.getItem("currentUser"));

      const restrictedRoutes = ["/profile", "/services", "/pets"];
      const isRestrictedRoute = restrictedRoutes.includes(location.pathname);

      if (isRestrictedRoute && (!token || !storedUser)) {
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
        setCurrentUser(null);
        navigate("/login");
      } else {
        setCurrentUser(storedUser);
      }
    };

    validateUser();
  }, [location, navigate]);

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#fff",
          color: "#000",
          padding: "10px 20px",
          boxShadow: "none",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Title instead of logo */}
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                marginLeft: "50px",
                color: "#19275c",
              }}
            >
              CAMPUS-BUY
            </Typography>
          </Link>

          {/* Navigation Links */}
          <Box display="flex" gap={2} alignItems="center">
            {[
              { label: "Home", path: "/" },
              { label: "Services", path: "/services" },
              { label: "News", path: "/news" },
              { label: "Contact", path: "/contact" },
            ].map((link) => (
              <Button
                key={link.path}
                variant="text"
                sx={{
                  textTransform: "capitalize",
                  backgroundColor:
                    location.pathname === link.path ? "#19275c" : "transparent",
                  color: location.pathname === link.path ? "#fff" : "#000",
                  borderRadius: "20px",
                  padding: "5px 15px",
                  "&:hover": {
                    backgroundColor: "#19275c",
                    color: "#fff",
                  },
                }}
                onClick={() =>
                  [
                    "/services",
                    "/pets",
                    "/profile",
                    "/news",
                    "/communication",
                  ].includes(link.path)
                    ? handleRestrictedNavigation(link.path)
                    : navigate(link.path)
                }
              >
                {link.label}
              </Button>
            ))}
          </Box>

          {/* Right side: profile, chat, notifications */}
          <Box display="flex" alignItems="center" gap={2}>
            {currentUser ? (
              <Avatar
                src={currentUser.img || ""}
                alt={currentUser.username || "User"}
                sx={{
                  width: "40px",
                  height: "40px",
                  border: "2px solid #19275c",
                  cursor: "pointer",
                }}
                onClick={() => navigate("/profile")}
              />
            ) : (
              <Button
                variant="outlined"
                sx={{
                  borderRadius: "20px",
                  borderColor: "#19275c",
                  color: "#19275c",
                  "&:hover": {
                    backgroundColor: "#19275c",
                    color: "#fff",
                  },
                }}
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            )}

            <Tooltip title="Chats">
              <IconButton onClick={() => navigate("/communication")}>
                <Chat />
              </IconButton>
            </Tooltip>

            <Tooltip title="Notifications">
              <IconButton onClick={handleToggleNotifications}>
                <Badge badgeContent={unreadCount} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>

        <MessageModal
          isOpen={isModalOpen}
          onClose={closeModal}
          message="You have to log in to access this feature."
        />
      </AppBar>

      {/* Floating Notifications Panel */}
      {isNotificationOpen && (
        <NotificationsPage
          notifications={notifications}
          onClose={handleToggleNotifications}
        />
      )}

      {/* Children if any */}
      {children && <Box>{React.cloneElement(children, { currentUser })}</Box>}
    </>
  );
};

export default Navbar;
