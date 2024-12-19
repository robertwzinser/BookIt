import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  ThemeProvider,
  createTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import "./LandingPage.css"
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { getDatabase, ref, onValue } from "firebase/database";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import logo from "../media/logo.png";
import Footer from "../components/Footer";

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

const LandingPage = () => {
  const [promotionalOffers, setPromotionalOffers] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/login");
    }

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
            setPromotionalOffers([]);
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
            setFaqs([]);
          }
        },
        { onlyOnce: true }
      );
    };

    fetchServices();
    fetchFAQs();
  }, [navigate]);

  const getDuplicatedOffers = (offers) => {
    // Duplicate the single offer if there's only one
    return offers.length === 1 ? [...offers, ...offers, ...offers] : offers;
  };

  const displayedOffers = getDuplicatedOffers(promotionalOffers);

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

        <Typography variant="h5" gutterBottom color="text.primary">
          Special Offers
        </Typography>
        <Box sx={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
        <Swiper
  modules={[Navigation, Pagination, Autoplay]}
  spaceBetween={30}
  slidesPerView={3}
  navigation={true} // Enable navigation arrows
  pagination={{ clickable: true }} // Enable pagination dots
  loop={true} // Infinite scrolling
  autoplay={{ delay: 300 }} // Autoplay with manual scrolling
  breakpoints={{
    640: { slidesPerView: 1 },
    768: { slidesPerView: 2 },
    1024: { slidesPerView: 3 },
  }}
>
  {displayedOffers.map((offer, index) => (
    <SwiperSlide key={index}>
      <Card sx={{ padding: "20px", backgroundColor: "#101010" }}>
        <CardActionArea component={Link} to={`/service/${offer.id}`}>
          <CardMedia
            component="img"
            image={offer.imageUrl}
            alt={offer.title}
            style={{
              height: 200,
              objectFit: "cover",
            }}
          />
          <CardContent>
            <Typography
              gutterBottom
              variant="h6"
              component="div"
              color="text.primary"
            >
              {offer.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {offer.description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </SwiperSlide>
  ))}
</Swiper>

        </Box>

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
