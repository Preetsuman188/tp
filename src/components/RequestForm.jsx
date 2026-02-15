import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Chip,
  FormControlLabel,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
  Divider,
  Autocomplete,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DynamicTable from "./DynamicTable";
import { Link, useNavigate } from "react-router-dom";
import { useRequests } from "../context/RequestContext";
import { sendRequestEmails } from "../services/emailService";
import { api } from "../services/api";

const APP_BASE_URL = import.meta.env.VITE_APP_BASE_URL || window.location.origin;

const DEFAULT_EMAIL_BODY = [
  "Hi team,",
  "",
  "A new data request is ready for you. Please submit your input using the link below.",
  "Request: {{title}}",
  "Deadline: {{deadline}}",
  "Instructions: {{instructions}}",
  "Link: {{link}}",
  "",
  "Thanks,",
  "Data Office",
].join("\n");

const reminderOptions = [
  { value: "hourly", label: "Every Hour" },
  { value: "daily", label: "Daily" },
  { value: "alternate", label: "Alternate days" },
  { value: "weekly", label: "Weekly" },
];

export default function RequestForm() {
  const { addRequest } = useRequests();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [departments, setDepartments] = useState([]);
  const [emails, setEmails] = useState([]);
  const [format, setFormat] = useState("Excel");
  const [deadline, setDeadline] = useState("");
  const [reminderOn, setReminderOn] = useState(true);
  const [frequency, setFrequency] = useState("weekly");
  const [columns, setColumns] = useState(
    Array.from({ length: 10 }, (_, i) => `Column ${i + 1}`)
  );
  const [instructions, setInstructions] = useState("");
  const [templateContent, setTemplateContent] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [hasEditedSubject, setHasEditedSubject] = useState(false);
  const [emailBody, setEmailBody] = useState(DEFAULT_EMAIL_BODY);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialRows, setInitialRows] = useState([]);
  const [templateFile, setTemplateFile] = useState(null);
  const [availableEmails, setAvailableEmails] = useState([]);

  useEffect(() => {
    fetchUserEmails();
  }, []);

  const fetchUserEmails = async () => {
    try {
      const data = await api.getUsers();
      // Store user objects for richer display in Autocomplete
      const users = data.map(u => ({
        name: u.name || "N/A",
        email: u.username
      })).filter(u => u.email);
      setAvailableEmails(users);
    } catch (err) {
      console.error("Failed to fetch users for suggestions", err);
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const addChip = (value, setter) => {
    if (!value.trim()) return;

    // Split by comma or semicolon to support multiple inputs at once
    const values = value.split(/[;,]+/).map(v => v.trim()).filter(v => v !== "");

    if (setter === setEmails) {
      const validEmails = values.filter(v => isValidEmail(v));
      if (validEmails.length > 0) {
        setter((prev) => [...new Set([...prev, ...validEmails])]);
      }
    } else {
      setter((prev) => [...new Set([...prev, ...values])]);
    }
  };

  const removeChip = (value, setter) => {
    setter((prev) => prev.filter((item) => item !== value));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setTemplateFile({
        name: file.name,
        type: file.type,
        size: file.size,
        content: reader.result, // Base64 string
      });
    };
    reader.readAsDataURL(file);
  };

  const removeFile = () => setTemplateFile(null);

  const hydrateTemplate = (template, linkValue) =>
    (template || "")
      .replaceAll("{{title}}", title || "Data request")
      .replaceAll("{{deadline}}", deadline || "Not specified")
      .replaceAll("{{instructions}}", instructions || "See request for details")
      .replaceAll("{{link}}", linkValue);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    let id = "";
    try {
      const finalEmails = emails;

      id = await addRequest({
        title,
        departments,
        emails: finalEmails,
        format,
        deadline,
        reminders: { enabled: reminderOn, frequency },
        columns,
        initialRows,
        instructions,
        templateContent,
        emailSubject,
        emailBody,
        templateFile,
      });

      const link = `${APP_BASE_URL.replace(/\/$/, "")}/request/${id}`;
      const hydratedSubject = hydrateTemplate(emailSubject, link);
      const hydratedBody = hydrateTemplate(emailBody, link);

      const emailResult = await sendRequestEmails({
        emails: finalEmails,
        title,
        deadline,
        link,
        subject: hydratedSubject,
        body: hydratedBody,
      });

      const recipientSummary = finalEmails.length === 0
        ? "Request created. No recipients provided."
        : emailResult?.delivered
          ? `Request sent to ${finalEmails.length} recipient(s).`
          : "Request created, but email delivery uncertain.";

      navigate(`/request/${id}`, { state: { requestCreatedMessage: recipientSummary } });
    } catch (err) {
      console.error(err);
      if (id) {
        navigate(`/request/${id}`, { state: { requestCreatedMessage: "Request created, but email sending failed." } });
      } else {
        alert("Failed to create request.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={4}>

        {/* Basic Info: Title & Deadline */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <TextField
              required
              fullWidth
              label="Data name"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!hasEditedSubject) setEmailSubject(e.target.value);
              }}
              size="small"
              placeholder="e.g. Monthly Performance Data"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              type="date"
              label="Deadline"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              size="small"
            />
          </Grid>
        </Grid>

        {/* Divisions / Departments Section */}
        <Box>
          <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ color: '#0f172a' }}>
            Division / Department
          </Typography>
          <Stack direction="row" spacing={1} sx={{ maxWidth: 600 }}>
            <TextField
              fullWidth
              placeholder="Type department and press Enter"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addChip(e.currentTarget.value, setDepartments);
                  e.currentTarget.value = "";
                }
              }}
              size="small"
            />
            <Button
              size="small"
              variant="contained"
              onClick={(e) => {
                const input = e.currentTarget.parentElement.querySelector('input');
                addChip(input.value, setDepartments);
                input.value = "";
              }}
              sx={{ textTransform: 'none', px: 3, bgcolor: '#0f4c81', height: 40 }}
            >
              Add
            </Button>
          </Stack>
          {departments.length > 0 && (
            <Box sx={{ mt: 1.5, p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
              <Grid container spacing={1}>
                {departments.map((dept) => (
                  <Grid item key={dept}>
                    <Chip
                      label={dept}
                      onDelete={() => removeChip(dept, setDepartments)}
                      size="small"
                      variant="filled"
                      sx={{ bgcolor: '#e2e8f0', fontWeight: 500 }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>

        {/* Recipient Emails Section */}
        <Box>
          <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ color: '#0f172a' }}>
            Recipient Emails
          </Typography>
          <Autocomplete
            multiple
            freeSolo
            options={availableEmails}
            getOptionLabel={(option) => {
              if (typeof option === 'string') return option;
              return option.email;
            }}
            value={emails}
            onChange={(event, newValue) => {
              // Extract emails from whatever was selected/typed
              const processed = newValue.map(item => {
                if (typeof item === 'string') return item;
                return item.email;
              });
              // Filter for valid emails
              const validOnly = processed.filter(val => isValidEmail(val));
              setEmails([...new Set(validOnly)]);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                placeholder={emails.length === 0 ? "Select or type emails..." : ""}
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option}
                  label={option}
                  size="small"
                  sx={{
                    bgcolor: '#f1f5f9',
                    borderRadius: 1,
                    border: '1px solid #cbd5e1',
                    fontWeight: 500
                  }}
                />
              ))
            }
            renderOption={(props, option) => (
              <li {...props} key={option.email}>
                <Box>
                  <Typography variant="body2" fontWeight={600}>{option.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{option.email}</Typography>
                </Box>
              </li>
            )}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: '#fff',
                borderRadius: 2
              }
            }}
          />
        </Box>

        {/* Row 2: Controls */}
        <Stack direction="row" flexWrap="wrap" gap={3} alignItems="center">
          <Box>
            <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>Format</Typography>
            <TextField
              select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              size="small"
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="Excel">Excel</MenuItem>
              <MenuItem value="Word">Word</MenuItem>
              <MenuItem value="PDF">PDF</MenuItem>
            </TextField>
          </Box>

          <Box sx={{ pt: 2.5 }}>
            <FormControlLabel
              control={<Switch checked={reminderOn} onChange={() => setReminderOn(!reminderOn)} />}
              label="Send automatic reminders"
              sx={{ mr: 0 }}
            />
          </Box>

          {reminderOn && (
            <Box>
              <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>Reminder frequency</Typography>
              <TextField
                select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                size="small"
                sx={{ minWidth: 150 }}
              >
                {reminderOptions.map(opt => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </TextField>
            </Box>
          )}
        </Stack>

        {/* Row 3: Instructions */}
        <TextField
          fullWidth
          label="Instructions / acceptance criteria"
          multiline
          minRows={3}
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Describe the data requirements..."
        />

        {/* Row 4: Split Section */}
        {format !== "Excel" ? (
          <Grid container spacing={4}>
            {/* Left: Format Specific or Extras */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                {format} Document Content
              </Typography>

              {format === "Word" ? (
                <Box sx={{ position: 'relative' }}>
                  <TextField
                    fullWidth
                    multiline
                    minRows={10}
                    value={templateContent}
                    onChange={(e) => setTemplateContent(e.target.value)}
                    placeholder="Enter the text content for the Word document template..."
                    sx={{
                      bgcolor: '#fff',
                      '& .MuiInputBase-root': {
                        fontFamily: '"Times New Roman", Times, serif',
                        fontSize: '1.1rem',
                        lineHeight: 1.5,
                        padding: '24px'
                      }
                    }}
                  />
                  <Box sx={{ position: 'absolute', top: 0, right: 0, bgcolor: '#2b579a', color: 'white', px: 1, borderRadius: '0 4px 0 4px', fontSize: '10px', fontWeight: 'bold' }}>WORD MODE</Box>
                </Box>
              ) : (
                <Box sx={{ position: 'relative' }}>
                  <TextField
                    fullWidth
                    multiline
                    minRows={10}
                    value={templateContent}
                    onChange={(e) => setTemplateContent(e.target.value)}
                    placeholder="Define the PDF layout content..."
                    sx={{
                      bgcolor: '#fff',
                      '& .MuiInputBase-root': {
                        fontFamily: 'monospace',
                        fontSize: '0.9rem',
                        padding: '24px',
                        border: '2px solid #ed1c24'
                      }
                    }}
                  />
                  <Box sx={{ position: 'absolute', top: 0, right: 0, bgcolor: '#ed1c24', color: 'white', px: 1, borderRadius: '0 4px 0 4px', fontSize: '10px', fontWeight: 'bold' }}>PDF MODE</Box>
                </Box>
              )}
            </Grid>

            {/* Right: Email Template */}
            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary" mb={1} display="block">Email template</Typography>
              <TextField
                fullWidth
                multiline
                minRows={10}
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                sx={{ bgcolor: '#fff' }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                Placeholders: &#123;&#123;title&#125;&#125;, &#123;&#123;deadline&#125;&#125;, &#123;&#123;link&#125;&#125;
              </Typography>
            </Grid>
          </Grid>
        ) : (
          <Box>
            <Typography variant="caption" color="text.secondary" mb={1} display="block">Email template</Typography>
            <TextField
              fullWidth
              multiline
              minRows={6}
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              sx={{ bgcolor: '#fff' }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              Placeholders: &#123;&#123;title&#125;&#125;, &#123;&#123;deadline&#125;&#125;, &#123;&#123;link&#125;&#125;
            </Typography>
          </Box>
        )}

        {/* Row 5: Dynamic Table (Excel Only) */}
        {format === "Excel" && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h5" fontWeight={700} color="#1e293b" gutterBottom>
              Excel Template
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Define columns to auto-build the sheet.
            </Typography>
            <DynamicTable
              columns={columns}
              onColumnsChange={setColumns}
              data={initialRows}
              onDataChange={setInitialRows}
              height={400}
              editable={true}
              allowColumnManagement={true}
              minRows={7}
            />
          </Box>
        )}

        {/* Row 6: Upload */}
        <Box>
          <Typography variant="subtitle2" fontWeight={700}>Upload template <Typography component="span" variant="body2" color="text.secondary" fontWeight={400}>(Optional)</Typography></Typography>
          {!templateFile ? (
            <Button
              component="label"
              variant="outlined"
              startIcon={<UploadFileIcon />}
              sx={{ mt: 1, textTransform: 'none' }}
            >
              UPLOAD TEMPLATE
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
          ) : (
            <Stack direction="row" spacing={1} alignItems="center" mt={1}>
              <Chip
                icon={<UploadFileIcon />}
                label={templateFile.name}
                onDelete={removeFile}
                color="primary"
                variant="outlined"
              />
              <Typography variant="caption" color="text.secondary">
                ({(templateFile.size / 1024).toFixed(1)} KB)
              </Typography>
            </Stack>
          )}
        </Box>

        {/* Footer Actions */}
        <Stack direction="row" spacing={2} sx={{ pt: 2, borderTop: '1px solid #f1f5f9' }}>
          <Button component={Link} to="/" variant="outlined" color="inherit" sx={{ px: 4 }}>
            CANCEL
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{ bgcolor: '#0f4c81', px: 4, py: 1.2 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Save & issue request"}
          </Button>
        </Stack>

      </Stack>
    </form>
  );
}
