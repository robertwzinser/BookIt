import React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';

const landingContainerStyle = {
  minHeight: '100vh',
  backgroundColor: '#222',
  color: '#fff',
  padding: '64px',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
};

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    // Navigate to the service type selection page
    navigate('/get-started');
  };

  return (
    <Box style={landingContainerStyle}>
      <Typography variant="h2" gutterBottom>
        Book Your Services Online
      </Typography>
      <Typography variant="body1" paragraph>
        Discover the easiest way to schedule appointments
      </Typography>
      <Button variant="contained" color="primary" size="large" onClick={handleGetStarted}>
        Get Started
      </Button>
    </Box>
  );
};

export default LandingPage;
