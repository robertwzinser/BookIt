import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getDatabase,
  ref,
  push,
  get,
  set,
  update,
} from "firebase/database";
import { Box, TextField, Button, Typography } from "@mui/material";
import { getAuth } from "firebase/auth";

const BookAppointmentPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const database = getDatabase();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDateChange = (event) => setDate(event.target.value);

  const handleTimeChange = (event) => setTime(event.target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("You must be logged in to book an appointment");
      setIsSubmitting(false);
      return;
    }

    const appointmentData = {
      date,
      time,
      userId: user.uid,
      serviceId,
    };

    try {
      // Create a new appointment
      const newAppointmentRef = push(ref(database, "appointments"));
      await set(newAppointmentRef, appointmentData);

      // Add appointment reference to the user's profile
      const userRef = ref(database, `users/${user.uid}/appointments`);
      const userAppointments = (await get(userRef)).val() || [];
      await set(userRef, [...userAppointments, newAppointmentRef.key]);

      // Add booking details to the service's bookings
      const serviceRef = ref(database, `services/${serviceId}`);
      const serviceData = (await get(serviceRef)).val() || {};
      const serviceBookings = serviceData.bookings || [];
      await update(serviceRef, {
        bookings: [...serviceBookings, { userId: user.uid, date, time }],
      });

      alert("Appointment booked successfully!");
      navigate("/home");
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("An error occurred while booking the appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        mt: 2,
        maxWidth: 500,
        mx: "auto",
        px: 3,
        py: 4,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h4" gutterBottom textAlign="center">
        Book Your Appointment
      </Typography>
      <TextField
        label="Date"
        type="date"
        fullWidth
        required
        value={date}
        onChange={handleDateChange}
        sx={{ mb: 2 }}
        InputLabelProps={{ shrink: true }}
        inputProps={{ "aria-label": "Select appointment date" }}
      />
      <TextField
        label="Time"
        type="time"
        fullWidth
        required
        value={time}
        onChange={handleTimeChange}
        sx={{ mb: 2 }}
        InputLabelProps={{ shrink: true }}
        inputProps={{ "aria-label": "Select appointment time" }}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={isSubmitting}
        fullWidth
        sx={{ py: 1.5 }}
      >
        {isSubmitting ? "Booking..." : "Book Appointment"}
      </Button>
    </Box>
  );
};

export default BookAppointmentPage;
