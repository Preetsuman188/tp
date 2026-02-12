import { AppBar, Box, Button, Toolbar, Typography, Stack, Avatar, Divider, Menu, MenuItem, IconButton } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Navbar() {
  const { pathname } = useLocation();
  const { user, logout, isAdmin, isEditor } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/login');
  };

  const links = [
    { to: "/", label: "Dashboard", show: true },
    { to: "/requests", label: "Requests", show: true },
    { to: "/reminders", label: "Reminders", show: isAdmin },
    { to: "/users", label: "Users", show: isAdmin },
  ];

  return (
    <AppBar position="sticky" elevation={0} sx={{ background: "linear-gradient(90deg, #003366 0%, #0056b3 100%)" }}>
      <Toolbar sx={{ minHeight: 64 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ minWidth: 200 }}>
          {/* Logo Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <Box component="span" sx={{
              bgcolor: 'white',
              color: '#003366',
              borderRadius: '50%',
              mr: 1.5,
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
              T
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "white", letterSpacing: 0.5 }}>
              TATA POWER
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <Stack
            direction="row"
            alignItems="center"
            divider={<Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.3)', my: 1.5 }} />}
          >
            {links.filter(link => link.show).map((link) => (
              <Button
                key={link.label}
                component={Link}
                to={link.to}
                sx={{
                  color: "white",
                  textTransform: 'none',
                  fontWeight: 500,
                  px: 3,
                  opacity: pathname === link.to ? 1 : 0.8,
                  position: 'relative',
                  '&:hover': {
                    opacity: 1,
                    bgcolor: 'transparent'
                  },
                  '&::after': pathname === link.to ? {
                    content: '""',
                    position: 'absolute',
                    bottom: 8,
                    left: 24,
                    right: 24,
                    height: '2px',
                    bgcolor: 'white'
                  } : {}
                }}
              >
                {link.label}
              </Button>
            ))}
          </Stack>
        </Box>

        <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 200, justifyContent: 'flex-end' }}>
          {user ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleMenu}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.2)' }}>
                  {user.name?.charAt(0) || user.username?.charAt(0)}
                </Avatar>
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 500, ml: 1 }}>
                  {user.name || user.username}
                </Typography>
                <ArrowDropDownIcon sx={{ color: 'white' }} />
              </Box>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="subtitle2">{user.name}</Typography>
                  <Typography variant="body2" color="text.secondary">@{user.username} ({user.role})</Typography>
                </Box>
                <Divider />
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              variant="outlined"
              color="inherit"
              component={Link}
              to="/login"
              sx={{ textTransform: 'none', borderColor: 'rgba(255,255,255,0.5)' }}
            >
              Login
            </Button>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
