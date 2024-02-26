import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItemButton, ListItemText, Collapse } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import './Navbar.css'; // Import custom CSS for Navbar styling

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openServices, setOpenServices] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsOpen(open);
  };

  const handleServicesClick = () => {
    setOpenServices(!openServices);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false); // Close the drawer on navigation
  };

  return (
    <>
      <AppBar position="static" className="navbar">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Booking Services
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={isOpen} onClose={toggleDrawer(false)}>
        <div className="drawer">
          <List>
            <ListItemButton onClick={() => handleNavigate('/')} className="drawer-item">
              <ListItemText primary="Home" />
            </ListItemButton>
            <ListItemButton onClick={handleServicesClick} className="drawer-item">
              <ListItemText primary="Services" />
              {openServices ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openServices} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/hair-salon')} className="drawer-subitem">
                  <ListItemText primary="Hair Salon" />
                </ListItemButton>
                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/mechanic')} className="drawer-subitem">
                  <ListItemText primary="Mechanic" />
                </ListItemButton>
                <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/plumbing')} className="drawer-subitem">
                  <ListItemText primary="Plumbing" />
                </ListItemButton>
              </List>
            </Collapse>
            <ListItemButton onClick={() => handleNavigate('/about')} className="drawer-item">
              <ListItemText primary="About Us" />
            </ListItemButton>
          </List>
        </div>
      </Drawer>
    </>
  );
};

export default Navbar;
