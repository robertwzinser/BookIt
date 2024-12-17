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
import { getAuth } from "firebase/auth";
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
const storage = getStorage();

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openServices, setOpenServices] = useState(false);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [userName, setUserName] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");

  const auth = getAuth(); // Assumes Firebase auth is initialized elsewhere
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleServicesClick = () => {
    setOpenServices(!openServices);
  };

  const handleNavigate = (path, categoryId = null) => {
    if (categoryId) {
      navigate(path, { state: { serviceType: categoryId } });
    } else {
      navigate(path);
    }
    setDrawerOpen(false);
  };

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userEmail");
        navigate("/login");
      })
      .catch((error) => {
        console.error("Sign out Error:", error);
      });
  };

  useEffect(() => {
    const fetchUserProfile = () => {
      if (auth.currentUser) {
        const db = getDatabase();
        const userProfileRef = ref(db, `users/${auth.currentUser.uid}/profile`);
        onValue(userProfileRef, async (snapshot) => {
          const userProfile = snapshot.val();
          if (userProfile) {
            setUserName(userProfile.name); // Set user name from profile data
            if (userProfile.imageRef) {
              // If there's an image reference, fetch the URL
              const imageRef = storageRef(getStorage(), userProfile.imageRef);
              const url = await getDownloadURL(imageRef);
              setProfileImageUrl(url);
            } else {
              setProfileImageUrl(blankUser);
            }
          } else {
            console.log("No user profile data available");
          }
        });
      }
    };

    const fetchCategories = () => {
      const db = getDatabase();
      const categoriesRef = ref(db, "categories");
      onValue(categoriesRef, (snapshot) => {
        const data = snapshot.val();
        const fetchedCategories = [];
        for (let key in data) {
          fetchedCategories.push({
            id: key,
            name: data[key].name,
          });
        }
        setCategories(fetchedCategories);
      });
    };

    // Call both fetch functions
    fetchUserProfile();
    fetchCategories();
  }, [auth.currentUser]);

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ backgroundColor: "#202020" }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{ mr: 1, ml: 0 }}
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

          {isLoggedIn && userName && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="body2"
                sx={{ color: "#8BC34A", marginRight: "10px" }}
              >
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
              {profileImageUrl && (
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "2px solid #505050",
                  }}
                >
                  <Link to="/profile">
                    <img
                      src={profileImageUrl}
                      alt="Profile"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Link>
                </div>
              )}
            </div>
          )}
          {isLoggedIn ? (
            <Button color="inherit" onClick={handleSignOut} sx={{ pl: 2 }}>
              Sign Out
            </Button>
          ) : (
            <Link
              to="/login"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Button color="inherit">Login</Button>
            </Link>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          width: 250,
          "& .MuiDrawer-paper": {
            width: 250,
            boxSizing: "border-box",
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <div
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <List style={{ flexGrow: 1 }}>
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
              <List component="div" disablePadding>
                {categories.map((category) => (
                  <ListItemButton
                    key={category.id}
                    sx={{ pl: 11 }}
                    onClick={() => handleNavigate("/search", category.id)}
                    className=""
                  >
                    <ListItemText
                      primary={
                        <Typography sx={{ fontStyle: "italic" }}>
                          {category.name}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
            <ListItemButton onClick={() => handleNavigate("/about")}>
              <ListItemIcon>
                <InfoIcon />
              </ListItemIcon>
              <ListItemText primary="About Us" />
            </ListItemButton>
          </List>
          <div className="drawer-footer">
            <Typography variant="caption" display="block">
              © 2024 BookIt
            </Typography>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default Navbar;
