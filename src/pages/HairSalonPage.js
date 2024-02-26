import React, { useState } from 'react';
import { Typography, Container, Grid, Card, CardContent, CardActions, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@date-io/date-fns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

const services = [
  { id: 1, title: 'Haircut', description: 'A stylish haircut to suit your personal style.', price: '30' },
  { id: 2, title: 'Hair Coloring', description: 'Professional hair coloring services.', price: '120' },
  { id: 3, title: 'Hair Styling', description: 'Get a fresh look with our expert styling.', price: '50' },
];

const HairSalonPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedService, setSelectedService] = useState(services[0]); // Default to the first service

  const handleOpenDialog = (service) => {
    setSelectedService(service);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
      <Container maxWidth="lg">
        <Typography variant="h3" gutterBottom component="div" sx={{ mt: 5, mb: 4 }}>
          Hair Salon Services
        </Typography>
        <Grid container spacing={4}>
          {services.map((service) => (
            <Grid item xs={12} sm={6} md={4} key={service.id}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {service.title}
                  </Typography>
                  <Typography variant="body2">
                    {service.description}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 2 }}>
                    ${service.price}
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
          <DialogTitle>Book Your Appointment</DialogTitle>
          <DialogContent>
            <Typography gutterBottom>You're booking: {selectedService.title}</Typography>
            <DatePicker
              label="Appointment Date"
              value={selectedDate}
              onChange={(newValue) => {
                setSelectedDate(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleCloseDialog} variant="contained">Book Appointment</Button>
          </DialogActions>
        </Dialog>
      </Container>
  );
};

export default HairSalonPage;
