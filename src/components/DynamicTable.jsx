import { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ViewWeekIcon from "@mui/icons-material/ViewWeek";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import * as XLSX from "xlsx";

// ── Excel-style column filter dropdown ──────────────────────────────────────
function ColumnFilterDropdown({ col, rows, activeValues, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  // All unique values for this column
  const allValues = [...new Set(rows.map((r) => String(r[col] ?? "")))].sort();
  const filtered = allValues.filter((v) =>
    v.toLowerCase().includes(search.toLowerCase())
  );

  const isActive =
    activeValues !== null && activeValues !== undefined;

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleToggle = (val) => {
    const current = activeValues ?? allValues;
    const next = current.includes(val)
      ? current.filter((v) => v !== val)
      : [...current, val];
    onChange(next.length === allValues.length ? null : next);
  };

  const handleSelectAll = () => {
    const current = activeValues ?? allValues;
    if (filtered.every((v) => current.includes(v))) {
      // deselect all visible
      const next = (activeValues ?? allValues).filter(
        (v) => !filtered.includes(v)
      );
      onChange(next.length === 0 ? [] : next.length === allValues.length ? null : next);
    } else {
      // select all visible
      const next = [...new Set([...(activeValues ?? allValues), ...filtered])];
      onChange(next.length === allValues.length ? null : next);
    }
  };

  const allFilteredChecked =
    filtered.length > 0 &&
    filtered.every((v) => (activeValues ?? allValues).includes(v));
  const someFilteredChecked =
    filtered.some((v) => (activeValues ?? allValues).includes(v)) &&
    !allFilteredChecked;

  return (
    <Box ref={ref} sx={{ position: "relative", display: "inline-block" }}>
      <IconButton
        size="small"
        onClick={() => setOpen((o) => !o)}
        sx={{
          p: 0.3,
          color: isActive ? "#1a5336" : "#94a3b8",
          "&:hover": { color: "#1a5336" },
        }}
      >
        <FilterListIcon sx={{ fontSize: 14 }} />
      </IconButton>

      {open && (
        <Box
          sx={{
            position: "fixed",
            zIndex: 9999,
            bgcolor: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 2,
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            minWidth: 200,
            maxWidth: 280,
            p: 1,
          }}
          style={{
            top: ref.current
              ? ref.current.getBoundingClientRect().bottom + 4
              : 0,
            left: ref.current
              ? ref.current.getBoundingClientRect().left
              : 0,
          }}
        >
          {/* Search box */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #e2e8f0",
              borderRadius: 1,
              px: 1,
              mb: 0.5,
              bgcolor: "#f8fafc",
            }}
          >
            <SearchIcon sx={{ fontSize: 14, color: "#94a3b8", mr: 0.5 }} />
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              style={{
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: "0.75rem",
                width: "100%",
                padding: "4px 0",
              }}
            />
          </Box>

          {/* Select All */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              px: 0.5,
              py: 0.25,
              borderBottom: "1px solid #f1f5f9",
              mb: 0.5,
              cursor: "pointer",
              "&:hover": { bgcolor: "#f8fafc" },
              borderRadius: 1,
            }}
            onClick={handleSelectAll}
          >
            <Checkbox
              size="small"
              checked={allFilteredChecked}
              indeterminate={someFilteredChecked}
              sx={{ p: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              onChange={handleSelectAll}
            />
            <Typography sx={{ fontSize: "0.75rem", fontWeight: 600 }}>
              (Select All)
            </Typography>
          </Box>

          {/* Value list */}
          <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
            {filtered.length === 0 && (
              <Typography
                sx={{ fontSize: "0.72rem", color: "#94a3b8", px: 1, py: 0.5 }}
              >
                No results
              </Typography>
            )}
            {filtered.map((val) => {
              const checked = (activeValues ?? allValues).includes(val);
              return (
                <Box
                  key={val}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    px: 0.5,
                    py: 0.1,
                    cursor: "pointer",
                    borderRadius: 1,
                    "&:hover": { bgcolor: "#f1f5f9" },
                  }}
                  onClick={() => handleToggle(val)}
                >
                  <Checkbox
                    size="small"
                    checked={checked}
                    sx={{ p: 0.25 }}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => handleToggle(val)}
                  />
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      color: val === "" ? "#94a3b8" : "#1e293b",
                      fontStyle: val === "" ? "italic" : "normal",
                    }}
                  >
                    {val === "" ? "(Blanks)" : val}
                  </Typography>
                </Box>
              );
            })}
          </Box>

          {/* Footer buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 1,
              mt: 1,
              pt: 0.5,
              borderTop: "1px solid #f1f5f9",
            }}
          >
            <Button
              size="small"
              variant="outlined"
              onClick={() => { onChange(null); setOpen(false); }}
              sx={{
                fontSize: "0.7rem",
                textTransform: "none",
                py: 0.25,
                px: 1,
                borderColor: "#e2e8f0",
                color: "#64748b",
              }}
            >
              Clear
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={() => setOpen(false)}
              sx={{
                fontSize: "0.7rem",
                textTransform: "none",
                py: 0.25,
                px: 1,
                bgcolor: "#1a5336",
                "&:hover": { bgcolor: "#15432b" },
              }}
            >
              OK
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}

// ── Main DynamicTable ────────────────────────────────────────────────────────
export default function DynamicTable({
  columns = ["Column 1", "Column 2"],
  data = [],
  onDataChange,
  onColumnsChange,
  height = 400,
  editable = true,
  allowColumnManagement = false,
  minRows = 1,
}) {
  const [rows, setRows] = useState([]);
  // null = no filter (show all); array = only show these values
  const [columnFilters, setColumnFilters] = useState({});

  // Derived: rows filtered by columnFilters
  const filteredRows = rows
    .map((row, originalIndex) => ({ row, originalIndex }))
    .filter(({ row }) =>
      columns.every((col) => {
        const allowed = columnFilters[col];
        if (!allowed) return true; // null = no filter
        return allowed.includes(String(row[col] ?? ""));
      })
    );

  // Initialize rows from props
  useEffect(() => {
    if (data && data.length > 0) {
      setRows(data);
    } else {
      if (editable) {
        const initialRows = Array.from({ length: Math.max(minRows, 1) }, () => {
          const emptyRow = {};
          columns.forEach((col) => { emptyRow[col] = ""; });
          return emptyRow;
        });
        setRows(initialRows);
      } else {
        setRows([]);
      }
    }
  }, [data, columns, editable, minRows]);



  const handleCellChange = (rowIndex, column, value) => {
    const newRows = [...rows];
    newRows[rowIndex] = { ...newRows[rowIndex], [column]: value };
    setRows(newRows);
    if (onDataChange) onDataChange(newRows);
  };

  const handleAddRow = () => {
    const newRow = {};
    columns.forEach((col) => { newRow[col] = ""; });
    const newRows = [...rows, newRow];
    setRows(newRows);
    if (onDataChange) onDataChange(newRows);
  };



  const handleAddColumn = () => {
    const name = window.prompt("Enter new column name:");
    if (name && !columns.includes(name)) {
      if (onColumnsChange) onColumnsChange([...columns, name]);
    }
  };

  const handleDeleteColumn = (colToDelete) => {
    if (window.confirm(`Delete column "${colToDelete}"?`)) {
      if (onColumnsChange)
        onColumnsChange(columns.filter((c) => c !== colToDelete));
    }
  };

  const showColumnActions = editable || allowColumnManagement;

  const getColumnLetter = (index) => {
    let letter = "";
    while (index >= 0) {
      letter = String.fromCharCode((index % 26) + 65) + letter;
      index = Math.floor(index / 26) - 1;
    }
    return letter;
  };

  const handleDownloadExcel = () => {
    const exportData = rows.map((row) => columns.map((col) => row[col] || ""));
    const worksheet = XLSX.utils.aoa_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "table_data.xlsx");
  };

  const setColFilter = (col, val) => {
    setColumnFilters((prev) => ({ ...prev, [col]: val }));
  };

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#fff",
        borderRadius: 2,
        overflow: "hidden",
        border: "1px solid #e5e7eb",
      }}
    >
      {/* Toolbar */}
      <Box
        sx={{
          bgcolor: "#1a5336",
          color: "white",
          p: "4px 8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: 48,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ height: 48, px: 3, display: "flex", alignItems: "center" }}>
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, fontSize: "0.75rem", letterSpacing: 0.5 }}
            >
              HOME
            </Typography>
          </Box>
        </Box>

        <Stack direction="row" spacing={1.5} sx={{ mr: 1 }}>
          <Button
            variant="contained"
            size="small"
            startIcon={<DownloadIcon sx={{ fontSize: 16 }} />}
            onClick={handleDownloadExcel}
            sx={{
              bgcolor: "rgba(255,255,255,0.15)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.25)" },
              textTransform: "none",
              fontSize: "0.75rem",
              fontWeight: 600,
              borderRadius: 2,
              px: 2,
            }}
          >
            Download
          </Button>

          {showColumnActions && (
            <>
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon sx={{ fontSize: 16 }} />}
                onClick={handleAddRow}
                sx={{
                  bgcolor: "rgba(255,255,255,0.15)",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.25)" },
                  textTransform: "none",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 2,
                }}
              >
                Add Row
              </Button>
              <Button
                variant="contained"
                size="small"
                startIcon={<ViewWeekIcon sx={{ fontSize: 16 }} />}
                onClick={handleAddColumn}
                sx={{
                  bgcolor: "rgba(255,255,255,0.15)",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.25)" },
                  textTransform: "none",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 2,
                }}
              >
                Add Column
              </Button>
            </>
          )}
        </Stack>
      </Box>

      <TableContainer
        sx={{
          maxHeight: height,
          "& .MuiTableCell-root": {
            border: "1px solid #e5e7eb",
            p: 1,
            lineHeight: 1,
          },
        }}
      >
        <Table stickyHeader size="small">
          <TableHead>
            {/* Column Letters Row — with filter icon per column */}
            <TableRow>
              <TableCell
                sx={{
                  bgcolor: "#f8fafc",
                  width: 40,
                  borderRight: "1px solid #e2e8f0",
                  textAlign: "center",
                }}
              />

              {columns.map((col, idx) => (
                <TableCell
                  key={`letter-${idx}`}
                  align="center"
                  sx={{
                    bgcolor: "#f8fafc",
                    color: "#64748b",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    py: 0.25,
                    borderBottom: "none",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 0.5,
                    }}
                  >
                    {getColumnLetter(idx)}
                    <ColumnFilterDropdown
                      col={col}
                      rows={rows}
                      activeValues={columnFilters[col] ?? null}
                      onChange={(val) => setColFilter(col, val)}
                    />
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredRows.map(({ row, originalIndex }) => {
              return (
                <TableRow
                  key={originalIndex}
                  sx={{
                    bgcolor: originalIndex % 2 === 0 ? "#fff" : "#f8fafc",
                    "&:hover": { bgcolor: "#f1f5f9" },
                  }}
                >
                  {/* Row Number */}
                  <TableCell
                    align="center"
                    sx={{
                      bgcolor: "#f1f5f9",
                      color: "#64748b",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      borderRight: "1px solid #e2e8f0 !important",
                      width: 40,
                    }}
                  >
                    {originalIndex + 1}
                  </TableCell>



                  {columns.map((col) => (
                    <TableCell key={`${originalIndex}-${col}`}>
                      {editable ? (
                        <TextField
                          fullWidth
                          size="small"
                          variant="standard"
                          value={row[col] || ""}
                          onChange={(e) =>
                            handleCellChange(originalIndex, col, e.target.value)
                          }
                          InputProps={{ disableUnderline: true }}
                          sx={{
                            "& .MuiInputBase-root": {
                              fontSize: "0.875rem",
                              px: 1.5,
                              py: 0.75,
                              "&:focus-within": {
                                outline: "2px solid #1a5336",
                                outlineOffset: "-2px",
                                zIndex: 1,
                                bgcolor: "white",
                              },
                            },
                          }}
                        />
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{ px: 1.5, py: 0.75 }}
                        >
                          {row[col]}
                        </Typography>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
