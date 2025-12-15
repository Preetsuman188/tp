import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { Link, useLocation, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useRequests } from "../context/RequestContext";
import DynamicTable from "../components/DynamicTable";

export default function RequestDetail() {
  const { id } = useParams();
  const location = useLocation();
  const { requests, addSubmission, markCompleted } = useRequests();
  const request = requests.find((r) => r.id === id);
  const [department, setDepartment] = useState("");
  const [comment, setComment] = useState("");
  const [toastMessage, setToastMessage] = useState(location.state?.requestCreatedMessage || "");
  const [showToast, setShowToast] = useState(Boolean(location.state?.requestCreatedMessage));

  const combinedRows = useMemo(() => {
    if (!request) return [];
    return request.submissions.flatMap((s) =>
      s.rows.map((row) => ({ ...row, __department: s.department }))
    );
  }, [request]);

  if (!request) {
    return (
      <Box className="max-w-4xl mx-auto px-6 py-10">
        <Typography variant="h6">Request not found.</Typography>
        <Button component={Link} to="/" sx={{ mt: 2 }}>
          Back to dashboard
        </Button>
      </Box>
    );
  }

  const handleQuickComplete = () => {
    markCompleted(request.id);
  };

  const handleMockSubmit = () => {
    if (!department.trim()) return;
    addSubmission(request.id, {
      department,
      rows: [{ Comment: comment || "Submitted" }],
      completed: true,
    });
    setDepartment("");
    setComment("");
  };

  useEffect(() => {
    if (location.state?.requestCreatedMessage) {
      setToastMessage(location.state.requestCreatedMessage);
      setShowToast(true);
    }
  }, [location.state]);

  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        px: { xs: 3, sm: 4, md: 6 },
        py: { xs: 6, md: 8 },
      }}
      className="space-y-6"
    >
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5} alignItems={{ xs: "flex-start", sm: "center" }}>
        <Typography variant="h4" fontWeight={700}>
          {request.title}
        </Typography>
        <Chip label={request.format} />
        <Chip
          label={request.status}
          color={request.status === "Completed" ? "success" : "warning"}
          variant="outlined"
        />
        <Box sx={{ flex: 1 }} />
        <Button variant="contained" onClick={handleQuickComplete}>
          Mark completed
        </Button>
      </Stack>

      <Grid container spacing={{ xs: 2.5, md: 3 }}>
        <Grid item xs={12} md={8}>
          <Card className="shadow-sm h-full">
            <CardContent className="space-y-3">
              <Typography variant="h6">Request details</Typography>
              <Typography color="text.secondary">
                Deadline: {request.deadline || "Not set"}
              </Typography>
              <Typography color="text.secondary">
                Departments: {request.departments.join(", ")}
              </Typography>
              <Typography color="text.secondary">Emails: {request.emails.join(", ")}</Typography>
              <Typography color="text.secondary">Instructions: {request.instructions}</Typography>
              <Divider />
              <Typography variant="subtitle2" gutterBottom>
                Template fields
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {(request.columns || []).map((col) => (
                  <Chip key={col} label={col} variant="outlined" />
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card className="shadow-sm h-full">
            <CardContent className="space-y-2">
              <Typography variant="h6">Reminders</Typography>
              {request.reminders?.enabled ? (
                <>
                  <Typography color="text.secondary">
                    Frequency: {request.reminders.frequency}
                  </Typography>
                  <Typography color="text.secondary">
                    Auto-mails go to: {request.emails.join(", ")}
                  </Typography>
                </>
              ) : (
                <Typography color="text.secondary">Reminders are disabled.</Typography>
              )}
              <Divider />
              <Typography variant="subtitle2">Manual submission (quick demo)</Typography>
              <TextField
                label="Department"
                size="small"
                fullWidth
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
              <TextField
                label="Notes"
                size="small"
                fullWidth
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <Button onClick={handleMockSubmit} variant="outlined" fullWidth>
                Submit data
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card className="shadow-sm">
        <CardContent className="space-y-2">
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems={{ xs: "flex-start", sm: "center" }}>
            <Typography variant="h6">Combined sheet (live)</Typography>
            <Typography color="text.secondary">
              Auto-generated as each division updates their rows.
            </Typography>
          </Stack>
          <DynamicTable columns={request.columns} />
          <Typography variant="body2" color="text.secondary">
            Above grid is interactive for users with edit permission; viewers can only see the live combined data.
          </Typography>
          {combinedRows.length > 0 && (
            <Box className="rounded-md border border-dashed border-slate-200 p-3">
              <Typography variant="subtitle2" gutterBottom>
                Recent combined rows (read-only snapshot)
              </Typography>
              <pre className="text-xs bg-slate-50 p-3 rounded-md overflow-x-auto">
                {JSON.stringify(combinedRows.slice(-5), null, 2)}
              </pre>
            </Box>
          )}
        </CardContent>
      </Card>

      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button component={Link} to="/" variant="text">
          Back to dashboard
        </Button>
        <Button component={Link} to="/request/new" variant="contained">
          Launch another request
        </Button>
      </Stack>

      <Snackbar
        open={showToast}
        autoHideDuration={4000}
        onClose={() => setShowToast(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setShowToast(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toastMessage || "Request sent to all recipients."}
        </Alert>
      </Snackbar>
    </Box>
  );
}
