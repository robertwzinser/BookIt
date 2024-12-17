import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Button,
  CardActionArea,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { getDatabase, ref, onValue } from "firebase/database";

const SearchPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const database = getDatabase();

  const [services, setServices] = useState([]);
  const serviceType = state?.serviceType || "";
  const searchQuery = state?.searchQuery || "";

  useEffect(() => {
    const fetchServices = () => {
      const servicesRef = ref(database, "services");
      onValue(
        servicesRef,
        (snapshot) => {
          const servicesData = snapshot.val();
          const loadedServices = [];
          for (const key in servicesData) {
            const service = servicesData[key];
            // Check if the service matches the selected service type, search query,
            // or if any word in the service category matches the search query
            if (
              (serviceType && service.category === serviceType) ||
              (searchQuery &&
                (service.name
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                  service.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  service.category
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())))
            ) {
              loadedServices.push({ id: key, ...service });
            }
          }
          setServices(loadedServices);
        },
        {
          onlyOnce: true,
        }
      );
    };

    if (!serviceType && !searchQuery) {
      navigate("/home"); // Redirect to home if no search criteria are provided
    } else {
      fetchServices();
    }
  }, [serviceType, searchQuery, navigate, database]);

  const StyledCard = styled(Card)(({ theme }) => ({
    transition: "transform 0.15s ease-in-out",
    "&:hover": {
      transform: "scale(1.03)",
      boxShadow: theme.shadows[20],
    },
  }));

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Search Results
      </Typography>
      <Grid container spacing={2}>
        {services.map((service) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            key={service.id || service.name}
          >
            <StyledCard>
              <CardActionArea component={Link} to={`/service/${service.id}`}>
                <CardMedia
                  component="img"
                  sx={{ height: 180 }}
                  image={service.imageUrl}
                  alt={service.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {service.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      overflow: "hidden", // Hide any overflowing text
                      whiteSpace: "nowrap", // Prevent text wrapping
                      textOverflow: "ellipsis", // Render a (...) when text overflows
                    }}
                  >
                    {service.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SearchPage;
