import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDatabase, ref, onValue } from "firebase/database";
import {
  Box,
  Typography,
  Button,
  Grid,
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
  const navigate = useNavigate();
  const database = getDatabase();
  const storage = getStorage();

  useEffect(() => {
    const fetchServiceDetails = async () => {
      const serviceRef = ref(database, `services/${serviceId}`);
      onValue(
        serviceRef,
        (snapshot) => {
          setService(snapshot.val());
          const ownerId = snapshot.val()?.ownerId;
          if (ownerId) {
            const providerRef = ref(database, `users/${ownerId}`);
            onValue(
              providerRef,
              async (snapshot) => {
                setProvider(snapshot.val());
                const profileImageRef = snapshot.val()?.profile?.imageRef;
                if (profileImageRef) {
                  const url = await getDownloadURL(
                    storageRef(storage, profileImageRef)
                  );
                  setProvider((prevState) => ({
                    ...prevState,
                    profile: {
                      ...prevState.profile,
                      imageUrl: url,
                    },
                  }));
                }
              },
              { onlyOnce: true }
            );
          }
        },
        { onlyOnce: true }
      );
    };

    fetchServiceDetails();
  }, [database, serviceId, storage]);

  const handleBookAppointment = () => {
    navigate(`/book-appointment/${serviceId}`);
  };

  if (!service || !provider) {
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
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.4)), url(${service.imageUrl})`,
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
              src={provider.profile?.imageUrl || ""}
              alt="Provider Avatar"
              sx={{ width: 100, height: 100, margin: "0 auto" }}
            />
            <Typography
              variant="body1"
              gutterBottom
              textAlign="center"
              marginTop="20px"
            >
              <strong>Name:</strong> {provider.profile?.name}
            </Typography>
            <Typography variant="body1" gutterBottom textAlign="center">
              <strong>Email:</strong> {provider.email}
            </Typography>
          </CardContent>
          {/* Include other provider details as needed */}
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
