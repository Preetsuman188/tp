import {
    Box,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Avatar,
    Stack
} from "@mui/material";

const DUMMY_USERS = [
    { id: 1, name: "Amit Sharma", email: "amit.sharma@tatapower.com", role: "Manager" },
    { id: 2, name: "Priya Patel", email: "priya.patel@tatapower.com", role: "Analyst" },
    { id: 3, name: "Rahul Singh", email: "rahul.singh@tatapower.com", role: "Admin" },
    { id: 4, name: "Sneha Gupta", email: "sneha.gupta@tatapower.com", role: "Operator" },
    { id: 5, name: "Vikram Malhotra", email: "vikram.m@tatapower.com", role: "Supervisor" },
];

export default function Users() {
    return (
        <Box
            sx={{
                maxWidth: 1200,
                mx: "auto",
                px: { xs: 2, sm: 4 },
                py: { xs: 4, md: 6 },
            }}
        >
            <Typography variant="h4" fontWeight={700} color="#1e293b" sx={{ mb: 4 }}>
                User Management
            </Typography>

            <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                <CardContent sx={{ p: 0 }}>
                    <TableContainer component={Paper} elevation={0}>
                        <Table sx={{ minWidth: 650 }} aria-label="users table">
                            <TableHead sx={{ bgcolor: "#f8fafc" }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600, color: "#475569" }}>User</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: "#475569" }}>Email</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: "#475569" }}>Role</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {DUMMY_USERS.map((user) => (
                                    <TableRow
                                        key={user.id}
                                        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Avatar sx={{ bgcolor: "#1b4d9b", width: 32, height: 32, fontSize: '0.875rem' }}>
                                                    {user.name.charAt(0)}
                                                </Avatar>
                                                <Stack>
                                                    <Typography variant="body2" fontWeight={500}>
                                                        {user.name}
                                                    </Typography>
                                                </Stack>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">
                                                {user.email}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{
                                                bgcolor: '#e2e8f0',
                                                display: 'inline-block',
                                                px: 1,
                                                borderRadius: 1,
                                                fontSize: '0.8rem',
                                                color: '#334155'
                                            }}>
                                                {user.role}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </Box>
    );
}
