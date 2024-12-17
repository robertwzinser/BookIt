import React, { useState, useEffect } from "react";
import { getDatabase, ref, push, set, onValue } from "firebase/database";
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

const paperStyle = {
  padding: "20px",
  marginTop: "20px",
  backgroundColor: "#0A0A0A",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const database = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage(app);

const CreateServicePage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const categoriesRef = ref(database, "categories");
    onValue(categoriesRef, (snapshot) => {
      const data = snapshot.val();
      const loadedCategories = Object.keys(data).map((key) => ({
        id: key,
        name: data[key].name,
      }));
      setCategories(loadedCategories);
    });
  }, []);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    setImageFile(file);
    const imageUrl = URL.createObjectURL(file);
    setImageUrl(imageUrl);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let imageUrl = "";
    if (imageFile) {
      const imageRef = storageRef(storage, `images/${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      imageUrl = await getDownloadURL(imageRef);
    }

    const newServiceRef = ref(database, "services");
    const newService = push(newServiceRef);
    set(newService, {
      name,
      description,
      price: Number(price),
      category,
      imageUrl,
      ownerId: auth.currentUser.uid,
    })
      .then(() => {
        const serviceId = newService.key;
        const userRef = ref(
          database,
          `users/${auth.currentUser.uid}/businessDetails`
        );
        onValue(
          userRef,
          (snapshot) => {
            const userDetails = snapshot.val();
            let servicesOffered = userDetails.servicesOffered || [];
            if (!servicesOffered.includes(serviceId)) {
              servicesOffered.push(serviceId);
              set(
                ref(
                  database,
                  `users/${auth.currentUser.uid}/businessDetails/servicesOffered`
                ),
                servicesOffered
              );
            }
          },
          { onlyOnce: true }
        );
        navigate("/profile");
      })
      .catch((error) => {
        console.error("Failed to create service: ", error);
      });
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
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Uploaded"
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                />
              )}
              {!imageUrl && (
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
          <Button type="submit" variant="contained">
            Create Service
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateServicePage;
