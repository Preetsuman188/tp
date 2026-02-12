import { AppBar, Box, Button, Toolbar, Typography, Stack, Avatar, Divider } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/requests", label: "Requests" },
  { to: "/reminders", label: "Reminders" },
  { to: "/users", label: "Users" },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <AppBar position="sticky" elevation={0} sx={{ background: "linear-gradient(90deg, #003366 0%, #0056b3 100%)" }}>
      <Toolbar sx={{ minHeight: 64 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ minWidth: 200 }}>
          {/* Logo Section */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
            {links.map((link) => (
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

        <Stack direction="row" alignItems="center" spacing={1} sx={{ cursor: 'pointer', minWidth: 200, justifyContent: 'flex-end' }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.2)' }} />
          <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>Admin</Typography>
          <ArrowDropDownIcon sx={{ color: 'white' }} />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
