import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function Placeholder({ title }) {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "60vh",
                textAlign: "center",
                p: 3,
            }}
        >
            <Typography variant="h4" fontWeight={700} color="#cbd5e1" gutterBottom>
                {title || "Coming Soon"}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
                This page is under construction.
            </Typography>
            <Button variant="outlined" component={Link} to="/">
                Back to Dashboard
            </Button>
        </Box>
    );
}
