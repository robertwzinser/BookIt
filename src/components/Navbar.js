import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import FlightIcon from "@mui/icons-material/Flight";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
} from "firebase/storage";
import logo from "../media/logo.png";
import blankUser from "../media/blank.png";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_uX33ajqsMKAfp7LeP9u57AdBfcuQW2w",
  authDomain: "bookit-v2.firebaseapp.com",
  projectId: "bookit-v2",
  storageBucket: "bookit-v2.appspot.com",
  messagingSenderId: "24786135640",
  appId: "1:24786135640:web:a10a629de292aa2b97f82d",
  measurementId: "G-HHRKZL7JJR",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const storage = getStorage(app);

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openServices, setOpenServices] = useState(false);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [userName, setUserName] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState(blankUser);

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleServicesClick = () => {
    setOpenServices((prev) => !prev);
  };

  const handleNavigate = (path, categoryId = null) => {
    navigate(path, categoryId ? { state: { serviceType: categoryId } } : {});
    setDrawerOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userEmail");
      navigate("/login");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  useEffect(() => {
    const fetchUserProfile = () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const db = getDatabase(app);
        const userProfileRef = ref(db, `users/${currentUser.uid}/profile`);
        onValue(userProfileRef, async (snapshot) => {
          const userProfile = snapshot.val();
          if (userProfile) {
            setUserName(userProfile.name);
            if (userProfile.imageRef) {
              try {
                const imageUrl = await getDownloadURL(
                  storageRef(storage, userProfile.imageRef)
                );
                setProfileImageUrl(imageUrl);
              } catch {
                setProfileImageUrl(blankUser);
              }
            } else {
              setProfileImageUrl(blankUser);
            }
          }
        });
      }
    };

    const fetchCategories = () => {
      const db = getDatabase(app);
      const categoriesRef = ref(db, "categories");
      onValue(categoriesRef, (snapshot) => {
        const data = snapshot.val() || {};
        const fetchedCategories = Object.entries(data).map(([key, value]) => ({
          id: key,
          name: value.name,
        }));
        setCategories(fetchedCategories);
      });
    };

    fetchUserProfile();
    fetchCategories();
  }, []);

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ backgroundColor: "#202020" }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{ mr: 1 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}
          >
            <Link
              to="/home"
              style={{
                display: "flex",
                alignItems: "center",
                color: "inherit",
              }}
            >
              <img src={logo} alt="Logo" style={{ height: "30px" }} />
            </Link>
          </Typography>

          {isLoggedIn && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography variant="body2" sx={{ color: "#8BC34A", mr: 2 }}>
                Logged in as:{" "}
                <Link
                  to="/profile"
                  style={{
                    color: "inherit",
                    textDecoration: "none",
                    fontWeight: "bold",
                    fontStyle: "italic",
                  }}
                >
                  {userName}
                </Link>
              </Typography>
              <Link to="/profile">
                <img
                  src={profileImageUrl}
                  alt="Profile"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "2px solid #505050",
                  }}
                />
              </Link>
            </div>
          )}
          <Button
            color="inherit"
            onClick={isLoggedIn ? handleSignOut : () => navigate("/login")}
            sx={{ ml: 2 }}
          >
            {isLoggedIn ? "Sign Out" : "Login"}
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: 250,
            boxSizing: "border-box",
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
          },
        }}
      >
        <List>
          <ListItemButton onClick={() => handleNavigate("/home")}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
          <ListItemButton onClick={handleServicesClick}>
            <ListItemIcon>
              <FlightIcon />
            </ListItemIcon>
            <ListItemText primary="Services" />
            {openServices ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openServices} timeout="auto" unmountOnExit>
            {categories.map((category) => (
              <ListItemButton
                key={category.id}
                sx={{ pl: 4 }}
                onClick={() => handleNavigate("/search", category.id)}
              >
                <ListItemText primary={category.name} />
              </ListItemButton>
            ))}
          </Collapse>
          <ListItemButton onClick={() => handleNavigate("/about")}>
            <ListItemIcon>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText primary="About Us" />
          </ListItemButton>
        </List>
        <Typography variant="caption" sx={{ textAlign: "center", p: 2 }}>
          © 2024 BookIt
        </Typography>
      </Drawer>
    </>
  );
};

export default Navbar;
