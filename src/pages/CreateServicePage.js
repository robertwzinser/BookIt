import React, { useState, useEffect } from "react";
import { getDatabase, ref, push, set, get } from "firebase/database";
import {
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

// Firebase configuration (replace with your own configuration)
const firebaseConfig = {
  apiKey: "AIzaSyA_xxxx",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdefg12345",
};

// Firebase initialization
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const database = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage(app);

const paperStyle = {
  padding: "20px",
  marginTop: "20px",
  backgroundColor: "#0A0A0A",
};

const CreateServicePage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesRef = ref(database, "categories");
        const snapshot = await get(categoriesRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const loadedCategories = Object.keys(data).map((key) => ({
            id: key,
            name: data[key].name,
          }));
          setCategories(loadedCategories);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      let uploadedImageUrl = "";
      if (imageFile) {
        const imageRef = storageRef(storage, `images/${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        uploadedImageUrl = await getDownloadURL(imageRef);
      }

      const newServiceRef = push(ref(database, "services"));
      const newServiceData = {
        name,
        description,
        price: Number(price),
        category,
        imageUrl: uploadedImageUrl,
        ownerId: auth.currentUser?.uid,
      };

      await set(newServiceRef, newServiceData);

      // Update user's business details
      const userRef = ref(
        database,
        `users/${auth.currentUser?.uid}/businessDetails`
      );
      const snapshot = await get(userRef);
      const userDetails = snapshot.val() || {};
      const servicesOffered = userDetails.servicesOffered || [];
      if (!servicesOffered.includes(newServiceRef.key)) {
        servicesOffered.push(newServiceRef.key);
        await set(
          ref(database, `users/${auth.currentUser?.uid}/businessDetails`),
          {
            ...userDetails,
            servicesOffered,
          }
        );
      }

      alert("Service created successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Failed to create service:", error);
      alert("An error occurred while creating the service. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={paperStyle}>
        <Typography variant="h4" align="center" gutterBottom>
          Create a New Listing
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <label htmlFor="upload-photo" style={{ display: "block" }}>
            <div
              style={{
                border: "2px dashed #ccc",
                borderRadius: "8px",
                width: "100%",
                minHeight: "200px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <input
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  height: "100%",
                  width: "100%",
                  opacity: 0,
                  cursor: "pointer",
                }}
                id="upload-photo"
                name="upload-photo"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Uploaded"
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                />
              ) : (
                <Typography
                  variant="body1"
                  sx={{
                    position: "absolute",
                    color: "text.secondary",
                    textAlign: "center",
                  }}
                >
                  Drop your photo here or click to upload
                </Typography>
              )}
            </div>
          </label>
          <TextField
            label="Service Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Description"
            required
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            label="Price"
            type="number"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {categories.map((option) => (
                <MenuItem key={option.id} value={option.name}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Service"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateServicePage;
