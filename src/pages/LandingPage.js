import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  ThemeProvider,
  createTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import logo from "../media/logo.png";
import Footer from "../components/Footer";

// Custom dark theme for Material UI
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#e0e0e0",
      secondary: "#b3b3b3",
    },
  },
});

const paperStyle = {
  padding: "20px",
  marginTop: "20px",
  backgroundColor: "#101010",
};

const LandingPage = () => {
  const [serviceType, setServiceType] = useState("");
  const [generalSearch, setGeneralSearch] = useState("");
  const [promotionalOffers, setPromotionalOffers] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/login");
    }

    const fetchCategories = () => {
      const categoriesRef = ref(getDatabase(), "categories");
      onValue(
        categoriesRef,
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const categoryList = Object.keys(data).map((key) => ({
              value: key,
              label: data[key]?.name || "Unnamed Category",
            }));
            setCategories(categoryList);
          } else {
            setCategories([]); // Set an empty array if no data
          }
        },
        {
          onlyOnce: true,
        }
      );
    };

    const fetchServices = () => {
      const servicesRef = ref(getDatabase(), "services");
      onValue(
        servicesRef,
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const servicesList = Object.keys(data).map((key) => ({
              id: key,
              ...data[key],
            }));
            setPromotionalOffers(servicesList);
          } else {
            setPromotionalOffers([]); // Handle no data case
          }
        },
        { onlyOnce: true }
      );
    };

    const fetchFAQs = () => {
      const faqsRef = ref(getDatabase(), "faqs");
      onValue(
        faqsRef,
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const faqsList = Object.keys(data).map((key) => ({
              id: key,
              ...data[key],
            }));
            setFaqs(faqsList);
          } else {
            setFaqs([]); // Handle no data case
          }
        },
        { onlyOnce: true }
      );
    };

    fetchCategories();
    fetchServices();
    fetchFAQs();
  }, [navigate]);

  const handleGetStarted = () => {
    navigate("/search", { state: "{ serviceType }" });
  };

  const handleGeneralSearchSubmit = (event) => {
    event.preventDefault();
    navigate("/search", { state: { searchQuery: generalSearch } });
  };

  const handleServiceTypeChange = (event) => {
    const selectedCategory = event.target.value;
    const categoryLabel =
      categories.find((category) => category.value === selectedCategory)
        ?.label || "";
    // Navigate to the search page with the selected category as the search query
    navigate("/search", { state: { serviceType: categoryLabel } });
  };

  const handleGeneralSearchChange = (event) => {
    setGeneralSearch(event.target.value);
    setServiceType(""); // Reset serviceType when generalSearch changes
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ p: 20, bgcolor: "background.default", minHeight: "100vh" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img
            src={logo}
            alt="Logo"
            style={{
              minWidth: "240px",
              maxWidth: "20%",
              marginBottom: "40px",
              marginTop: "-100px",
            }}
          />
        </div>
        <Typography
          variant="h3"
          gutterBottom
          textAlign="center"
          color="text.primary"
          sx={{ marginBottom: 8 }}
        >
          Looking for your next adventure?
        </Typography>
        <Box sx={{ my: 4, display: "flex", justifyContent: "center" }}>
          <FormControl
            variant="outlined"
            sx={{ minWidth: 240, mr: 2, maxWidth: "50%" }}
            disabled={generalSearch !== ""}
          >
            <InputLabel>I'm looking for</InputLabel>
            <Select
              label="I'm looking for"
              value={serviceType}
              onChange={handleServiceTypeChange}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 300,
                  },
                },
              }}
            >
              <MenuItem value="">Clear selection</MenuItem>{" "}
              {/* Option to clear selection */}
              {categories.length > 0 ? (
                categories.map((category) => (
                  <MenuItem key={category.value} value={category.value}>
                    {category.label}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">No categories available</MenuItem>
              )}
            </Select>
          </FormControl>
          <Typography variant="body1" color="text.primary" sx={{ my: 2 }}>
            OR
          </Typography>
          <form
            onSubmit={handleGeneralSearchSubmit}
            style={{
              display: "flex",
              flexDirection: "row", // Change flex direction to row
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextField
              label="Search anything..."
              value={generalSearch}
              onChange={handleGeneralSearchChange}
              variant="outlined"
              sx={{ width: 260, mr: 1, ml: 2 }} // Add margin to the right of TextField
              disabled={serviceType !== ""}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ ml: 1 }}
            >
              Search
            </Button>
          </form>
        </Box>
        <Typography variant="h5" gutterBottom color="text.primary">
          Special Offers
        </Typography>
        <Slider {...settings}>
          {promotionalOffers.length > 0 ? (
            promotionalOffers.map((offer, index) => (
              <Box key={index} sx={{ px: 2, width: "300px" }}>
                {" "}
                {/* Set a fixed width for each tile */}
                <Card sx={paperStyle}>
                  <CardActionArea component={Link} to={`/service/${offer.id}`}>
                    <div style={{ paddingTop: "52.25%", position: "relative" }}>
                      {" "}
                      {/* Set a 16:9 aspect ratio (9/16 = 0.5625) */}
                      <CardMedia
                        component="img"
                        height="100%" // Make the CardMedia fill its container
                        image={offer.imageUrl}
                        alt={offer.title}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                        }} // Position the image to fill the container
                      />
                    </div>
                    <CardContent>
                      <Typography
                        gutterBottom
                        variant="h6"
                        component="div"
                        color="text.primary"
                        sx={{
                          overflow: "hidden", // Hide any overflowing text
                          whiteSpace: "nowrap", // Prevent text wrapping
                          textOverflow: "ellipsis", // Render a (...) when text overflows
                        }}
                      >
                        {offer.title}
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
                        {offer.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Box>
            ))
          ) : (
            <Typography variant="h6" color="text.secondary" textAlign="center">
              No promotional offers available at the moment.
            </Typography>
          )}
        </Slider>

        <Box mt={4}>
          <Typography
            variant="h5"
            gutterBottom
            color="text.primary"
            sx={{ marginTop: 10 }}
          >
            FAQs
          </Typography>
          {faqs.map((faq, index) => (
            <Accordion key={index} sx={{ bgcolor: "#101010", mb: 2 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
              >
                <Typography variant="subtitle1" color="text.primary">
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Box>
      <Footer />
    </ThemeProvider>
  );
};

export default LandingPage;
