import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import SearchPage from "./pages/SearchPage";
import SignUpPage from "./pages/SignUpPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import BookAppointmentPage from "./pages/BookAppointmentPage";
import CreateServicePage from "./pages/CreateServicePage";
import UserProfilePage from "./pages/UserProfile";
import "./App.css"; // Import the CSS file

function App() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={isLoggedIn ? <LandingPage /> : <SignUpPage />}
          />
          <Route path="/home" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/service/:serviceId" element={<ServiceDetailPage />} />
          <Route
            path="/book-appointment/:serviceId"
            element={<BookAppointmentPage />}
          />
          <Route path="/create-service" element={<CreateServicePage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
