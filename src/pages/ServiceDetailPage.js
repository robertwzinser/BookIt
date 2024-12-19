import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDatabase, ref, get } from "firebase/database";
import {
  Box,
  Typography,
  Button,
  Container,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
} from "firebase/storage";

const ServiceDetailPage = () => {
  const { serviceId } = useParams();
  const [service, setService] = useState(null);
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const database = getDatabase();
  const storage = getStorage();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // Fetch service details
        const serviceRef = ref(database, `services/${serviceId}`);
        const serviceSnapshot = await get(serviceRef);
        const serviceData = serviceSnapshot.val();
        setService(serviceData);

        if (serviceData?.ownerId) {
          // Fetch provider details
          const providerRef = ref(database, `users/${serviceData.ownerId}`);
          const providerSnapshot = await get(providerRef);
          const providerData = providerSnapshot.val();

          if (providerData?.profile?.imageRef) {
            const imageUrl = await getDownloadURL(
              storageRef(storage, providerData.profile.imageRef)
            );
            providerData.profile.imageUrl = imageUrl;
          }

          setProvider(providerData);
        }
      } catch (error) {
        console.error("Error fetching service details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [serviceId, database, storage]);

  const handleBookAppointment = () => {
    navigate(`/book-appointment/${serviceId}`);
  };

  if (loading) {
    return (
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "70vh",
        }}
      >
        <Typography variant="h6" textAlign="center">
          Loading service details...
        </Typography>
      </Container>
    );
  }

  if (!service) {
    return (
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "70vh",
        }}
      >
        <Typography variant="h6" textAlign="center">
          Service not found.
        </Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box
        sx={{
          position: "relative",
          height: "400px",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)), url(${
              service.imageUrl || "https://via.placeholder.com/400"
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h3" color="white" textAlign="center">
            {service.name}
          </Typography>
        </Box>
      </Box>

      <Container maxWidth="sm" sx={{ my: 5 }}>
        <Card sx={{ margin: "0 auto", backgroundColor: "#101010" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom align="center">
              Provider Details
            </Typography>
            <Avatar
              src={provider?.profile?.imageUrl || "https://via.placeholder.com/100"}
              alt="Provider Avatar"
              sx={{ width: 100, height: 100, margin: "0 auto" }}
            />
            <Typography
              variant="body1"
              gutterBottom
              textAlign="center"
              marginTop="20px"
            >
              <strong>Name:</strong> {provider?.profile?.name || "N/A"}
            </Typography>
            <Typography variant="body1" gutterBottom textAlign="center">
              <strong>Email:</strong> {provider?.email || "N/A"}
            </Typography>
          </CardContent>
        </Card>

        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="body1" paragraph>
            {service.description}
          </Typography>
          <Typography variant="h5" gutterBottom>
            Price: ${service.price}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "25px",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleBookAppointment}
            >
              Book Your Appointment
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ServiceDetailPage;
