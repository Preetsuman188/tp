import {
    Box,
    Card,
    CardContent,
    Container,
    Grid,
    Typography,
    LinearProgress,
    Stack,
    Chip,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { useRequests } from "../context/RequestContext";

export default function Reminders() {
    const { requests } = useRequests();

    // Filter requests with reminders enabled and not completed
    const activeReminders = requests.filter(
        (r) => r.reminders?.enabled && r.status !== "Completed"
    );

    // Dummy logic for "Sent" counts since we don't track actual emails in this demo
    // We'll assume for each active reminder, some have been sent based on a mock calculation
    const totalSent = activeReminders.length * 3 + 12; // Dummy "Sent" count
    const todaySent = Math.floor(activeReminders.length / 2); // Dummy "Sent Today"

    const stats = [
        {
            label: "Active Reminders",
            value: activeReminders.length,
            icon: <NotificationsActiveIcon sx={{ color: "#d97706" }} />,
            color: "#fef3c7", // amber-100
        },
        {
            label: "Reminders Sent (Total)",
            value: totalSent,
            icon: <MarkEmailReadIcon sx={{ color: "#059669" }} />,
            color: "#d1fae5", // emerald-100
        },
        {
            label: "Scheduled Today",
            value: activeReminders.length > 0 ? activeReminders.length : 0,
            icon: <ScheduleIcon sx={{ color: "#2563eb" }} />,
            color: "#dbeafe", // blue-100
        },
    ];

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={700} color="#1e293b" gutterBottom>
                    Reminders Center
                </Typography>
                <Typography color="text.secondary">
                    Track automated follow-ups and delivery status.
                </Typography>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {stats.map((stat) => (
                    <Grid item xs={12} md={4} key={stat.label}>
                        <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                            <CardContent>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <Box
                                        sx={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: "50%",
                                            bgcolor: stat.color,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        {stat.icon}
                                    </Box>
                                    <Box>
                                        <Typography variant="h4" fontWeight={700}>
                                            {stat.value}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                            {stat.label}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Active Reminders List */}
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: "#334155" }}>
                Active Automated Reminders
            </Typography>
            <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e5e7eb", borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ bgcolor: "#f9fafb" }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Request Name</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Frequency</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Next Scheduled</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {activeReminders.length > 0 ? (
                            activeReminders.map((req) => (
                                <TableRow key={req.id}>
                                    <TableCell>
                                        <Typography fontWeight={500}>{req.title}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {req.emails?.length || 0} recipient(s)
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={req.reminders?.frequency || "Daily"}
                                            size="small"
                                            sx={{ bgcolor: '#f1f5f9', fontWeight: 500 }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {/* Mocking next date as tomorrow */}
                                            {new Date(Date.now() + 86400000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip label="Active" size="small" color="success" variant="outlined" />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                                    <Typography color="text.secondary">No active reminders running.</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}
