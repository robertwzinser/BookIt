// Footer.js
import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSignUp = () => {
    console.log("Signing up with email:", email);
    setEmail("");
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ bgcolor: "background.paper", p: 4, textAlign: "center" }}>
      <Typography variant="h6" gutterBottom color="text.primary" mb={2}>
        Stay in the know
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom mb={4}>
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
        <Grid item xs={8} md={6}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            size="small"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Grid>
        <Grid item xs={4} md={2}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSignUp}
          >
            Sign Up
          </Button>
        </Grid>
      </Grid>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseSnackbar}
          severity="success"
        >
          Successfully signed up for emails!
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default Footer;
