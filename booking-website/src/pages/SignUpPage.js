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
import blankUser from "../media/blank.png";

// Initialize Firebase only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isBusinessOwner, setIsBusinessOwner] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  const handleCheckboxChange = (event) => {
    setIsBusinessOwner(event.target.checked);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    setImageFile(file);
    // Set the imageUrl state to the file itself
  };

  const handleSignUp = async (event) => {
    event.preventDefault();

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

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Upload profile picture to Firebase Storage
      let imageRef = null;
      if (imageFile) {
        imageRef = storageRef(storage, `profileImages/${user.uid}`);
        await uploadBytes(imageRef, imageFile);
      }

      // Create user profile data
      const userProfile = {
        email: user.email,
        profile: {
          name: name,
          phone: phone,
          type: isBusinessOwner ? "business_owner" : "customer",
          imageRef: imageRef ? imageRef.fullPath : null, // Store the storage reference
        },
        appointments: [],
      };

      // If user is a business owner, add business details
      if (isBusinessOwner) {
        userProfile.businessDetails = {
          businessName,
          servicesOffered: [],
        };
      }

      // Write the user profile to Realtime Database under the 'users' node
      await set(ref(db, "users/" + user.uid), userProfile);

      console.log("User signed up successfully");
      navigate("/home"); // Navigate to the dashboard or home page
    } catch (error) {
      console.error("Error signing up:", error);
      setError(error.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={6}
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 3,
          backgroundColor: "#101010",
        }}
      >
        <Typography component="h1" variant="h5" marginBottom="10px">
          Sign Up
        </Typography>
        <Box component="form" onSubmit={handleSignUp} noValidate sx={{ mt: 1 }}>
          {/* Profile picture upload input field */}
          <label
            htmlFor="image-upload"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
            <img
              src={imageFile ? URL.createObjectURL(imageFile) : blankUser}
              alt="Profile"
              style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          </label>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="name"
            label="Full Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="phone"
            label="Phone Number"
            name="phone"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isBusinessOwner}
                onChange={handleCheckboxChange}
                name="isBusinessOwner"
              />
            }
            label="Business Owner?"
            sx={{ marginTop: "10px" }}
          />
          {isBusinessOwner && (
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="businessName"
              label="Business Name"
              type="text"
              id="businessName"
              autoComplete="business-name"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
          )}
          {error && (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignUpPage;
