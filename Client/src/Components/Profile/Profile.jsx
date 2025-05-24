import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Divider,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HomeIcon from "@mui/icons-material/Home";
import { Delete, Settings } from "@mui/icons-material";
import axios from "axios";
import upload from "../../utils/upload.js";

const Profile = () => {
  const [blockedEmails, setBlockedEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [user, setUser] = useState({
    username: "",
    email: "",
    img: "",
    dept: "",
    program: "",
    yearOfStudy: "",
    dob: "",
  });
  const [wishlist, setWishlist] = useState([]);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [userPets, setUserPets] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [replyContent, setReplyContent] = useState("");
  const [replyError, setReplyError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          "http://localhost:4000/users/profile",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser(data);
        await fetchBlocked();
        await fetchWishlistDetails();
      } catch (err) {
        console.error(err);
      }
    };

    const fetchUserPets = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:4000/profile/get", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserPets(res.data);
      } catch (err) {
        console.error("Error fetching user's pets:", err);
      }
    };

    const fetchBlocked = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:4000/users/blocked/hasblocked",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBlockedEmails(res.data.blockedUserEmails || []);
      } catch (err) {
        console.error("Failed to fetch blocked details:", err);
      }
    };

    const fetchWishlistDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:4000/wishlist/wishlist/details",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setWishlist(res.data);
      } catch (err) {
        console.error("Failed to fetch wishlist details:", err);
      }
    };

    const fetchUserReviews = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:4000/profile/reviews", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserReviews(res.data);
      } catch (err) {
        console.error("Error fetching user reviews:", err);
      }
    };

    fetchUserReviews();
    fetchUser();
    fetchUserPets();
  }, []);

  const handleAddReply = async (reviewId) => {
    if (!replyContent.trim()) {
      setReplyError("Reply content cannot be empty.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:4000/profile/reply",
        { reviewId, content: replyContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserReviews((prev) =>
        prev.map((r) =>
          r._id === reviewId
            ? { ...r, replies: [...r.replies, res.data.reply] }
            : r
        )
      );
      setReplyContent("");
      setReplyError("");
    } catch {
      setReplyError("Failed to add reply. Please try again.");
    }
  };

  const handleRemoveFromWishlist = async (petId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:4000/wishlist/wishlistremove",
        { petId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status === 200) {
        setWishlist((prev) => prev.filter((p) => p._id !== petId));
      }
    } catch (err) {
      console.error("Failed to remove pet from wishlist:", err);
    }
  };

  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
  };
  const handleSettingsOpen = () => setSettingsOpen(true);
  const handleSettingsClose = () => {
    setSettingsOpen(false);
    setPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setProfileImage(null);
    setImagePreview("");
    setMessage("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSettingsSave = async () => {
    if (!password) {
      setMessage("Please enter your current password to confirm changes.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setMessage("New passwords do not match.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      let imageUrl = user.img;
      if (profileImage) {
        imageUrl = await upload(profileImage);
      }
      const updateData = {
        img: imageUrl,
        password,
        newPassword: newPassword || undefined,
      };
      const res = await axios.put(
        "http://localhost:4000/users/update",
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data);
      setMessage("Profile updated successfully.");
      handleSettingsClose();
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    }
  };

  const unblockUser = async (email) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:4000/users/unblock",
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBlockedEmails((prev) => prev.filter((e) => e !== email));
      setMessage(res.data.message || "User unblocked successfully.");
      setOpenSnackbar(true);
    } catch {
      setError("Error unblocking user.");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
      {/* Profile Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 5,
        }}
      >
        <Avatar
          alt="Profile"
          src={imagePreview || user.img || "/default-pfp.png"}
          sx={{ width: 135, height: 135, mb: 2 }}
        />
        <Typography variant="h4" fontWeight="bold">
          {user.username || "Your Name"}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {user.email}
        </Typography>
        <IconButton
          onClick={handleSettingsOpen}
          sx={{
            mt: 2,
            color: "primary",
            display: "flex",
            alignItems: "center",
            gap: 1,
            transition: "transform 0.3s ease-in-out",
            "&:hover": {
              transform: "scale(1.05)",
              backgroundColor: "transparent",
            },
            "&:hover .MuiTouchRipple-root": { display: "none" },
          }}
        >
          <Settings />
          <Typography variant="body2" color="textSecondary">
            Update Profile
          </Typography>
        </IconButton>
      </Box>

      {/* Tabs */}
      <Tabs value={activeTab} onChange={handleTabChange} centered>
        <Tab label="User Details" />
        <Tab label="Block List" />
        <Tab label="My Reviews" />
      </Tabs>

      <Divider sx={{ my: 4 }} />

      {/* User Details */}
      {activeTab === 0 && (
        <Box
          sx={{
            p: 3,
            backgroundColor: "#e8eaf6",
            borderRadius: 2,
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            User Details
          </Typography>
          <Grid container spacing={2}>
            {/* Username */}
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                  background: "#fff",
                  borderRadius: 3,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <AccountCircleIcon
                  color="primary"
                  sx={{ fontSize: "2.7rem" }}
                />
                <Box>
                  <Typography variant="subtitle1" color="textSecondary">
                    Username
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {user.username}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            {/* Email */}
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                  background: "#fff",
                  borderRadius: 3,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <EmailIcon color="primary" sx={{ fontSize: "2.7rem" }} />
                <Box>
                  <Typography variant="subtitle1" color="textSecondary">
                    Email
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {user.email}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            {/*universty*/}
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                  background: "#fff",
                  borderRadius: 3,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <Settings color="primary" sx={{ fontSize: "2.7rem" }} />
                <Box>
                  <Typography variant="subtitle1" color="textSecondary">
                    University
                  </Typography>

                  <Typography variant="body1" fontWeight="medium">
                    {user.university}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            {/* Year of Study */}
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                  background: "#fff",
                  borderRadius: 3,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <Settings color="primary" sx={{ fontSize: "2.7rem" }} />
                <Box>
                  <Typography variant="subtitle1" color="textSecondary">
                    Year of Study
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {user.yearOfStudy}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Department */}
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                  background: "#fff",
                  borderRadius: 3,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <HomeIcon color="primary" sx={{ fontSize: "2.7rem" }} />
                <Box>
                  <Typography variant="subtitle1" color="textSecondary">
                    Department
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {user.dept}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            {/* Program */}
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                  background: "#fff",
                  borderRadius: 3,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <LocationOnIcon color="primary" sx={{ fontSize: "2.7rem" }} />
                <Box>
                  <Typography variant="subtitle1" color="textSecondary">
                    Program
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {user.program}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Block List */}
      {activeTab === 1 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5">Blocked Users</Typography>
          {error && <Typography color="error">{error}</Typography>}
          <List>
            {blockedEmails.map((email, i) => (
              <ListItem
                key={i}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <ListItemText primary={email} />
                <IconButton
                  color="secondary"
                  onClick={() => unblockUser(email)}
                >
                  <Delete />
                </IconButton>
              </ListItem>
            ))}
          </List>
          <Snackbar
            open={openSnackbar}
            autoHideDuration={3000}
            onClose={() => setOpenSnackbar(false)}
            message={message}
          />
        </Box>
      )}

      {/* My Reviews */}
      {activeTab === 2 && (
        <Box sx={{ p: 3 }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            gutterBottom
            sx={{ mb: 2 }}
          >
            My Reviews
          </Typography>
          <Grid container spacing={3}>
            {userReviews.length > 0 ? (
              userReviews.map((review) => (
                <Grid item xs={12} key={review._id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">
                        <b>Pet Name:</b> {review.petId?.name || "Unknown Pet"}
                      </Typography>
                      <Typography variant="body2">
                        <b>Review:</b> {review.content}
                      </Typography>
                      <Typography variant="body2">
                        <b>Reviewer:</b>{" "}
                        {review.reviewerId?.username || "Anonymous"}
                      </Typography>
                      <Typography variant="body2">
                        <b>Status:</b> {review.status}
                      </Typography>
                      <Typography variant="body2">
                        <b>Timestamp:</b>{" "}
                        {new Date(review.timestamp).toLocaleString()}
                      </Typography>

                      {review.replies && review.replies.length > 0 ? (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2">Replies:</Typography>
                          {review.replies.map((r, idx) => (
                            <Typography
                              key={idx}
                              variant="body2"
                              sx={{ ml: 2, mt: 1 }}
                            >
                              {r.content}
                            </Typography>
                          ))}
                        </Box>
                      ) : (
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{ mt: 2 }}
                        >
                          No replies yet.
                        </Typography>
                      )}

                      <Box sx={{ mt: 2 }}>
                        <TextField
                          size="small"
                          placeholder="Write a reply..."
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          error={!!replyError}
                          helperText={replyError}
                          fullWidth
                        />
                        <Button
                          variant="contained"
                          sx={{ mt: 1 }}
                          onClick={() => handleAddReply(review._id)}
                        >
                          Reply
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography
                  variant="body1"
                  color="textSecondary"
                  sx={{ mt: 2 }}
                >
                  No reviews found.
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>
      )}

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onClose={handleSettingsClose}>
        <DialogTitle>Update Profile</DialogTitle>
        <DialogContent>
          {message && (
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
              {message}
            </Typography>
          )}
          <Button
            variant="outlined"
            component="label"
            sx={{
              mt: 3,
              mb: 2,
              backgroundColor: "#121858",
              color: "white",
              "&:hover": { backgroundColor: "#0f144d" },
            }}
          >
            Upload New Picture
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>
          {imagePreview && (
            <Box sx={{ mb: 2 }}>
              <img
                src={imagePreview}
                alt="Preview"
                style={{ width: "100%", borderRadius: 8 }}
              />
            </Box>
          )}
          <TextField
            label="Current Password"
            fullWidth
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="New Password"
            fullWidth
            variant="outlined"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Confirm New Password"
            fullWidth
            variant="outlined"
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSettingsClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSettingsSave} color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;
