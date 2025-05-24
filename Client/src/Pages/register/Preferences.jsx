import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import {
  Box,
  Grid,
  Typography,
  Button,
  CircularProgress,
  Paper,
  TextField,
  MenuItem,
  useTheme,
} from "@mui/material";
import { Check } from "lucide-react";

const Preferences = () => {
  const theme = useTheme();
  const [preferences, setPreferences] = useState({
    university: "",
    dept: "",
    program: "",
    yearOfStudy: "",
    dob: "",
    contactNo: "", // added contactNo here
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkPreferences = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await newRequest.get(
          "http://localhost:4000/users/preferences",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data && res.data.university) {
          navigate("/");
        }
      } catch (err) {
        console.error("Failed to fetch existing preferences:", err);
      }
    };
    checkPreferences();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPreferences((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await newRequest.post(
        "http://localhost:4000/users/preferences",
        preferences,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMessage("Preferences saved successfully!");
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/");
      }, 3000);
    } catch (err) {
      console.error("Failed to save preferences:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "50vw",
          maxWidth: "600px",
          p: theme.spacing(6),
          backgroundColor: "#F5F5F4",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{ fontWeight: 600, mb: theme.spacing(4) }}
        >
          Tell Us a Bit About Yourself
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* University Select */}
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                required
                label="University"
                name="university"
                value={preferences.university}
                onChange={handleChange}
              >
                {["IUT", "DU", "BUET"].map((uni) => (
                  <MenuItem key={uni} value={uni}>
                    {uni}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Department */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Department"
                name="dept"
                value={preferences.dept}
                onChange={handleChange}
              />
            </Grid>

            {/* Program */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Program"
                name="program"
                value={preferences.program}
                onChange={handleChange}
              />
            </Grid>

            {/* Year of Study */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Year of Study"
                name="yearOfStudy"
                type="number"
                value={preferences.yearOfStudy}
                onChange={handleChange}
              />
            </Grid>

            {/* Date of Birth */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Date of Birth"
                name="dob"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={preferences.dob}
                onChange={handleChange}
              />
            </Grid>

            {/* Contact Number (optional) */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contact Number"
                name="contactNo"
                value={preferences.contactNo}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <Check />}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </Box>

          {successMessage && (
            <Typography color="success.main" align="center" sx={{ mt: 2 }}>
              {successMessage}
            </Typography>
          )}
        </form>
      </Paper>
    </Box>
  );
};

export default Preferences;
