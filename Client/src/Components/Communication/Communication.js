import React, { useState, useEffect, useCallback } from "react";
import CampusMap from "../Map/CampusMap.jsx";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import BlockIcon from "@mui/icons-material/Block";
import CloseOutlinedIcon from "@mui/icons-material/Close";
import ProfileModal from "./ProfileModal";

import axios from "axios";

const Communication = () => {
  const [sellerChats, setsellerChats] = useState([]);
  const [buyerChats, setbuyerChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [mapDialogOpen, setMapDialogOpen] = useState(false);
  const [imageInput, setImageInput] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // Handle sending image message
  const handleSendImage = async () => {
    if (!imageInput) {
      alert("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("image", imageInput); // Append the selected image
    formData.append("chatId", selectedChat.chatId); // Add chatId
    formData.append("senderId", currentUser._id); // Add senderId
    formData.append("content", "Shared an image"); // Add content text

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:4000/chats/messages/image",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData, // Send formData with image
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send image");
      }

      const newMessage = await response.json();
      setMessages((prev) => [...prev, newMessage]); // Update state with new message
      setImageInput(null); // Reset image input state
    } catch (error) {
      console.error("Send Image Error:", error);
      alert("Failed to send image. Please try again.");
    }
  };

  // Handle image input change
  const handleImageChange = (e) => {
    setImageInput(e.target.files[0]);
  };

  // Function to open map dialog
  const openMapDialog = () => setMapDialogOpen(true);
  const closeMapDialog = () => setMapDialogOpen(false);

  const [isChatOpen, setIsChatOpen] = useState(false); // New state for chat open/close

  // Handle selecting a chat
  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setIsChatOpen(true); // Open the chat when selected
  };

  // Handle closing the chat
  const handleCloseChat = () => {
    setSelectedChat(null);
    setIsChatOpen(false);
  };

  // Function to send location message
  const handleSendLocation = async (location) => {
    if (!selectedChat) {
      alert("Please select a chat first.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4000/chats/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          chatId: selectedChat.chatId,
          senderId: currentUser._id,
          content: "Shared a meetup location", // <-- non-empty text to satisfy schema
          location: location, // { lat, lng }
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send location");
      }
      console.log("Sending location:", location);

      const newMessage = await response.json();
      setMessages((prev) => [...prev, newMessage]);
    } catch (error) {
      console.error("Send Location Error:", error);
      alert("Failed to send meetup location. Please try again.");
    }
  };

  //review
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");
  //profile modal
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [archiveModalOpen, setarchiveModalOpen] = useState(false);
  const [archiveData, setarchiveData] = useState({});

  // Fetch profile data and open modal
  const handleOpenProfile = async (email) => {
    console.log("Email sent to backend:", email); // Debug log

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:4000/profile/getuserprofile/profile`,
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfileData(response.data);
      setProfileModalOpen(true);
    } catch (error) {
      console.error("Error fetching profile data:", error);
      if (error.response && error.response.status === 404) {
        alert("User profile not found.");
      } else {
        alert("An error occurred while fetching the profile.");
      }
    }
  };

  const handleCloseProfile = () => {
    setProfileModalOpen(false);
    setProfileData({});
  };
  const handleOpenArchive = async () => {
    setarchiveModalOpen(true);
  };
  const handleCloseArchive = () => {
    setarchiveModalOpen(false);
  };
  // Function to handle opening the review dialog
  const openReviewDialog = (status) => {
    setCurrentStatus(status);
    setReviewDialogOpen(true);
  };

  // Function to handle submitting the review
  const submitReview = async () => {
    if (reviewText.trim()) {
      await handleStatusUpdate(currentStatus, reviewText.trim()); // Include reviewText in the status update
    }
    setReviewDialogOpen(false);
    setReviewText("");
  };

  // Fetch seller and buyer chat lists and messages
  const fetchChatsAndMessages = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      // Fetch seller chats
      const sellerResponse = await fetch(
        `http://localhost:4000/chats/seller-chat-list/${currentUser._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const sellerData = await sellerResponse.json();
      setsellerChats(sellerData || []);

      // Fetch buyer chats
      const buyerResponse = await fetch(
        `http://localhost:4000/chats/buyer-chat-list/${currentUser._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const buyerData = await buyerResponse.json();
      setbuyerChats(buyerData || []);

      // Fetch messages if a chat is selected
      if (selectedChat) {
        const response = await fetch(
          `http://localhost:4000/messages/${selectedChat.chatId}?userId=${currentUser._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.status === 403) {
          alert("You have been blocked by this user.");
          setSelectedChat(null);
          return;
        }
        const messagesData = await response.json();
        setMessages(messagesData || []);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  }, [currentUser._id, selectedChat]);

  // Fetch chats and messages initially and every 5 seconds
  useEffect(() => {
    fetchChatsAndMessages(); // Initial fetch

    const intervalId = setInterval(() => {
      fetchChatsAndMessages(); // Fetch every 5 seconds
    }, 5000);

    // Cleanup interval on component unmount or selectedChat change
    return () => clearInterval(intervalId);
  }, [fetchChatsAndMessages]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4000/chats/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          chatId: selectedChat.chatId,
          senderId: currentUser._id,
          content: messageInput,
        }),
      });

      const newMessage = await response.json();
      setMessages((prev) => [...prev, newMessage]);
      setMessageInput("");
    } catch (error) {
      console.error("Send Message Error:", error);
    }
  };

  // Handle status updates (including blocking)
  const handleStatusUpdate = async (status, review = "") => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:4000/chats/update-status`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            chatId: selectedChat.chatId,
            productId: selectedChat.productId,
            status,
            userId: currentUser._id, // Pass userId in the request body
            review: review, // Ensure review is passed
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        window.location.reload();
      }
    } catch (error) {
      console.error("Update Status Error:", error);
    }
  };

  // Handle blocking a user (Only for buyers)
  const handleBlockUser = async () => {
    if (!selectedChat) return;

    const confirmBlock = window.confirm(
      `Are you sure you want to block ${selectedChat.email}? This action cannot be undone.`
    );
    if (!confirmBlock) return;

    await handleStatusUpdate("blocked");
    window.location.reload();
  };

  // Determine if the current user is the buyer in the selected chat
  const isbuyer =
    selectedChat &&
    buyerChats.some((chat) => chat.chatId === selectedChat.chatId);

  return (
    <Box sx={{ display: "flex", maxHeight: "auto", marginLeft: "3%" }}>
      <Box
        sx={{
          width: "25%",
          borderRight: "1px solid #ddd",
          padding: 2,
          bgcolor: "background.paper", // Adds a neutral background color
          height: "100vh", // Full height container
          overflowY: "auto", // Enables scrolling
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            marginBottom: 2,
            color: "primary.main", // Highlight section titles
          }}
        >
          Chats
        </Typography>

        {/* Chat with Donator */}
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "medium", color: "secondary.main", mb: 1 }}
        >
          Chat with Buyer
        </Typography>
        <List sx={{ mb: 2 }}>
          {sellerChats.map((chat) => (
            <ListItem
              key={chat.chatId}
              button
              onClick={() => handleChatSelect(chat)}
              selected={selectedChat?.chatId === chat.chatId}
              sx={{
                "&.Mui-selected": {
                  bgcolor: "primary.light", // Selected item highlight
                  color: "primary.contrastText",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                },
                "&:hover": {
                  bgcolor: "action.hover", // Hover effect
                },
              }}
            >
              <Avatar sx={{ marginRight: 2, bgcolor: "secondary.light" }}>
                {chat.name ? chat.name[0] : "A"}
              </Avatar>
              <ListItemText
                primary={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {chat.email || "Unknown"}
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        bgcolor: "info.main",
                        borderRadius: "50%",
                        marginLeft: 1,
                        boxShadow: 1, // Adds a subtle shadow
                      }}
                      title="seller"
                    />
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
        <Divider />

        {/* Chat with sellers */}
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "medium", color: "secondary.main", mt: 2, mb: 1 }}
        >
          Chat with Seller
        </Typography>
        <List>
          {buyerChats.map((chat) => (
            <ListItem
              key={chat.chatId}
              button
              onClick={() => handleChatSelect(chat)}
              selected={selectedChat?.chatId === chat.chatId}
              sx={{
                "&.Mui-selected": {
                  bgcolor: "primary.light",
                  color: "primary.contrastText",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                },
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              <Avatar sx={{ marginRight: 2, bgcolor: "secondary.light" }}>
                {chat.name ? chat.name[0] : "D"}
              </Avatar>
              <ListItemText
                primary={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {chat.email || "Unknown"}
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        bgcolor: "info.main",
                        borderRadius: "50%",
                        marginLeft: 1,
                        boxShadow: 1,
                      }}
                      title="buyer"
                    />
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
        <Divider />

        {/* Archived Chats */}
        <Typography
          variant="subtitle1"
          sx={{
            marginTop: 8,
            padding: 2,
            cursor: "pointer",
            color: "primary.main",
            "&:hover": {
              textDecoration: "underline", // Adds interactivity on hover
            },
          }}
          onClick={() => handleOpenArchive()}
        >
          Archived Chats
        </Typography>
      </Box>

      {/* Chat Area */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          maxHeight: "750px",
        }}
      >
        {selectedChat ? (
          <>
            <Box
              sx={{
                padding: 2,

                gap: "18px",
                bgcolor: "background.default",
                color: "text.primary",
                display: "flex", // Set the display to flex to align children horizontally
                alignItems: "center", // Align items vertically in the center
                justifyContent: "space-around", // Distribute extra space between the elements
              }}
            >
              {/* User Email and Status Indicator */}
              <Box
                sx={{
                  flexGrow: 1, // Allows this box to grow and use available space
                  p: 2,
                  borderRadius: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: "#e3f2fd", // Light blue background
                  transition: "background-color 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#bbdefb", // Darker shade of blue on hover
                  },
                }}
                onClick={() => handleOpenProfile(selectedChat.email)}
                role="button"
              >
                <Typography
                  variant="h6"
                  sx={{ flexGrow: 1, cursor: "pointer" }}
                >
                  {selectedChat.email}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    maxWidth: "30%",
                    width: 15,
                    height: 15,
                    borderRadius: "50%",
                    transition: "transform 0.3s ease",
                    bgcolor: sellerChats.some(
                      (chat) => chat.chatId === selectedChat.chatId
                    )
                      ? "#81c784" // Green for sellers
                      : "#ffb74d", // Orange for buyers
                    "&:hover": {
                      transform: "scale(1.2)",
                    },
                  }}
                  title={
                    sellerChats.some(
                      (chat) => chat.chatId === selectedChat.chatId
                    )
                      ? "seller"
                      : "buyer"
                  }
                />
              </Box>

              {/* Action Buttons and Status Update */}
              <Box
                sx={{
                  flexGrow: 1, // Allows this box to grow more than the email/status box
                  p: 2,
                  maxWidth: "40%",
                  borderRadius: 4,

                  display: "flex",
                  gap: 4,
                  justifyContent: "space-evenly",
                  backgroundColor: "#e3f2fd", // Light yellow background for container
                  transition: "background-color 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#bbdefb", // Darker shade of blue on hover
                  },
                }}
              >
                {/* Conditional Buttons for Actions */}
                {buyerChats.some(
                  (chat) =>
                    chat.chatId === selectedChat.chatId &&
                    chat.status === "active" &&
                    selectedChat.status !== "sent"
                ) && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => openReviewDialog("sent")}
                    sx={{
                      backgroundColor: "#64b5f6", // Light blue button
                      transition: "background-color 0.3s, transform 0.3s",
                      "&:hover": {
                        backgroundColor: "#42a5f5", // Darker blue on hover
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    Mark as Sent
                  </Button>
                )}

                {sellerChats.some(
                  (chat) => chat.chatId === selectedChat.chatId
                ) &&
                  selectedChat.status === "sent" && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => openReviewDialog("delivered")}
                      sx={{
                        backgroundColor: "#4caf50",
                        transition: "background-color 0.3s, transform 0.3s",
                        "&:hover": {
                          backgroundColor: "#388e3c", // Darker green on hover
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      Mark as Delivered
                    </Button>
                  )}

                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleStatusUpdate("passive")}
                  sx={{
                    backgroundColor: "#e57373",
                    transition: "background-color 0.3s, transform 0.3s",
                    "&:hover": {
                      backgroundColor: "#ef5350", // Darker red on hover
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  Cancel
                </Button>

                {/* Block Button (Only for buyers) */}
                {isbuyer && (
                  <Tooltip title="Block User" placement="top">
                    <IconButton
                      sx={{
                        color: "#f44336", // Red icon
                        transition: "color 0.3s, transform 0.3s",
                        "&:hover": {
                          color: "#d32f2f", // Darker red on hover
                          transform: "rotate(90deg)",
                        },
                      }}
                      onClick={handleBlockUser}
                    >
                      <BlockIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>

              <Box
                variant="outlined"
                sx={{
                  flexGrow: 1, // Allows this box to grow more than the email/status box
                  p: 2,

                  borderRadius: 4,
                  maxWidth: "07%",
                  display: "10%",
                  gap: 4,
                  justifyContent: "center",
                  backgroundColor: "#e3f2fd",
                  transition: "background-color 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#bbdefb", // Darker shade of blue on hover
                  },
                }}
              >
                <Button
                  onClick={handleCloseChat}
                  sx={{ color: "gray", maxHeight: "flex" }}
                >
                  <CloseOutlinedIcon />
                </Button>
              </Box>
            </Box>

            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                padding: 2,
                backgroundColor: "#f5f5f5", // Soft background color for contrast
                minHeight: "40vh",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)", // Adds subtle shadow for depth
              }}
            >
              {messages.map((message) => {
                console.log("Rendering message:", message); // Debug print to check message data
                return (
                  <Box
                    key={message._id || message.tempId}
                    sx={{
                      display: "flex",
                      justifyContent:
                        message.senderId === currentUser._id
                          ? "flex-end"
                          : "flex-start",
                      marginBottom: 1,
                    }}
                  >
                    <Paper
                      elevation={2}
                      sx={{
                        padding: "0.8rem",
                        maxWidth: "60%",
                        backgroundColor:
                          message.senderId === currentUser._id
                            ? "#e3f2fd"
                            : "white",
                        borderRadius: "12px",
                        position: "relative",
                      }}
                    >
                      {message.content && (
                        <Typography
                          variant="body1"
                          sx={{ wordWrap: "break-word", fontSize: "16px" }}
                        >
                          {message.content}
                        </Typography>
                      )}

                      {message.imageUrl && (
                        <Box sx={{ mt: 1 }}>
                          <img
                            src={`http://localhost:4000${message.imageUrl}`}
                            alt="shared image"
                            style={{ maxWidth: "100%", borderRadius: "8px" }}
                          />
                        </Box>
                      )}

                      {message.location &&
                        typeof message.location === "object" && (
                          <Box sx={{ mt: 1 }}>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: "bold", marginBottom: 0.5 }}
                            >
                              Shared a meetup location:
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ marginBottom: 0.5 }}
                            >
                              Latitude: {message.location.lat.toFixed(5)},
                              Longitude: {message.location.lng.toFixed(5)}
                            </Typography>
                            <a
                              href={`https://www.google.com/maps?q=${message.location.lat},${message.location.lng}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: "#1976d2",
                                textDecoration: "underline",
                              }}
                            >
                              📍 View on Map
                            </a>
                          </Box>
                        )}

                      {/* Timestamp */}
                      {message.createdAt && (
                        <Typography
                          variant="caption"
                          sx={{
                            display: "block",
                            marginTop: "4px",
                            color: "gray",
                            fontSize: "0.75rem",
                            textAlign: "right",
                          }}
                        >
                          {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </Typography>
                      )}
                    </Paper>
                  </Box>
                );
              })}
            </Box>

            <Box
              sx={{
                borderTop: "1px solid #e0e0e0", // Lighter and softer border color
                padding: 2,
                display: "flex",
                alignItems: "center",
                gap: 2,
                maxHeight: "auto",
                backgroundColor: "white",
              }}
            >
              <TextField
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                fullWidth
                placeholder="Type your message..."
                variant="outlined"
                multiline
                maxRows={4}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px", // Rounded corners for a modern look
                    "& fieldset": {
                      borderColor: "#ccc", // Lighter border color for the text field
                    },
                    "&:hover fieldset": {
                      borderColor: "#b0bec5", // Hover effect with a slightly darker border
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#64b5f6", // Highlight color when the text field is focused
                    },
                  },
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button
                onClick={handleSendMessage}
                variant="contained"
                color="primary"
                sx={{
                  height: "fit-content",
                  px: 3, // Horizontal padding for a wider button appearance
                  py: 1, // Vertical padding to increase the height slightly
                  borderRadius: "8px", // Rounded corners for a modern look
                  boxShadow: "0 3px 5px rgba(0,0,0,0.2)", // Updated shadow for a subtle lift effect
                  textTransform: "none", // Prevent uppercase transform to keep text styling neutral
                  fontSize: "1rem", // Larger font size for better readability
                  fontWeight: "medium", // Medium weight for button text
                  letterSpacing: "0.5px", // Slightly spaced characters for better readability
                  transition: "background-color 0.2s, box-shadow 0.2s", // Smooth transitions for background and shadow
                  "&:hover": {
                    backgroundColor: "#1976d2", // Slightly darker shade on hover for the button
                    boxShadow: "0 4px 8px rgba(0,0,0,0.25)", // Deeper shadow on hover for a "lifted" effect
                  },
                  "&:active": {
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)", // Less pronounced shadow when the button is clicked
                  },
                }}
              >
                Send
              </Button>
              {/* --- Move the Meetup Location Button here, outside dialog actions --- */}
              <Button variant="outlined" onClick={openMapDialog} sx={{ ml: 1 }}>
                📍 Share Meetup Location
              </Button>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
                id="image-upload"
              />
              <label htmlFor="image-upload">
                <Button variant="outlined" component="span" sx={{ mr: 2 }}>
                  📸 Upload Image
                </Button>
              </label>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSendImage}
                disabled={!imageInput} // Disable button if no image is selected
              >
                Send Image
              </Button>
            </Box>

            {/* Map Dialog */}
            <Dialog
              open={mapDialogOpen}
              onClose={closeMapDialog}
              fullWidth
              maxWidth="sm"
            >
              <DialogTitle>Select Meetup Location</DialogTitle>
              <DialogContent>
                <CampusMap
                  onSelectLocation={(location) => {
                    handleSendLocation(location);
                    closeMapDialog();
                  }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={closeMapDialog}>Cancel</Button>
              </DialogActions>
            </Dialog>
          </>
        ) : (
          <Typography variant="h6" sx={{ textAlign: "center", marginTop: 5 }}>
            Select a chat to start messaging
          </Typography>
        )}
      </Box>

      {/* Review Dialog */}
      <Dialog
        open={reviewDialogOpen}
        onClose={() => setReviewDialogOpen(false)}
        maxWidth="sm"
        fullWidth={true}
        sx={{
          "& .MuiDialog-paper": {
            // Styling the dialog box itself
            borderRadius: "8px", // Rounded corners for a softer appearance
            padding: "19px", // Padding around the dialog content
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)", // More pronounced shadow for a pop-out effect
          },
        }}
      >
        <DialogTitle sx={{ fontSize: "1.25rem", fontWeight: "bold" }}>
          Write a Review
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            multiline
            rows={5}
            fullWidth
            variant="outlined"
            placeholder="Write your review here (max 200 words)"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            inputProps={{ maxLength: 300 }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px", // Matching rounded corners
                "& fieldset": {
                  borderColor: "#ccc", // Neutral, soft border color
                },
                "&:hover fieldset": {
                  borderColor: "#b0bec5", // Slightly darker on hover
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#64b5f6", // Highlight color when focused
                },
              },
            }}
          />
        </DialogContent>

        <DialogActions
          sx={{ justifyContent: "space-between", padding: "8px 16px" }}
        >
          <Button
            onClick={() => setReviewDialogOpen(false)}
            sx={{
              color: "grey", // Subtle color for cancel to de-emphasize
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)", // Very light grey on hover for minimal interaction feedback
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={submitReview}
            variant="contained"
            color="primary"
            sx={{
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)", // Shadow for depth
              "&:hover": {
                backgroundColor: "#1976d2", // A darker blue on hover for better feedback
              },
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <ProfileModal
        open={profileModalOpen}
        onClose={handleCloseProfile}
        profileData={profileData}
      />
      
    </Box>
  );
};

export default Communication;
