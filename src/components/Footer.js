// Footer.js
import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSignUp = () => {
    console.log("Signing up with email:", email);
    setEmail(""); // Clear the email field
    setOpenSnackbar(true); // Show the success message
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        p: 4,
        textAlign: "center",
      }}
    >
      <Typography variant="h6" gutterBottom color="text.primary" mb={2}>
        Stay in the know
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Sign up to get marketing emails from BookIt, including promotions,
        rewards, travel experiences, and information.
      </Typography>
      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems="center"
        mb={4}
      >
        <Grid item xs={12} sm={8} md={6}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            size="small"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email Address"
          />
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSignUp}
            aria-label="Sign Up Button"
          >
            Sign Up
          </Button>
        </Grid>
      </Grid>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Successfully signed up for emails!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Footer;
