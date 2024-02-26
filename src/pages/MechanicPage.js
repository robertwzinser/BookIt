import React, { useState } from 'react';
import { Typography, Container, Grid, Card, CardContent, CardActions, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@date-io/date-fns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

// Example services offered by the mechanic shop
const services = [
  { id: 1, title: 'Oil Change', description: 'Complete oil and filter change.', price: '79.99' },
  { id: 2, title: 'Tire Rotation', description: 'Tire rotation to extend the life of your tires.', price: '49.99' },
  { id: 3, title: 'Brake Inspection', description: 'Full brake system inspection.', price: '89.99' },
];

const MechanicPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedService, setSelectedService] = useState({});

  const handleOpenDialog = (service) => {
    setSelectedService(service);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Mechanic Services
        </Typography>
        <Grid container spacing={3}>
          {services.map((service) => (
            <Grid item xs={12} sm={6} md={4} key={service.id}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h2">
                    {service.title}
                  </Typography>
                  <Typography color="text.secondary" gutterBottom>
                    {service.description}
                  </Typography>
                  <Typography variant="body2">
                    Price: ${service.price}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" variant="contained" onClick={() => handleOpenDialog(service)}>Book Now</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Book an Appointment</DialogTitle>
          <DialogContent>
            <Typography variant="h6" gutterBottom>
              Service: {selectedService.title}
            </Typography>
            <DatePicker
              label="Select Date"
              value={selectedDate}
              onChange={(newValue) => {
                setSelectedDate(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button variant="contained" onClick={handleCloseDialog}>Confirm Booking</Button>
          </DialogActions>
        </Dialog>
      </Container>
  );
};

export default MechanicPage;
