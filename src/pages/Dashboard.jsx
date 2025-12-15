import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";
import { useRequests } from "../context/RequestContext";

export default function Dashboard() {
  const { requests } = useRequests();

  const pending = requests.filter((r) => r.status !== "Completed").length;
  const completed = requests.filter((r) => r.status === "Completed").length;
  const withReminders = requests.filter((r) => r.reminders?.enabled).length;

  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        px: { xs: 3, sm: 4, md: 6 },
        py: { xs: 6, md: 8 },
      }}
      className="space-y-7"
    >
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center">
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Data request workspace
          </Typography>
          <Typography color="text.secondary">
            Create, assign, remind, and track every division’s submissions in one place.
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }} />
        <Button component={Link} to="/request/new" variant="contained">
          New request
        </Button>
      </Stack>

      <Grid container spacing={{ xs: 2.5, md: 3 }}>
        {[
          { label: "Open requests", value: pending, color: "primary" },
          { label: "Completed", value: completed, color: "secondary" },
          { label: "Auto-reminders active", value: withReminders, color: "info" },
        ].map((item) => (
          <Grid key={item.label} item xs={12} md={4}>
            <Card className="shadow-sm">
              <CardContent>
                <Typography color="text.secondary">{item.label}</Typography>
                <Typography variant="h4" fontWeight={700}>
                  {item.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card className="shadow-sm">
        <CardContent>
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems={{ xs: "flex-start", md: "center" }}
            spacing={2}
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h6">Live requests</Typography>
              <Typography color="text.secondary">
                Track deadlines, reminders, and completion in real time.
              </Typography>
            </Box>
            <Button component={Link} to="/request/new" variant="outlined">
              Create request
            </Button>
          </Stack>

          <Divider sx={{ my: 2 }} />

          <List disablePadding>
            {requests.map((req) => {
              const total = req.departments.length;
              const done = req.submissions.filter((s) => s.completed).length;
              const progress = total === 0 ? 0 : Math.round((done / total) * 100);
              return (
                <ListItem
                  key={req.id}
                  alignItems="flex-start"
                  sx={{ mb: 1.5, pb: 1.5, borderBottom: "1px solid #e5e7eb" }}
                  secondaryAction={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        label={req.status}
                        color={req.status === "Completed" ? "success" : "warning"}
                        variant="outlined"
                      />
                      <Button component={Link} to={`/request/${req.id}`} size="small">
                        View
                      </Button>
                    </Stack>
                  }
                >
                  <ListItemText
                    primary={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography fontWeight={700}>{req.title}</Typography>
                        <Chip size="small" label={req.format} />
                      </Stack>
                    }
                    secondary={
                      <Box className="space-y-1">
                        <Typography color="text.secondary">
                          Departments: {req.departments.join(", ")}
                        </Typography>
                        <Typography color="text.secondary">
                          Deadline: {req.deadline || "—"}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={progress}
                          sx={{ height: 6, borderRadius: 999 }}
                        />
                      </Box>
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}
