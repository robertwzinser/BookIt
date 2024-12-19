import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Box,
} from "@mui/material";
import blankUser from "../media/blank.png";
import { useNavigate } from "react-router-dom";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
};

// Initialize Firebase app
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    businessName: "",
    isBusinessOwner: false,
    imageFile: null,
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, imageFile: file }));
  };

  // Submit form
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    const {
      email,
      password,
      name,
      phone,
      isBusinessOwner,
      businessName,
      imageFile,
    } = formData;

    if (
      !email ||
      !password ||
      !name ||
      !phone ||
      (isBusinessOwner && !businessName)
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Upload profile image
      let profileImageUrl = null;
      if (imageFile) {
        const imageRef = storageRef(storage, `profileImages/${user.uid}`);
        await uploadBytes(imageRef, imageFile);
        profileImageUrl = await getDownloadURL(imageRef);
      }

      // Construct user profile
      const userProfile = {
        email,
        profile: {
          name,
          phone,
          type: isBusinessOwner ? "business_owner" : "customer",
          imageUrl: profileImageUrl || null,
        },
        appointments: [],
      };

      if (isBusinessOwner) {
        userProfile.businessDetails = {
          businessName,
          servicesOffered: [],
        };
      }

      // Save user profile to Firebase Database
      await set(ref(db, `users/${user.uid}`), userProfile);

      navigate("/home");
    } catch (err) {
      console.error("Error signing up:", err);
      setError("An error occurred during sign up. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={6}
        sx={{
          marginTop: 8,
          padding: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#101010",
        }}
      >
        <Typography component="h1" variant="h5" mb={2}>
          Sign Up
        </Typography>
        <Box component="form" onSubmit={handleSignUp} sx={{ width: "100%" }}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <label htmlFor="image-upload" style={{ cursor: "pointer" }}>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
              <img
                src={
                  formData.imageFile
                    ? URL.createObjectURL(formData.imageFile)
                    : blankUser
                }
                alt="Profile"
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            </label>
          </Box>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            required
            id="name"
            name="name"
            label="Full Name"
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            required
            id="phone"
            name="phone"
            label="Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            required
            id="email"
            name="email"
            label="Email Address"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            required
            id="password"
            name="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
          <FormControlLabel
            control={
              <Checkbox
                name="isBusinessOwner"
                checked={formData.isBusinessOwner}
                onChange={handleChange}
              />
            }
            label="Business Owner?"
          />
          {formData.isBusinessOwner && (
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              required
              id="businessName"
              name="businessName"
              label="Business Name"
              value={formData.businessName}
              onChange={handleChange}
            />
          )}
          {error && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing Up..." : "Sign Up"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignUpPage;
