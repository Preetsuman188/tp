import { Box, Typography, Container } from "@mui/material";
import { useRequests } from "../context/RequestContext";
import RequestTable from "../components/RequestTable";

export default function Requests() {
    const { requests } = useRequests();

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={700} color="#1e293b" gutterBottom>
                    All Requests
                </Typography>
                <Typography color="text.secondary">
                    View and manage all your data collection requests.
                </Typography>
            </Box>

            <RequestTable requests={requests} />
        </Container>
    );
}
