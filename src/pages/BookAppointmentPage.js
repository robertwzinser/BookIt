import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getDatabase,
  ref,
  push,
  get,
  set,
  child,
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

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleTimeChange = (event) => {
    setTime(event.target.value);
  };

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
      serviceId: serviceId,
    };

    try {
      // Push the new appointment to the database
      const newAppointmentRef = push(ref(database, "appointments"));
      await set(newAppointmentRef, appointmentData);

      // Update the appointments array under the user
      const userRef = ref(database, `users/${user.uid}/appointments`);
      const userSnapshot = await get(userRef);
      if (userSnapshot.exists()) {
        const appointmentsArray = userSnapshot.val();
        appointmentsArray.push(newAppointmentRef.key);
        await set(userRef, appointmentsArray);
      } else {
        await set(userRef, [newAppointmentRef.key]);
      }

      // Add the booking details to the chosen service's bookings array
      const serviceRef = ref(database, `services/${serviceId}`);
      const serviceSnapshot = await get(serviceRef);
      if (serviceSnapshot.exists()) {
        const serviceData = serviceSnapshot.val();
        const bookings = serviceData.bookings || [];
        bookings.push({
          userId: user.uid,
          date,
          time,
        });
        await update(serviceRef, { bookings });
      }

      setIsSubmitting(false);
      navigate("/home"); // Navigate to the homepage or confirmation page after booking
    } catch (error) {
      console.error("Error booking appointment:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h4" gutterBottom>
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
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={isSubmitting}
        fullWidth
      >
        Book Appointment
      </Button>
    </Box>
  );
};

export default BookAppointmentPage;
