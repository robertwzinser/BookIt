import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Updated promotional offers array to include "Get a Haircut"
const promotionalOffers = [
  {
    title: 'Summer in Italy',
    description: 'Experience the beauty of Italy this summer with up to 20% off.',
    imageUrl: './media/italy-summer.jpg', // Ensure you have these images in your public folder or hosted online
  },
  {
    title: 'Explore Japan',
    description: 'Discover the wonders of Japan with special flight deals.',
    imageUrl: './media/japan-explore.jpg',
  },
  // New section added
  {
    title: 'Get a Haircut',
    description: 'Freshen up your look with deals from the best local barbers.',
    imageUrl: './media/haircut-offers.jpg',
  },
  // You can add more promotional offers as needed
];

// Define a dark theme for the app using MUI's createTheme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9', // A light blue shade for primary actions
    },
    background: {
      default: '#121212', // Dark background for the overall page
      paper: '#1e1e1e', // Slightly lighter for components like cards
    },
    text: {
      primary: '#e0e0e0', // Making text more visible against the dark background
      secondary: '#b3b3b3', // For less emphasized text
    },
  },
});

const categories = [
  { value: 'hotels', label: 'Hotels' },
  { value: 'flights', label: 'Flights' },
  { value: 'cars', label: 'Car Rentals' },
  // Consider adding more categories as needed
];

const faqs = [
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards and PayPal.',
  },
  {
    question: 'Can I cancel my booking?',
    answer: 'Yes, you can cancel your booking up to 24 hours before your scheduled reservation.',
  },
  {
    question: 'Are there any hidden fees?',
    answer: 'No, we are transparent about all fees associated with your booking.',
  },
  {
    question: 'How do I contact customer support?',
    answer: 'You can contact our customer support team via phone, email, or live chat.',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'Refunds are available according to our refund policy. Please refer to our terms and conditions for more information.',
  },
  // Add more FAQs as needed
];


const LandingPage = () => {
  const [serviceType, setServiceType] = useState('');
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/search', { state: { serviceType } });
  };

  const handleServiceTypeChange = (event) => {
    setServiceType(event.target.value);
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
      <Box sx={{ p: 20, bgcolor: 'background.default', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <img src="./media/logo.png" alt="Logo" style={{ minWidth: '240px', maxWidth: '20%', marginBottom: '20px', marginTop: '-100px'}} />
      </div>
        <Typography variant="h3" gutterBottom textAlign="center" color="text.primary">
          Looking for your next adventure?
        </Typography>
        <Box sx={{ my: 4, display: 'flex', justifyContent: 'center' }}>
          <TextField
            select
            label="I'm looking for"
            value={serviceType}
            onChange={handleServiceTypeChange}
            variant="outlined"
            sx={{ minWidth: 240, mr: 2, bgcolor: 'background.paper' }}
          >
            {categories.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <Button variant="contained" color="primary" onClick={handleGetStarted}>
            Go
          </Button>
        </Box>
        <Typography variant="h5" gutterBottom color="text.primary">
          Special Offers
        </Typography>
        <Slider {...settings}>
          {promotionalOffers.map((offer, index) => (
            <Box key={index} sx={{ px: 2 }}> {/* Add spacing between slides */}
              <Card sx={{ bgcolor: 'background.paper' }}>
                <CardActionArea>
                  <CardMedia component="img" height="140" image={offer.imageUrl} alt={offer.title} />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div" color="text.primary">
                      {offer.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {offer.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Box>
          ))}
        </Slider>
        <Box mt={4}>
          <Typography variant="h5" gutterBottom color="text.primary">
            FAQs
          </Typography>
          {faqs.map((faq, index) => (
            <Accordion key={index} sx={{ bgcolor: 'background.paper', mb: 2 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
              >
                <Typography variant="subtitle1" color="text.primary">{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default LandingPage;