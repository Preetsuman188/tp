import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/request/new", label: "New Request" },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <AppBar position="sticky" elevation={0} color="inherit">
      <Toolbar className="bg-white border-b border-slate-100">
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#1b4d9b" }}>
          TATA Power | Data Exchange
        </Typography>
        <Box sx={{ flex: 1 }} />
        <Box className="flex gap-2">
          {links.map((link) => (
            <Button
              key={link.to}
              component={Link}
              to={link.to}
              variant={pathname === link.to ? "contained" : "text"}
              color="primary"
            >
              {link.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
