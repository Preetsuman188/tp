import { Box, Stack, Typography } from "@mui/material";
import RequestForm from "../components/RequestForm";

export default function CreateRequest() {
  return (
    <Box
      sx={{
        width: "100%",
        mx: "auto",
        p: { xs: 2, md: 4 },
      }}
    >
      <Stack sx={{ backgroundColor: "#fff", p: 7, borderRadius: 3, gap: 2 }}>

        <Typography variant="h5" fontWeight={700}>
          Create a new data request
        </Typography>

        <Typography color="text.secondary">
          Choose the format, define the template, set deadlines and reminders, and send it to relevant divisions.
        </Typography>
        <RequestForm />

      </Stack>
    </Box>
  );
}
