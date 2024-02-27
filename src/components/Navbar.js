import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Collapse } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HotelIcon from '@mui/icons-material/Hotel';
import FlightIcon from '@mui/icons-material/Flight';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import AttractionsIcon from '@mui/icons-material/Attractions';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Make sure this CSS file has the required styles

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openServices, setOpenServices] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleServicesClick = () => {
    setOpenServices(!openServices);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setDrawerOpen(false); // Close the drawer on navigation
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            {/* Wrap the img with Link to navigate to the homepage */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', color: 'inherit' }}>
              <img src="/media/logo.png" alt="Logo" style={{ height: '30px' }} />
              {/* You can add text next to the logo if you want */}
            </Link>
          </Typography>
  
          <IconButton color="inherit" onClick={() => handleNavigate('/stays')}>
            <HotelIcon />
          </IconButton>
          <IconButton color="inherit" onClick={() => handleNavigate('/flights')}>
            <FlightIcon />
          </IconButton>
          <IconButton color="inherit" onClick={() => handleNavigate('/experiences')}>
            <AttractionsIcon />
          </IconButton>
          <IconButton color="inherit" onClick={() => handleNavigate('/car-rental')}>
            <DirectionsCarFilledIcon />
          </IconButton>
          <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Button color="inherit">
              Login
            </Button>
          </Link>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          width: 250,
          '& .MuiDrawer-paper': {
            width: 250,
            boxSizing: 'border-box',
            backdropFilter: 'blur(8px)', // Add blur effect to backdrop
            backgroundColor: 'rgba(0, 0, 0, 0.3)', // Example background color with 80% opacity
            display: 'flex',
            flexDirection: 'column',
          },
        }}
        
        
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <List style={{ flexGrow: 1 }}>
            <ListItemButton onClick={() => handleNavigate('/')}>
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
                <ListItemButton sx={{ pl: 11 }} onClick={() => handleNavigate('/land-travel')} className="drawer-subitem">
                  <ListItemText primary={<Typography sx={{ fontStyle: 'italic' }}>Travel</Typography>} />
                </ListItemButton>
                <ListItemButton sx={{ pl: 11 }} onClick={() => handleNavigate('/flights')} className="drawer-subitem">
                  <ListItemText primary={<Typography sx={{ fontStyle: 'italic' }}>Flights</Typography>} />
                </ListItemButton>
                <ListItemButton sx={{ pl: 11 }} onClick={() => handleNavigate('/hotels')} className="drawer-subitem">
                  <ListItemText primary={<Typography sx={{ fontStyle: 'italic' }}>Hotels</Typography>} />
                </ListItemButton>
                <ListItemButton sx={{ pl: 11 }} onClick={() => handleNavigate('/hair-salon')} className="drawer-subitem">
                  <ListItemText primary={<Typography sx={{ fontStyle: 'italic' }}>Hair Salon</Typography>} />
                </ListItemButton>
                <ListItemButton sx={{ pl: 11 }} onClick={() => handleNavigate('/mechanic')} className="drawer-subitem">
                  <ListItemText primary={<Typography sx={{ fontStyle: 'italic' }}>Mechanic</Typography>} />
                </ListItemButton>
                <ListItemButton sx={{ pl: 11 }} onClick={() => handleNavigate('/plumbing')} className="drawer-subitem">
                  <ListItemText primary={<Typography sx={{ fontStyle: 'italic' }}>Plumbing</Typography>} />
                </ListItemButton>
              </List>
            </Collapse>
            <ListItemButton onClick={() => handleNavigate('/about')}>
              <ListItemIcon>
                <InfoIcon />
              </ListItemIcon>
              <ListItemText primary="About Us" />
            </ListItemButton>
            {/* ... (add more list items as needed) */}
          </List>
          <div className="drawer-footer">
            {/* Footer content such as copyright notice */}
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