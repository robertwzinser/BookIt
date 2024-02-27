import React from 'react';
import { Container, Paper, Typography, TextField, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Ensure this CSS file contains the styles for your login page

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Placeholder for login logic
    console.log('Logging in...');
    // navigate('/dashboard'); // Redirect after login, adjust the path as needed
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={6} sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 3 }}>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          {/* Add more elements like 'Forgot password' or 'Sign up' as needed */}
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
