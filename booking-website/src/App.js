import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
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
  // Check if the user is logged in based on localStorage (or another authentication state)
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HashRouter>
        <Navbar />
        <Routes>
          {/* Redirect root path based on login status */}
          <Route
            path="/"
            element={isLoggedIn ? <Navigate to="/home" /> : <Navigate to="/sign-up" />}
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
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
