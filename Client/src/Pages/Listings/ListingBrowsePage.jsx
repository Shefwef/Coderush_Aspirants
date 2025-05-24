import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  CircularProgress,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Button,
} from "@mui/material";
import axios from "axios";
import ListingCard from "../../Components/Listings/ListingCard";

const categories = [
  "Books",
  "Electronics",
  "Tutoring",
  "Skill Exchange",
  "Others",
];

export default function ListingBrowsePage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters & search state
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortPrice, setSortPrice] = useState(""); // "asc" or "desc"

  const fetchListings = async () => {
    setLoading(true);
    setError("");
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (!currentUser?._id) {
        setError("User not logged in.");
        setListings([]);
        setLoading(false);
        return;
      }

      // Build query params for API call
      const params = {};

      if (searchTerm.trim() !== "") {
        params.q = searchTerm.trim();
      }
      if (categoryFilter) {
        params.category = categoryFilter;
      }
      if (minPrice !== "") {
        params.minPrice = minPrice;
      }
      if (maxPrice !== "") {
        params.maxPrice = maxPrice;
      }

      const { data } = await axios.get(
        `http://localhost:4000/listings/${currentUser._id}`,
        {
          params,
        }
      );

      // Sort on frontend by price if needed
      let sortedData = data;
      if (sortPrice === "asc") {
        sortedData = [...data].sort((a, b) => a.price - b.price);
      } else if (sortPrice === "desc") {
        sortedData = [...data].sort((a, b) => b.price - a.price);
      }

      setListings(sortedData);
    } catch (err) {
      setError("Failed to fetch listings.");
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, categoryFilter, minPrice, maxPrice, sortPrice]);

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setMinPrice("");
    setMaxPrice("");
    setSortPrice("");
  };

  return (
    <Container sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        Browse Listings
      </Typography>

      {/* Filters & Search */}
      <Box
        component="form"
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mb: 4,
          justifyContent: "center",
        }}
        noValidate
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault();
          fetchListings();
        }}
      >
        <TextField
          label="Search by Title or Category"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{ minWidth: 220 }}
        />

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={categoryFilter}
            label="Category"
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Min Price"
          type="number"
          size="small"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          sx={{ width: 100 }}
          inputProps={{ min: 0 }}
        />

        <TextField
          label="Max Price"
          type="number"
          size="small"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          sx={{ width: 100 }}
          inputProps={{ min: 0 }}
        />

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Sort by Price</InputLabel>
          <Select
            value={sortPrice}
            label="Sort by Price"
            onChange={(e) => setSortPrice(e.target.value)}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="asc">Low to High</MenuItem>
            <MenuItem value="desc">High to Low</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          color="secondary"
          onClick={handleResetFilters}
          sx={{ minWidth: 100 }}
        >
          Reset
        </Button>
      </Box>

      {/* Listings */}
      {loading ? (
        <Box sx={{ textAlign: "center", mt: 6 }}>
          <CircularProgress />
          <Typography variant="h6" mt={2}>
            Loading listings...
          </Typography>
        </Box>
      ) : error ? (
        <Typography variant="h6" color="error" textAlign="center" mt={6}>
          {error}
        </Typography>
      ) : listings.length === 0 ? (
        <Typography variant="h6" textAlign="center" mt={6}>
          No listings found.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {listings.map((listing) => (
            <Grid item xs={12} sm={6} md={4} key={listing._id}>
              <ListingCard listing={listing} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
