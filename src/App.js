import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import HairSalonPage from './pages/HairSalonPage';
import MechanicPage from './pages/MechanicPage';
import PlumbingPage from './pages/PlumbingPage';
import AboutPage from './pages/AboutPage';
import ServiceTypePage from './pages/ServiceTypePage';


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/hair-salon" element={<HairSalonPage />} />
          <Route path="/mechanic" element={<MechanicPage />} />
          <Route path="/plumbing" element={<PlumbingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/get-started" element={<ServiceTypePage />} />
          {/* Add more routes as needed */}
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
