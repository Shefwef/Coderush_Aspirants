import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Button,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";

const categories = [
  "Books",
  "Electronics",
  "Tutoring",
  "Skill Exchange",
  "Others",
];
const listingTypes = ["item", "service"];
const priceTypes = ["fixed", "bidding", "hourly"];
const conditions = ["like new", "good", "fair"];
const visibilities = ["university", "all"];

export default function ListingCreatePage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    type: "item",
    title: "",
    description: "",
    category: "",
    price: "",
    priceType: "fixed",
    visibility: "university",
    condition: "good",
    biddingEndDate: "",
    minBidIncrement: "",
    imagesInput: "",
    images: [],
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.category) errs.category = "Category is required";
    if (form.price === "" || Number(form.price) < 0)
      errs.price = "Valid price is required";
    if (!form.images.length) errs.imagesInput = "Add at least one image URL";

    if (form.priceType === "bidding") {
      if (!form.biddingEndDate) errs.biddingEndDate = "End date is required";
      if (!form.minBidIncrement)
        errs.minBidIncrement = "Min increment is required";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const handleImagesChange = (e) => {
    const raw = e.target.value;
    const imgs = raw
      .split(",")
      .map((i) => i.trim())
      .filter((i) => i);
    setForm((prev) => ({ ...prev, imagesInput: raw, images: imgs }));
  };

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [timeoutId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      setSnackbar({
        open: true,
        message: "Please fill out all fields correctly.",
        severity: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const payload = {
        type: form.type,
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        price: Number(form.price),
        priceType: form.priceType,
        visibility: form.visibility,
        condition: form.condition,
        images: form.images,
        ...(form.priceType === "bidding" && {
          biddingEndDate: form.biddingEndDate,
          minBidIncrement: Number(form.minBidIncrement),
        }),
      };

      const response = await fetch(
        `http://localhost:4000/listings/create/${currentUser._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to create listing.");
      }

      setSnackbar({
        open: true,
        message: "Listing created successfully!",
        severity: "success",
      });

      setForm({
        type: "item",
        title: "",
        description: "",
        category: "",
        price: "",
        priceType: "fixed",
        visibility: "university",
        condition: "good",
        biddingEndDate: "",
        minBidIncrement: "",
        imagesInput: "",
        images: [],
      });

      const id = setTimeout(() => {
        navigate("/listings");
      }, 3000);
      setTimeoutId(id);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message,
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper
      elevation={6}
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 4,
        p: 3,
        borderRadius: 2,
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Create New Listing
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          {/* Type */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Type</InputLabel>
              <Select
                name="type"
                value={form.type}
                onChange={handleChange}
                label="Type"
              >
                {listingTypes.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Category */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!!errors.category}>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={form.category}
                onChange={handleChange}
                label="Category"
              >
                {categories.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
              {errors.category && (
                <FormHelperText>{errors.category}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          {/* Title */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              error={!!errors.title}
              helperText={errors.title}
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              multiline
              rows={3}
            />
          </Grid>

          {/* Price & Price Type */}
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              required
              type="number"
              label={form.priceType === "hourly" ? "Hourly Rate" : "Price"}
              name="price"
              value={form.price}
              onChange={handleChange}
              error={!!errors.price}
              helperText={errors.price}
              inputProps={{ min: 0, step: "0.01" }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Price Type</InputLabel>
              <Select
                name="priceType"
                value={form.priceType}
                onChange={handleChange}
                label="Price Type"
              >
                {priceTypes.map((pt) => (
                  <MenuItem key={pt} value={pt}>
                    {pt.charAt(0).toUpperCase() + pt.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Bidding Fields */}
          {form.priceType === "bidding" && (
            <>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  required
                  type="datetime-local"
                  label="End Date"
                  name="biddingEndDate"
                  value={form.biddingEndDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.biddingEndDate}
                  helperText={errors.biddingEndDate}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Min Bid Increment"
                  name="minBidIncrement"
                  value={form.minBidIncrement}
                  onChange={handleChange}
                  inputProps={{ min: 0, step: "0.01" }}
                  error={!!errors.minBidIncrement}
                  helperText={errors.minBidIncrement}
                />
              </Grid>
            </>
          )}

          {/* Condition */}
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Condition</InputLabel>
              <Select
                name="condition"
                value={form.condition}
                onChange={handleChange}
                label="Condition"
              >
                {conditions.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Visibility */}
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Visibility</InputLabel>
              <Select
                name="visibility"
                value={form.visibility}
                onChange={handleChange}
                label="Visibility"
              >
                {visibilities.map((v) => (
                  <MenuItem key={v} value={v}>
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Images */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              multiline
              rows={2}
              label="Images (comma-separated URLs)"
              name="imagesInput"
              value={form.imagesInput}
              onChange={handleImagesChange}
              error={!!errors.imagesInput}
              helperText={errors.imagesInput}
            />
          </Grid>
        </Grid>

        <Box mt={4} textAlign="center">
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating…" : "Create Listing"}
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}
