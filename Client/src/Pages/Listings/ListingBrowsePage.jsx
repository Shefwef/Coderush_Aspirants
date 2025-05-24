import React, { useState, useEffect } from "react";
import axios from "axios";
import ListingCard from "../../Components/Listings/ListingCard.jsx";
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  CircularProgress,
  Grid,
} from "@mui/material";

const categories = [
  "Books",
  "Electronics",
  "Tutoring",
  "Skill Exchange",
  "Others",
];
const priceTypes = ["fixed", "bidding", "hourly"];
const conditions = ["like new", "good", "fair"];
const visibilities = ["university", "all"];

export default function ListingBrowsePage() {
  const [listings, setListings] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    priceType: "",
    condition: "",
    visibility: "",
    university: "",
    q: "",
    minPrice: "",
    maxPrice: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = {};
      Object.entries(filters).forEach(([k, v]) => {
        if (v) params[k] = v;
      });
      const res = await axios.get("/api/listings", { params });
      setListings(res.data);
      setError("");
    } catch (err) {
      setError("Failed to load listings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchListings();
  };

  return (
    <Box maxWidth={900} mx="auto" p={2}>
      <Typography variant="h4" mb={3} align="center">
        Marketplace Listings
      </Typography>

      <Box component="form" onSubmit={handleSearch} mb={3}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Search title"
              name="q"
              value={filters.q}
              onChange={handleInputChange}
              size="small"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                label="Category"
                name="category"
                value={filters.category}
                onChange={handleInputChange}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Price Type</InputLabel>
              <Select
                label="Price Type"
                name="priceType"
                value={filters.priceType}
                onChange={handleInputChange}
              >
                <MenuItem value="">All Price Types</MenuItem>
                {priceTypes.map((pt) => (
                  <MenuItem key={pt} value={pt}>
                    {pt.charAt(0).toUpperCase() + pt.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Condition</InputLabel>
              <Select
                label="Condition"
                name="condition"
                value={filters.condition}
                onChange={handleInputChange}
              >
                <MenuItem value="">All Conditions</MenuItem>
                {conditions.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Visibility</InputLabel>
              <Select
                label="Visibility"
                name="visibility"
                value={filters.visibility}
                onChange={handleInputChange}
              >
                <MenuItem value="">All Visibility</MenuItem>
                {visibilities.map((v) => (
                  <MenuItem key={v} value={v}>
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="University"
              name="university"
              value={filters.university}
              onChange={handleInputChange}
              size="small"
            />
          </Grid>

          <Grid item xs={6} sm={3} md={2}>
            <TextField
              fullWidth
              label="Min Price"
              name="minPrice"
              type="number"
              value={filters.minPrice}
              onChange={handleInputChange}
              size="small"
              inputProps={{ min: 0 }}
            />
          </Grid>

          <Grid item xs={6} sm={3} md={2}>
            <TextField
              fullWidth
              label="Max Price"
              name="maxPrice"
              type="number"
              value={filters.maxPrice}
              onChange={handleInputChange}
              size="small"
              inputProps={{ min: 0 }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              sx={{ height: "40px" }}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Box>

      {loading && (
        <Box textAlign="center" my={3}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color="error" align="center" mb={3}>
          {error}
        </Typography>
      )}

      {!loading && listings.length === 0 && (
        <Typography align="center" color="textSecondary" mb={3}>
          No listings found.
        </Typography>
      )}

      <Grid container spacing={2}>
        {listings.map((listing) => (
          <Grid key={listing._id} item xs={12} sm={6} md={4}>
            <ListingCard listing={listing} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
