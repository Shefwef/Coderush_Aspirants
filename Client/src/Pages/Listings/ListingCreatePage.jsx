import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  FormHelperText,
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
    imagesInput: "", // For user text input (comma separated URLs)
    images: [],
  });
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.category) newErrors.category = "Category is required";
    if (form.price === "" || Number(form.price) < 0)
      newErrors.price = "Valid price is required";
    if (form.images.length === 0)
      newErrors.imagesInput = "Add at least one image URL";
    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImagesChange = (e) => {
    const value = e.target.value;
    const imgs = value
      .split(",")
      .map((i) => i.trim())
      .filter((i) => i);
    setForm((prev) => ({ ...prev, imagesInput: value, images: imgs }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      // Prepare payload without imagesInput string
      const { imagesInput, ...payload } = form;
      payload.images = form.images;
      payload.price = Number(payload.price);
      await axios.post("/api/listings", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setError({});
      navigate("/listings");
    } catch (err) {
      setError({
        submit: err.response?.data?.message || "Failed to create listing",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      maxWidth={600}
      mx="auto"
      mt={4}
      p={3}
      boxShadow={3}
      borderRadius={2}
      bgcolor="background.paper"
    >
      <Typography variant="h4" mb={3} align="center">
        Create New Listing
      </Typography>

      <form onSubmit={handleSubmit} noValidate>
        <FormControl fullWidth margin="normal">
          <InputLabel id="type-label">Type</InputLabel>
          <Select
            labelId="type-label"
            label="Type"
            name="type"
            value={form.type}
            onChange={handleChange}
            required
          >
            {listingTypes.map((t) => (
              <MenuItem key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          margin="normal"
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          error={!!error.title}
          helperText={error.title}
          required
        />

        <TextField
          fullWidth
          margin="normal"
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          multiline
          rows={4}
        />

        <FormControl
          fullWidth
          margin="normal"
          error={!!error.category}
          required
        >
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            label="Category"
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>Select Category</em>
            </MenuItem>
            {categories.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </Select>
          {error.category && <FormHelperText>{error.category}</FormHelperText>}
        </FormControl>

        <TextField
          fullWidth
          margin="normal"
          label="Price"
          name="price"
          type="number"
          inputProps={{ min: 0, step: "0.01" }}
          value={form.price}
          onChange={handleChange}
          error={!!error.price}
          helperText={error.price}
          required
        />

        <FormControl fullWidth margin="normal">
          <InputLabel id="priceType-label">Price Type</InputLabel>
          <Select
            labelId="priceType-label"
            label="Price Type"
            name="priceType"
            value={form.priceType}
            onChange={handleChange}
          >
            {priceTypes.map((pt) => (
              <MenuItem key={pt} value={pt}>
                {pt.charAt(0).toUpperCase() + pt.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel id="visibility-label">Visibility</InputLabel>
          <Select
            labelId="visibility-label"
            label="Visibility"
            name="visibility"
            value={form.visibility}
            onChange={handleChange}
          >
            {visibilities.map((v) => (
              <MenuItem key={v} value={v}>
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel id="condition-label">Condition</InputLabel>
          <Select
            labelId="condition-label"
            label="Condition"
            name="condition"
            value={form.condition}
            onChange={handleChange}
          >
            {conditions.map((c) => (
              <MenuItem key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          margin="normal"
          label="Images (URLs, comma separated)"
          name="imagesInput"
          value={form.imagesInput}
          onChange={handleImagesChange}
          error={!!error.imagesInput}
          helperText={error.imagesInput}
          placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
          multiline
          rows={2}
          required
        />

        {error.submit && (
          <Typography color="error" mt={1}>
            {error.submit}
          </Typography>
        )}

        <Box mt={3} display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Listing"}
          </Button>
        </Box>
      </form>
    </Box>
  );
}
