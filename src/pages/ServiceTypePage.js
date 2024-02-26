import React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';

const ServiceTypePage = () => {
  const navigate = useNavigate();

  const handleServiceSelection = (path) => {
    // Navigate to the selected service type page
    navigate(path);
  };

  return (
    <Box style={{ minHeight: '100vh', backgroundColor: '#222', color: '#fff', padding: '64px', textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Choose Your Service Type
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '32px' }}>
        <Button variant="contained" color="primary" size="large" onClick={() => handleServiceSelection('/hair-salon')}>
          Hair Salon
        </Button>
        <Button variant="contained" color="primary" size="large" onClick={() => handleServiceSelection('/mechanic')}>
          Mechanic
        </Button>
        <Button variant="contained" color="primary" size="large" onClick={() => handleServiceSelection('/plumbing')}>
          Plumbing
        </Button>
      </Box>
      <Box mt={4}>
        <Typography variant="body1" gutterBottom>
          Choose from our range of services to find the perfect solution for your needs.
        </Typography>
      </Box>
    </Box>
  );
};

export default ServiceTypePage;
