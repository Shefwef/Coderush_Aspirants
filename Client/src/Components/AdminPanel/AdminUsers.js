import React, { useState, useEffect } from "react";
import { Grid, CircularProgress, Box, Typography } from "@mui/material";
import UserCard from "./UserCard";

const AdminUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:4000/adminuser/all");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Box sx={{ padding: 3 }}>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" variant="h6" align="center">
          {error}
        </Typography>
      ) : users.length === 0 ? (
        <Typography variant="h6" align="center">
          No users found.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {users.map((user) => (
            <Grid item xs={12} sm={6} md={4} key={user._id}>
              <UserCard user={user} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default AdminUser;
