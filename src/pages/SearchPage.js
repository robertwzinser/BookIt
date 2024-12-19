import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { getDatabase, ref, onValue } from "firebase/database";

const SearchPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const database = getDatabase();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const serviceType = state?.serviceType || "";
  const searchQuery = state?.searchQuery || "";

  useEffect(() => {
    const fetchServices = () => {
      const servicesRef = ref(database, "services");
      onValue(
        servicesRef,
        (snapshot) => {
          const servicesData = snapshot.val() || {};
          const filteredServices = Object.entries(servicesData)
            .filter(([_, service]) => {
              const matchesType = serviceType
                ? service.category === serviceType
                : true;
              const matchesQuery = searchQuery
                ? service.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  service.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  service.category
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                : true;
              return matchesType && matchesQuery;
            })
            .map(([id, service]) => ({ id, ...service }));

          setServices(filteredServices);
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching services:", error);
          setLoading(false);
        }
      );
    };

    if (!serviceType && !searchQuery) {
      navigate("/home");
    } else {
      fetchServices();
    }
  }, [serviceType, searchQuery, navigate, database]);

  const StyledCard = styled(Card)(({ theme }) => ({
    transition: "transform 0.15s ease-in-out",
    "&:hover": {
      transform: "scale(1.03)",
      boxShadow: theme.shadows[4],
    },
  }));

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {services.length > 0 ? "Search Results" : "No Services Found"}
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
              <CardMedia
                component={Link}
                to={`/service/${service.id}`}
                sx={{ height: 180 }}
                image={service.imageUrl || "https://via.placeholder.com/150"}
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
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={service.description}
                >
                  {service.description}
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SearchPage;
