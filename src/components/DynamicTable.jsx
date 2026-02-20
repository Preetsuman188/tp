import { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";

// Icons
import ViewWeekIcon from "@mui/icons-material/ViewWeek";
import DownloadIcon from "@mui/icons-material/Download";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import FormatPaintIcon from "@mui/icons-material/FormatPaint";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import FontDownloadIcon from "@mui/icons-material/FontDownload";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import VerticalAlignTopIcon from "@mui/icons-material/VerticalAlignTop";
import VerticalAlignCenterIcon from "@mui/icons-material/VerticalAlignCenter";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import WrapTextIcon from "@mui/icons-material/WrapText";
import MergeTypeIcon from "@mui/icons-material/MergeType";
import PercentIcon from "@mui/icons-material/Percent";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import FunctionsIcon from "@mui/icons-material/Functions";
import BorderAllIcon from "@mui/icons-material/BorderAll";
import DeleteIcon from "@mui/icons-material/Delete";
import FormatLineSpacingIcon from "@mui/icons-material/FormatLineSpacing";
import SortIcon from "@mui/icons-material/Sort";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ClearIcon from "@mui/icons-material/Clear";
import ExcelJS from "exceljs";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const FONT_FAMILIES = ["Calibri", "Arial", "Times New Roman", "Courier New", "Georgia", "Verdana", "Trebuchet MS"];
const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];
const NUMBER_FORMATS = ["General", "Number", "Currency", "Accounting", "Short Date", "Long Date", "Time", "Percentage", "Fraction", "Scientific", "Text"];

function formatCellValue(value, format) {
  if (value === "" || value === null || value === undefined) return value;
  const num = parseFloat(value);
  switch (format) {
    case "Number": return isNaN(num) ? value : num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    case "Currency": return isNaN(num) ? value : `$${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    case "Accounting": return isNaN(num) ? value : `$ ${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    case "Short Date": { const d = new Date(value); return isNaN(d) ? value : `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`; }
    case "Long Date": { const d = new Date(value); return isNaN(d) ? value : d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }); }
    case "Time": { const d = new Date(value); return isNaN(d) ? value : d.toLocaleTimeString("en-US"); }
    case "Percentage": return isNaN(num) ? value : `${(num * 100).toFixed(2)}%`;
    case "Fraction": return isNaN(num) ? value : value;
    case "Scientific": return isNaN(num) ? value : num.toExponential(2);
    case "Text": return String(value);
    default: return value;
  }
}

function getColumnLetter(index) {
  let letter = "";
  while (index >= 0) {
    letter = String.fromCharCode((index % 26) + 65) + letter;
    index = Math.floor(index / 26) - 1;
  }
  return letter;
}

// ─── Color Picker Popover ────────────────────────────────────────────────────
const COLORS = [
  "#000000", "#7f7f7f", "#c0c0c0", "#ffffff", "#ff0000", "#ff7f00", "#ffff00", "#00ff00",
  "#0000ff", "#8b00ff", "#ff69b4", "#a52a2a", "#ffa500", "#ffd700", "#adff2f", "#00ced1",
  "#1a5336", "#2e86ab", "#e84855", "#f5a623", "#7b2d8b", "#00b4d8", "#f72585", "#4361ee",
];

function ColorPicker({ color, onChange, children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    if (open) document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);
  return (
    <Box ref={ref} sx={{ position: "relative", display: "inline-flex" }}>
      <Box onClick={() => setOpen(o => !o)} sx={{ cursor: "pointer", display: "inline-flex" }}>{children}</Box>
      {open && (
        <Box sx={{ position: "fixed", zIndex: 9999, bgcolor: "#fff", border: "1px solid #e2e8f0", borderRadius: 1, boxShadow: "0 4px 20px rgba(0,0,0,0.15)", p: 1, display: "grid", gridTemplateColumns: "repeat(8,1fr)", gap: 0.5 }}
          style={{ top: ref.current ? ref.current.getBoundingClientRect().bottom + 4 : 0, left: ref.current ? ref.current.getBoundingClientRect().left : 0 }}>
          {COLORS.map(c => (
            <Box key={c} onClick={() => { onChange(c); setOpen(false); }}
              sx={{ width: 18, height: 18, bgcolor: c, border: c === color ? "2px solid #1a5336" : "1px solid #e2e8f0", borderRadius: 0.5, cursor: "pointer", "&:hover": { transform: "scale(1.2)" }, transition: "transform 0.1s" }} />
          ))}
          <Box sx={{ gridColumn: "1/-1", mt: 0.5 }}>
            <input type="color" value={color || "#000000"} onChange={e => { onChange(e.target.value); setOpen(false); }}
              style={{ width: "100%", height: 24, border: "none", cursor: "pointer", padding: 0 }} />
          </Box>
        </Box>
      )}
    </Box>
  );
}

// ─── Find & Replace Dialog ───────────────────────────────────────────────────
function FindReplaceDialog({ open, onClose, rows, columns, onReplace }) {
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const [matchCase, setMatchCase] = useState(false);
  const [results, setResults] = useState([]);

  const handleFind = () => {
    if (!find) return;
    const found = [];
    rows.forEach((row, ri) => {
      columns.forEach(col => {
        const val = String(row[col] ?? "");
        const match = matchCase ? val.includes(find) : val.toLowerCase().includes(find.toLowerCase());
        if (match) found.push({ row: ri, col, val });
      });
    });
    setResults(found);
  };

  const handleReplaceAll = () => {
    if (!find) return;
    onReplace(find, replace, matchCase);
    onClose();
  };

  if (!open) return null;
  return (
    <Box sx={{ position: "fixed", inset: 0, zIndex: 10000, bgcolor: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Box sx={{ bgcolor: "#fff", borderRadius: 2, boxShadow: "0 8px 32px rgba(0,0,0,0.2)", p: 3, minWidth: 360 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography fontWeight={700} fontSize="0.95rem">Find & Replace</Typography>
          <IconButton size="small" onClick={onClose}><ClearIcon fontSize="small" /></IconButton>
        </Box>
        <TextField fullWidth size="small" label="Find" value={find} onChange={e => setFind(e.target.value)} sx={{ mb: 1.5 }} />
        <TextField fullWidth size="small" label="Replace with" value={replace} onChange={e => setReplace(e.target.value)} sx={{ mb: 1.5 }} />
        <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
          <Checkbox size="small" checked={matchCase} onChange={e => setMatchCase(e.target.checked)} sx={{ p: 0 }} />
          <Typography fontSize="0.8rem">Match Case</Typography>
        </Box>
        {results.length > 0 && <Typography fontSize="0.78rem" color="#64748b" mb={1}>{results.length} match(es) found</Typography>}
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button size="small" variant="outlined" onClick={handleFind} sx={{ textTransform: "none", borderColor: "#e2e8f0", color: "#64748b" }}>Find All</Button>
          <Button size="small" variant="contained" onClick={handleReplaceAll} sx={{ textTransform: "none", bgcolor: "#1a5336", "&:hover": { bgcolor: "#15432b" } }}>Replace All</Button>
        </Stack>
      </Box>
    </Box>
  );
}

// ─── Sort Dialog ─────────────────────────────────────────────────────────────
function SortDialog({ open, onClose, columns, onSort }) {
  const [col, setCol] = useState(columns[0] || "");
  const [dir, setDir] = useState("asc");
  if (!open) return null;
  return (
    <Box sx={{ position: "fixed", inset: 0, zIndex: 10000, bgcolor: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Box sx={{ bgcolor: "#fff", borderRadius: 2, boxShadow: "0 8px 32px rgba(0,0,0,0.2)", p: 3, minWidth: 320 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography fontWeight={700} fontSize="0.95rem">Sort</Typography>
          <IconButton size="small" onClick={onClose}><ClearIcon fontSize="small" /></IconButton>
        </Box>
        <Typography fontSize="0.8rem" mb={0.5} color="#64748b">Sort by column</Typography>
        <Select fullWidth size="small" value={col} onChange={e => setCol(e.target.value)} sx={{ mb: 2 }}>
          {columns.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
        </Select>
        <Typography fontSize="0.8rem" mb={0.5} color="#64748b">Order</Typography>
        <Select fullWidth size="small" value={dir} onChange={e => setDir(e.target.value)} sx={{ mb: 2 }}>
          <MenuItem value="asc">A → Z (Ascending)</MenuItem>
          <MenuItem value="desc">Z → A (Descending)</MenuItem>
          <MenuItem value="num-asc">Smallest → Largest</MenuItem>
          <MenuItem value="num-desc">Largest → Smallest</MenuItem>
        </Select>
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button size="small" variant="outlined" onClick={onClose} sx={{ textTransform: "none", borderColor: "#e2e8f0", color: "#64748b" }}>Cancel</Button>
          <Button size="small" variant="contained" onClick={() => { onSort(col, dir); onClose(); }} sx={{ textTransform: "none", bgcolor: "#1a5336", "&:hover": { bgcolor: "#15432b" } }}>Sort</Button>
        </Stack>
      </Box>
    </Box>
  );
}

// ─── Toolbar Divider ─────────────────────────────────────────────────────────
function TbDivider() {
  return <Box sx={{ width: "1px", bgcolor: "rgba(255,255,255,0.25)", mx: 0.5, alignSelf: "stretch", my: 0.5 }} />;
}

// ─── Toolbar Icon Button ─────────────────────────────────────────────────────
function TbBtn({ icon, label, onClick, active, disabled }) {
  return (
    <Tooltip title={label} placement="bottom" arrow>
      <span>
        <IconButton size="small" onClick={onClick} disabled={disabled}
          sx={{
            color: active ? "#ffd700" : "rgba(255,255,255,0.9)", p: 0.4, borderRadius: 1, bgcolor: active ? "rgba(255,215,0,0.15)" : "transparent",
            "&:hover": { bgcolor: "rgba(255,255,255,0.15)", color: "#fff" }, "&.Mui-disabled": { color: "rgba(255,255,255,0.3)" }, transition: "all 0.15s"
          }}>
          {icon}
        </IconButton>
      </span>
    </Tooltip>
  );
}

// ─── Toolbar Group ────────────────────────────────────────────────────────────
function TbGroup({ label, children }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.25, flexWrap: "wrap", justifyContent: "center" }}>{children}</Box>
      <Typography sx={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.55)", mt: 0.25, letterSpacing: 0.5, textTransform: "uppercase", userSelect: "none" }}>{label}</Typography>
    </Box>
  );
}

// ─── Excel-style column filter dropdown ──────────────────────────────────────
function ColumnFilterDropdown({ col, rows, activeValues, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);
  const allValues = [...new Set(rows.map((r) => String(r[col] ?? "")))].sort();
  const filtered = allValues.filter((v) => v.toLowerCase().includes(search.toLowerCase()));
  const isActive = activeValues !== null && activeValues !== undefined;

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleToggle = (val) => {
    const current = activeValues ?? allValues;
    const next = current.includes(val) ? current.filter((v) => v !== val) : [...current, val];
    onChange(next.length === allValues.length ? null : next);
  };

  const handleSelectAll = () => {
    const current = activeValues ?? allValues;
    if (filtered.every((v) => current.includes(v))) {
      const next = (activeValues ?? allValues).filter((v) => !filtered.includes(v));
      onChange(next.length === 0 ? [] : next.length === allValues.length ? null : next);
    } else {
      const next = [...new Set([...(activeValues ?? allValues), ...filtered])];
      onChange(next.length === allValues.length ? null : next);
    }
  };

  const allFilteredChecked = filtered.length > 0 && filtered.every((v) => (activeValues ?? allValues).includes(v));
  const someFilteredChecked = filtered.some((v) => (activeValues ?? allValues).includes(v)) && !allFilteredChecked;

  return (
    <Box ref={ref} sx={{ position: "relative", display: "inline-block" }}>
      <IconButton size="small" onClick={() => setOpen((o) => !o)}
        sx={{ p: 0.3, color: isActive ? "#1a5336" : "#94a3b8", "&:hover": { color: "#1a5336" } }}>
        <FilterListIcon sx={{ fontSize: 14 }} />
      </IconButton>
      {open && (
        <Box sx={{ position: "fixed", zIndex: 9999, bgcolor: "#fff", border: "1px solid #e2e8f0", borderRadius: 2, boxShadow: "0 8px 32px rgba(0,0,0,0.18)", minWidth: 200, maxWidth: 280, p: 1 }}
          style={{ top: ref.current ? ref.current.getBoundingClientRect().bottom + 4 : 0, left: ref.current ? ref.current.getBoundingClientRect().left : 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", border: "1px solid #e2e8f0", borderRadius: 1, px: 1, mb: 0.5, bgcolor: "#f8fafc" }}>
            <SearchIcon sx={{ fontSize: 14, color: "#94a3b8", mr: 0.5 }} />
            <input autoFocus value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..."
              style={{ border: "none", outline: "none", background: "transparent", fontSize: "0.75rem", width: "100%", padding: "4px 0" }} />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", px: 0.5, py: 0.25, borderBottom: "1px solid #f1f5f9", mb: 0.5, cursor: "pointer", "&:hover": { bgcolor: "#f8fafc" }, borderRadius: 1 }} onClick={handleSelectAll}>
            <Checkbox size="small" checked={allFilteredChecked} indeterminate={someFilteredChecked} sx={{ p: 0.25 }} onClick={(e) => e.stopPropagation()} onChange={handleSelectAll} />
            <Typography sx={{ fontSize: "0.75rem", fontWeight: 600 }}>(Select All)</Typography>
          </Box>
          <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
            {filtered.length === 0 && <Typography sx={{ fontSize: "0.72rem", color: "#94a3b8", px: 1, py: 0.5 }}>No results</Typography>}
            {filtered.map((val) => {
              const checked = (activeValues ?? allValues).includes(val);
              return (
                <Box key={val} sx={{ display: "flex", alignItems: "center", px: 0.5, py: 0.1, cursor: "pointer", borderRadius: 1, "&:hover": { bgcolor: "#f1f5f9" } }} onClick={() => handleToggle(val)}>
                  <Checkbox size="small" checked={checked} sx={{ p: 0.25 }} onClick={(e) => e.stopPropagation()} onChange={() => handleToggle(val)} />
                  <Typography sx={{ fontSize: "0.75rem", color: val === "" ? "#94a3b8" : "#1e293b", fontStyle: val === "" ? "italic" : "normal" }}>
                    {val === "" ? "(Blanks)" : val}
                  </Typography>
                </Box>
              );
            })}
          </Box>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 1, pt: 0.5, borderTop: "1px solid #f1f5f9" }}>
            <Button size="small" variant="outlined" onClick={() => { onChange(null); setOpen(false); }}
              sx={{ fontSize: "0.7rem", textTransform: "none", py: 0.25, px: 1, borderColor: "#e2e8f0", color: "#64748b" }}>Clear</Button>
            <Button size="small" variant="contained" onClick={() => setOpen(false)}
              sx={{ fontSize: "0.7rem", textTransform: "none", py: 0.25, px: 1, bgcolor: "#1a5336", "&:hover": { bgcolor: "#15432b" } }}>OK</Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}

// ─── Main DynamicTable ────────────────────────────────────────────────────────
export default function DynamicTable({
  columns: propColumns = ["Column 1", "Column 2"],
  data = [],
  onDataChange,
  onColumnsChange,
  height = 400,
  editable = true,
  allowColumnManagement = false,
  minRows = 1,
}) {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState(propColumns);
  const [columnFilters, setColumnFilters] = useState({});
  const [selectedCell, setSelectedCell] = useState(null); // { row, col }
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [clipboard, setClipboard] = useState(null); // { value, formatting }

  // ── Per-cell formatting state ─────────────────────────────────────────────
  // Key: `${rowIndex}-${col}`, Value: { bold, italic, underline, fontSize, fontFamily, color, bgColor, hAlign, vAlign, wrap, numberFormat, decimals }
  const [cellFormats, setCellFormats] = useState({});

  // ── Global formatting state (applies to next typed / selected cells) ──────
  const [fmt, setFmt] = useState({
    fontFamily: "Calibri",
    fontSize: 11,
    bold: false,
    italic: false,
    underline: false,
    color: "#000000",
    bgColor: "#ffffff",
    hAlign: "left",
    vAlign: "middle",
    wrap: false,
    numberFormat: "General",
    decimals: 2,
  });

  const [mergedCells, setMergedCells] = useState(new Set());
  const [findReplaceOpen, setFindReplaceOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [filterEnabled, setFilterEnabled] = useState(false);
  const [filterRow, setFilterRow] = useState(null);

  const handleToggleFilter = () => {
    setFilterEnabled(prev => {
      if (prev) {
        setColumnFilters({});
        setFilterRow(null);
      } else {
        // Snap filter header to the currently selected row (or row 0)
        setFilterRow(selectedCell?.row ?? 0);
      }
      return !prev;
    });
  };

  const hasActiveFilters = Object.values(columnFilters).some(v => v !== null && v !== undefined);

  // Sync columns from prop
  useEffect(() => { setColumns(propColumns); }, [propColumns]);

  // Initialize rows
  useEffect(() => {
    if (data && data.length > 0) {
      setRows(data);
    } else if (editable) {
      const initialRows = Array.from({ length: Math.max(minRows, 1) }, () => {
        const r = {}; propColumns.forEach((c) => { r[c] = ""; }); return r;
      });
      setRows(initialRows);
    } else {
      setRows([]);
    }
  }, [data, propColumns, editable, minRows]);

  // Filtered rows — the filterRow (header row) is always shown
  const filteredRows = rows
    .map((row, originalIndex) => ({ row, originalIndex }))
    .filter(({ row, originalIndex }) =>
      (filterEnabled && originalIndex === filterRow) ||
      columns.every((col) => {
        const allowed = columnFilters[col];
        if (!allowed) return true;
        return allowed.includes(String(row[col] ?? ""));
      })
    );

  // ── Cell format helpers ───────────────────────────────────────────────────
  const getCellFmt = useCallback((ri, col) => cellFormats[`${ri}-${col}`] || {}, [cellFormats]);

  const applyCellFmt = (ri, col, patch) => {
    const key = `${ri}-${col}`;
    setCellFormats(prev => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  };

  const applyFmtToSelected = (patch) => {
    if (selectedCell) {
      applyCellFmt(selectedCell.row, selectedCell.col, patch);
    }
    setFmt(prev => ({ ...prev, ...patch }));
  };

  // When a cell is selected, sync toolbar state from the cell's format
  const handleCellSelect = (ri, col) => {
    setSelectedCell({ row: ri, col });
    const cf = getCellFmt(ri, col);
    setFmt(prev => ({
      ...prev,
      bold: cf.bold ?? prev.bold,
      italic: cf.italic ?? prev.italic,
      underline: cf.underline ?? prev.underline,
      fontFamily: cf.fontFamily ?? prev.fontFamily,
      fontSize: cf.fontSize ?? prev.fontSize,
      color: cf.color ?? prev.color,
      bgColor: cf.bgColor ?? prev.bgColor,
      hAlign: cf.hAlign ?? prev.hAlign,
      vAlign: cf.vAlign ?? prev.vAlign,
      wrap: cf.wrap ?? prev.wrap,
      numberFormat: cf.numberFormat ?? prev.numberFormat,
      decimals: cf.decimals ?? prev.decimals,
    }));
  };

  // ── Cell data ────────────────────────────────────────────────────────────
  const handleCellChange = (rowIndex, column, value) => {
    const newRows = [...rows];
    newRows[rowIndex] = { ...newRows[rowIndex], [column]: value };
    setRows(newRows);
    if (onDataChange) onDataChange(newRows);
  };

  // ── Clipboard ────────────────────────────────────────────────────────────
  const handleCopy = () => {
    if (!selectedCell) return;
    const { row: ri, col } = selectedCell;
    setClipboard({ value: rows[ri]?.[col] ?? "", formatting: { ...getCellFmt(ri, col) } });
    // Also copy to system clipboard
    navigator.clipboard?.writeText(String(rows[ri]?.[col] ?? "")).catch(() => { });
  };

  const handleCut = () => {
    if (!selectedCell) return;
    handleCopy();
    handleCellChange(selectedCell.row, selectedCell.col, "");
  };

  // ── Excel multi-cell paste helper ──────────────────────────────────────────
  const applyPastedGrid = useCallback((startRow, startColIdx, grid) => {
    setRows(prevRows => {
      let newRows = prevRows.map(r => ({ ...r }));

      // How many extra rows do we need?
      const rowsNeeded = startRow + grid.length;
      while (newRows.length < rowsNeeded) {
        const empty = {};
        columns.forEach(c => { empty[c] = ""; });
        newRows.push(empty);
      }

      // How many extra columns do we need?
      const colsNeeded = startColIdx + Math.max(...grid.map(r => r.length));
      let currentCols = [...columns];
      while (currentCols.length < colsNeeded) {
        const newName = `Column ${currentCols.length + 1}`;
        currentCols.push(newName);
        newRows = newRows.map(r => ({ ...r, [newName]: "" }));
      }
      if (currentCols.length !== columns.length) {
        setColumns(currentCols);
        if (onColumnsChange) onColumnsChange(currentCols);
      }

      // Fill values
      grid.forEach((gridRow, ri) => {
        const targetRowIdx = startRow + ri;
        gridRow.forEach((cellValue, ci) => {
          const targetCol = currentCols[startColIdx + ci];
          if (targetCol !== undefined) {
            newRows[targetRowIdx] = { ...newRows[targetRowIdx], [targetCol]: cellValue };
          }
        });
      });

      if (onDataChange) onDataChange(newRows);
      return newRows;
    });
  }, [columns, onColumnsChange, onDataChange]);

  const handlePaste = async () => {
    if (!selectedCell) return;
    let text = "";
    try { text = await navigator.clipboard.readText(); } catch { text = clipboard?.value ?? ""; }

    // Check if multi-cell (contains tabs or newlines)
    if (text.includes("\t") || text.includes("\n")) {
      const grid = text
        .replace(/\r\n/g, "\n").replace(/\r/g, "\n")
        .trimEnd()
        .split("\n")
        .map(line => line.split("\t"));
      const startColIdx = columns.indexOf(selectedCell.col);
      applyPastedGrid(selectedCell.row, startColIdx, grid);
    } else {
      handleCellChange(selectedCell.row, selectedCell.col, text);
      if (clipboard?.formatting) {
        applyCellFmt(selectedCell.row, selectedCell.col, clipboard.formatting);
      }
    }
  };

  const handleFormatPainter = () => {
    if (!selectedCell) return;
    setClipboard(prev => ({ ...prev, formattingOnly: true, formatting: { ...getCellFmt(selectedCell.row, selectedCell.col) } }));
  };

  // ── Font ─────────────────────────────────────────────────────────────────
  const toggleBold = () => applyFmtToSelected({ bold: !fmt.bold });
  const toggleItalic = () => applyFmtToSelected({ italic: !fmt.italic });
  const toggleUnderline = () => applyFmtToSelected({ underline: !fmt.underline });
  const increaseFontSize = () => {
    const idx = FONT_SIZES.indexOf(fmt.fontSize);
    const next = FONT_SIZES[Math.min(idx + 1, FONT_SIZES.length - 1)];
    applyFmtToSelected({ fontSize: next });
  };
  const decreaseFontSize = () => {
    const idx = FONT_SIZES.indexOf(fmt.fontSize);
    const next = FONT_SIZES[Math.max(idx - 1, 0)];
    applyFmtToSelected({ fontSize: next });
  };

  // ── Alignment ────────────────────────────────────────────────────────────
  const setHAlign = (v) => applyFmtToSelected({ hAlign: v });
  const setVAlign = (v) => applyFmtToSelected({ vAlign: v });
  const toggleWrap = () => applyFmtToSelected({ wrap: !fmt.wrap });

  const handleMergeCenter = () => {
    if (!selectedCell) return;
    const key = `${selectedCell.row}-${selectedCell.col}`;
    setMergedCells(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  // ── Number ────────────────────────────────────────────────────────────────
  const applyNumberFormat = (f) => applyFmtToSelected({ numberFormat: f });
  const togglePercent = () => {
    const current = selectedCell ? (getCellFmt(selectedCell.row, selectedCell.col).numberFormat ?? fmt.numberFormat) : fmt.numberFormat;
    applyFmtToSelected({ numberFormat: current === "Percentage" ? "General" : "Percentage" });
  };
  const addDecimal = () => applyFmtToSelected({ decimals: Math.min((fmt.decimals ?? 2) + 1, 10) });
  const removeDecimal = () => applyFmtToSelected({ decimals: Math.max((fmt.decimals ?? 2) - 1, 0) });
  const toggleCurrency = () => {
    const current = selectedCell ? (getCellFmt(selectedCell.row, selectedCell.col).numberFormat ?? fmt.numberFormat) : fmt.numberFormat;
    applyFmtToSelected({ numberFormat: current === "Currency" ? "General" : "Currency" });
  };

  // ── Cells ─────────────────────────────────────────────────────────────────
  const handleAddRow = () => {
    const newRow = {}; columns.forEach((col) => { newRow[col] = ""; });
    const insertAt = selectedCell ? selectedCell.row + 1 : rows.length;
    const newRows = [...rows.slice(0, insertAt), newRow, ...rows.slice(insertAt)];
    setRows(newRows);
    if (onDataChange) onDataChange(newRows);
  };

  const handleDeleteRow = () => {
    if (!selectedCell && selectedRows.size === 0) return;
    let indices = selectedRows.size > 0 ? [...selectedRows] : [selectedCell.row];
    const newRows = rows.filter((_, i) => !indices.includes(i));
    setRows(newRows.length === 0 && editable ? [(() => { const r = {}; columns.forEach(c => { r[c] = ""; }); return r; })()] : newRows);
    setSelectedCell(null);
    setSelectedRows(new Set());
    if (onDataChange) onDataChange(newRows);
  };

  const handleAddColumn = () => {
    const name = window.prompt("Enter new column name:");
    if (name && !columns.includes(name)) {
      const newCols = [...columns, name];
      setColumns(newCols);
      if (onColumnsChange) onColumnsChange(newCols);
      const newRows = rows.map(r => ({ ...r, [name]: "" }));
      setRows(newRows);
      if (onDataChange) onDataChange(newRows);
    }
  };

  const handleDeleteColumn = () => {
    const col = selectedCell?.col ?? (columns.length > 0 ? columns[columns.length - 1] : null);
    if (!col) return;
    if (!window.confirm(`Delete column "${col}"?`)) return;
    const newCols = columns.filter(c => c !== col);
    setColumns(newCols);
    if (onColumnsChange) onColumnsChange(newCols);
    const newRows = rows.map(r => { const nr = { ...r }; delete nr[col]; return nr; });
    setRows(newRows);
    if (onDataChange) onDataChange(newRows);
  };

  // ── Editing ───────────────────────────────────────────────────────────────
  const handleAutoSum = () => {
    if (!selectedCell) return;
    const { col } = selectedCell;
    const sum = rows.reduce((acc, row) => {
      const n = parseFloat(row[col]);
      return acc + (isNaN(n) ? 0 : n);
    }, 0);
    const insertIdx = rows.length;
    const newRow = {}; columns.forEach(c => { newRow[c] = ""; });
    newRow[col] = String(sum);
    const newRows = [...rows, newRow];
    setRows(newRows);
    if (onDataChange) onDataChange(newRows);
  };

  const handleFillDown = () => {
    if (!selectedCell) return;
    const { row: ri, col } = selectedCell;
    const val = rows[ri]?.[col];
    const newRows = rows.map((r, i) => i > ri ? { ...r, [col]: val } : r);
    setRows(newRows);
    if (onDataChange) onDataChange(newRows);
  };

  const handleClearContents = () => {
    if (!selectedCell) return;
    const { row: ri, col } = selectedCell;
    handleCellChange(ri, col, "");
    setCellFormats(prev => { const n = { ...prev }; delete n[`${ri}-${col}`]; return n; });
  };

  const handleClearAll = () => {
    if (window.confirm("Clear all cell contents and formatting?")) {
      const newRows = rows.map(row => { const nr = {}; columns.forEach(c => { nr[c] = ""; }); return nr; });
      setRows(newRows);
      setCellFormats({});
      if (onDataChange) onDataChange(newRows);
    }
  };

  const handleSort = (col, dir) => {
    const sorted = [...rows].sort((a, b) => {
      const av = a[col] ?? ""; const bv = b[col] ?? "";
      if (dir === "asc") return String(av).localeCompare(String(bv));
      if (dir === "desc") return String(bv).localeCompare(String(av));
      const an = parseFloat(av); const bn = parseFloat(bv);
      if (dir === "num-asc") return (isNaN(an) ? 0 : an) - (isNaN(bn) ? 0 : bn);
      return (isNaN(bn) ? 0 : bn) - (isNaN(an) ? 0 : an);
    });
    setRows(sorted);
    if (onDataChange) onDataChange(sorted);
  };

  const handleFindReplace = (find, replace, matchCase) => {
    const newRows = rows.map(row => {
      const nr = { ...row };
      columns.forEach(col => {
        const val = String(nr[col] ?? "");
        if (matchCase ? val.includes(find) : val.toLowerCase().includes(find.toLowerCase())) {
          nr[col] = matchCase ? val.replaceAll(find, replace) : val.replace(new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), replace);
        }
      });
      return nr;
    });
    setRows(newRows);
    if (onDataChange) onDataChange(newRows);
  };

  // ── Download ──────────────────────────────────────────────────────────────
  // Helper: convert hex color (#rrggbb or #rrggbbaa) → ExcelJS ARGB string
  const hexToArgb = (hex) => {
    if (!hex) return "FF000000";
    const h = hex.replace("#", "");
    if (h.length === 6) return `FF${h.toUpperCase()}`;
    if (h.length === 8) return h.toUpperCase();
    return "FF000000";
  };

  // Helper: map our numberFormat strings → ExcelJS numFmt codes
  const getNumFmt = (fmt, decimals = 2) => {
    const d = decimals ?? 2;
    switch (fmt) {
      case "Number": return `#,##0.${'0'.repeat(d)}`;
      case "Currency": return `$#,##0.${'0'.repeat(d)}`;
      case "Accounting": return `_($* #,##0.${'0'.repeat(d)}_);_($* (#,##0.${'0'.repeat(d)});_($* "-"??_);_(@_)`;
      case "Percentage": return `0.${'0'.repeat(d)}%`;
      case "Fraction": return '# ?/?';
      case "Scientific": return `0.${'0'.repeat(d)}E+00`;
      case "Short Date": return 'mm/dd/yyyy';
      case "Long Date": return 'dddd, mmmm dd, yyyy';
      case "Time": return 'h:mm:ss AM/PM';
      case "Text": return '@';
      default: return 'General';
    }
  };

  const handleDownloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    // ── Add data rows with per-cell formatting ────────────────────────────────
    rows.forEach((row, ri) => {
      const excelRow = worksheet.addRow(columns.map(col => row[col] ?? ""));
      excelRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        const col = columns[colNumber - 1];
        if (!col) return;
        const cf = cellFormats[`${ri}-${col}`] || {};

        // Font
        cell.font = {
          name: cf.fontFamily ?? "Calibri",
          size: cf.fontSize ?? 11,
          bold: cf.bold ?? false,
          italic: cf.italic ?? false,
          underline: cf.underline ?? false,
          color: { argb: hexToArgb(cf.color ?? "#000000") },
        };

        // Fill (background color)
        const bg = cf.bgColor && cf.bgColor !== "#ffffff" ? cf.bgColor : null;
        if (bg) {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: hexToArgb(bg) } };
        }

        // Alignment
        cell.alignment = {
          horizontal: cf.hAlign ?? "left",
          vertical: cf.vAlign ?? "middle",
          wrapText: cf.wrap ?? false,
        };

        // Number format
        if (cf.numberFormat && cf.numberFormat !== "General") {
          cell.numFmt = getNumFmt(cf.numberFormat, cf.decimals);
        }

        // Light border for every cell
        cell.border = {
          top: { style: "thin", color: { argb: "FFE5E7EB" } },
          bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
          left: { style: "thin", color: { argb: "FFE5E7EB" } },
          right: { style: "thin", color: { argb: "FFE5E7EB" } },
        };
      });
    });

    // ── Auto-fit column widths ────────────────────────────────────────────────
    worksheet.columns.forEach((col, i) => {
      let maxLen = String(columns[i] ?? "").length + 2;
      rows.forEach(row => {
        const val = String(row[columns[i]] ?? "");
        if (val.length + 2 > maxLen) maxLen = val.length + 2;
      });
      col.width = Math.min(Math.max(maxLen, 10), 60);
    });

    // ── Write to browser download ─────────────────────────────────────────────
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "table_data.xlsx";
    a.click();
    URL.revokeObjectURL(url);
  };

  const setColFilter = (col, val) => setColumnFilters(prev => ({ ...prev, [col]: val }));

  const showColumnActions = editable || allowColumnManagement;

  // ─── Render ───────────────────────────────────────────────────────────────
  const selectStyle = {
    color: "rgba(255,255,255,0.9)",
    fontSize: "0.75rem",
    height: 26,
    ".MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.25)" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.5)" },
    ".MuiSvgIcon-root": { color: "rgba(255,255,255,0.7)" },
    bgcolor: "rgba(255,255,255,0.1)",
    borderRadius: 1,
  };

  const currentNF = selectedCell ? (getCellFmt(selectedCell.row, selectedCell.col).numberFormat ?? fmt.numberFormat) : fmt.numberFormat;
  const currentFF = selectedCell ? (getCellFmt(selectedCell.row, selectedCell.col).fontFamily ?? fmt.fontFamily) : fmt.fontFamily;
  const currentFS = selectedCell ? (getCellFmt(selectedCell.row, selectedCell.col).fontSize ?? fmt.fontSize) : fmt.fontSize;

  return (
    <Box sx={{ width: "100%", bgcolor: "#fff", borderRadius: 2, overflow: "hidden", border: "1px solid #e5e7eb" }}>

      {/* ── Excel Ribbon Toolbar ── */}
      <Box sx={{ bgcolor: "#1a5336", color: "white", px: 1, pt: 0.75, pb: 0.5, display: "flex", alignItems: "flex-end", gap: 0.5, flexWrap: "wrap", overflowX: "auto" }}>

        {/* ── Clipboard ── */}
        <TbGroup label="Clipboard">
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {/* Large Paste button */}
            <Tooltip title="Paste" placement="bottom" arrow>
              <IconButton onClick={handlePaste} size="small"
                sx={{ color: "rgba(255,255,255,0.9)", flexDirection: "column", p: 0.5, borderRadius: 1, "&:hover": { bgcolor: "rgba(255,255,255,0.15)" } }}>
                <ContentPasteIcon sx={{ fontSize: 22 }} />
                <Typography sx={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.8)", lineHeight: 1 }}>Paste</Typography>
              </IconButton>
            </Tooltip>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
            <TbBtn icon={<ContentCutIcon sx={{ fontSize: 14 }} />} label="Cut" onClick={handleCut} />
            <TbBtn icon={<ContentCopyIcon sx={{ fontSize: 14 }} />} label="Copy" onClick={handleCopy} />
            <TbBtn icon={<FormatPaintIcon sx={{ fontSize: 14 }} />} label="Format Painter" onClick={handleFormatPainter} />
          </Box>
        </TbGroup>

        <TbDivider />

        {/* ── Font ── */}
        <TbGroup label="Font">
          {/* Row 1: Font family + size */}
          <Box sx={{ display: "flex", gap: 0.5, mb: 0.25 }}>
            <Select value={currentFF} onChange={e => { setFmt(p => ({ ...p, fontFamily: e.target.value })); if (selectedCell) applyCellFmt(selectedCell.row, selectedCell.col, { fontFamily: e.target.value }); }}
              size="small" sx={{ ...selectStyle, minWidth: 110 }}>
              {FONT_FAMILIES.map(f => <MenuItem key={f} value={f} sx={{ fontFamily: f, fontSize: "0.8rem" }}>{f}</MenuItem>)}
            </Select>
            <Select value={currentFS} onChange={e => { const v = Number(e.target.value); setFmt(p => ({ ...p, fontSize: v })); if (selectedCell) applyCellFmt(selectedCell.row, selectedCell.col, { fontSize: v }); }}
              size="small" sx={{ ...selectStyle, width: 58 }}>
              {FONT_SIZES.map(s => <MenuItem key={s} value={s} sx={{ fontSize: "0.8rem" }}>{s}</MenuItem>)}
            </Select>
            <TbBtn icon={<ExpandLessIcon sx={{ fontSize: 14 }} />} label="Increase Font Size" onClick={increaseFontSize} />
            <TbBtn icon={<ExpandMoreIcon sx={{ fontSize: 14 }} />} label="Decrease Font Size" onClick={decreaseFontSize} />
          </Box>
          {/* Row 2: B I U | border | fill color | font color */}
          <Box sx={{ display: "flex", gap: 0.25, alignItems: "center" }}>
            <TbBtn icon={<FormatBoldIcon sx={{ fontSize: 15, fontWeight: 900 }} />} label="Bold" onClick={toggleBold} active={fmt.bold} />
            <TbBtn icon={<FormatItalicIcon sx={{ fontSize: 15 }} />} label="Italic" onClick={toggleItalic} active={fmt.italic} />
            <TbBtn icon={<FormatUnderlinedIcon sx={{ fontSize: 15 }} />} label="Underline" onClick={toggleUnderline} active={fmt.underline} />
            <Box sx={{ width: 1, bgcolor: "rgba(255,255,255,0.25)", alignSelf: "stretch", mx: 0.25 }} />
            <TbBtn icon={<BorderAllIcon sx={{ fontSize: 15 }} />} label="Borders" onClick={() => { }} />
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <ColorPicker color={fmt.bgColor} onChange={c => { setFmt(p => ({ ...p, bgColor: c })); if (selectedCell) applyCellFmt(selectedCell.row, selectedCell.col, { bgColor: c }); }}>
                <Tooltip title="Fill Color" placement="bottom" arrow>
                  <Box sx={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", p: 0.4, borderRadius: 1, "&:hover": { bgcolor: "rgba(255,255,255,0.15)" } }}>
                    <FormatColorFillIcon sx={{ fontSize: 15, color: "rgba(255,255,255,0.9)" }} />
                    <Box sx={{ width: 14, height: 3, bgcolor: fmt.bgColor, border: "1px solid rgba(255,255,255,0.4)", borderRadius: 0.3 }} />
                  </Box>
                </Tooltip>
              </ColorPicker>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <ColorPicker color={fmt.color} onChange={c => { setFmt(p => ({ ...p, color: c })); if (selectedCell) applyCellFmt(selectedCell.row, selectedCell.col, { color: c }); }}>
                <Tooltip title="Font Color" placement="bottom" arrow>
                  <Box sx={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", p: 0.4, borderRadius: 1, "&:hover": { bgcolor: "rgba(255,255,255,0.15)" } }}>
                    <FontDownloadIcon sx={{ fontSize: 15, color: "rgba(255,255,255,0.9)" }} />
                    <Box sx={{ width: 14, height: 3, bgcolor: fmt.color, border: "1px solid rgba(255,255,255,0.4)", borderRadius: 0.3 }} />
                  </Box>
                </Tooltip>
              </ColorPicker>
            </Box>
          </Box>
        </TbGroup>

        <TbDivider />

        {/* ── Alignment ── */}
        <TbGroup label="Alignment">
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
            <Box sx={{ display: "flex", gap: 0.25 }}>
              <TbBtn icon={<VerticalAlignTopIcon sx={{ fontSize: 14 }} />} label="Top Align" onClick={() => setVAlign("top")} active={fmt.vAlign === "top"} />
              <TbBtn icon={<VerticalAlignCenterIcon sx={{ fontSize: 14 }} />} label="Middle Align" onClick={() => setVAlign("middle")} active={fmt.vAlign === "middle"} />
              <TbBtn icon={<VerticalAlignBottomIcon sx={{ fontSize: 14 }} />} label="Bottom Align" onClick={() => setVAlign("bottom")} active={fmt.vAlign === "bottom"} />
              <Box sx={{ width: 1, bgcolor: "rgba(255,255,255,0.25)", alignSelf: "stretch", mx: 0.25 }} />
              <TbBtn icon={<WrapTextIcon sx={{ fontSize: 14 }} />} label="Wrap Text" onClick={toggleWrap} active={fmt.wrap} />
            </Box>
            <Box sx={{ display: "flex", gap: 0.25 }}>
              <TbBtn icon={<FormatAlignLeftIcon sx={{ fontSize: 14 }} />} label="Align Left" onClick={() => setHAlign("left")} active={fmt.hAlign === "left"} />
              <TbBtn icon={<FormatAlignCenterIcon sx={{ fontSize: 14 }} />} label="Center" onClick={() => setHAlign("center")} active={fmt.hAlign === "center"} />
              <TbBtn icon={<FormatAlignRightIcon sx={{ fontSize: 14 }} />} label="Align Right" onClick={() => setHAlign("right")} active={fmt.hAlign === "right"} />
              <Box sx={{ width: 1, bgcolor: "rgba(255,255,255,0.25)", alignSelf: "stretch", mx: 0.25 }} />
              <TbBtn icon={<MergeTypeIcon sx={{ fontSize: 14 }} />} label="Merge & Center" onClick={handleMergeCenter} />
            </Box>
          </Box>
        </TbGroup>

        <TbDivider />

        {/* ── Number ── */}
        <TbGroup label="Number">
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
            <Select value={currentNF} onChange={e => applyNumberFormat(e.target.value)} size="small" sx={{ ...selectStyle, minWidth: 110 }}>
              {NUMBER_FORMATS.map(f => <MenuItem key={f} value={f} sx={{ fontSize: "0.8rem" }}>{f}</MenuItem>)}
            </Select>
            <Box sx={{ display: "flex", gap: 0.25 }}>
              <TbBtn icon={<AttachMoneyIcon sx={{ fontSize: 14 }} />} label="Accounting Number Format" onClick={toggleCurrency} active={currentNF === "Currency" || currentNF === "Accounting"} />
              <TbBtn icon={<PercentIcon sx={{ fontSize: 14 }} />} label="Percent Style" onClick={togglePercent} active={currentNF === "Percentage"} />
              <TbBtn icon={<Typography sx={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.9)", lineHeight: 1 }}>,</Typography>} label="Comma Style" onClick={() => applyNumberFormat("Number")} active={currentNF === "Number"} />
              <Box sx={{ width: 1, bgcolor: "rgba(255,255,255,0.25)", alignSelf: "stretch", mx: 0.25 }} />
              <TbBtn icon={<Typography sx={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.9)", lineHeight: 1 }}>.00→</Typography>} label="Increase Decimal Places" onClick={addDecimal} />
              <TbBtn icon={<Typography sx={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.9)", lineHeight: 1 }}>←.0</Typography>} label="Decrease Decimal Places" onClick={removeDecimal} />
            </Box>
          </Box>
        </TbGroup>

        <TbDivider />

        {/* ── Cells ── */}
        {showColumnActions && (
          <TbGroup label="Cells">
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
              <Box sx={{ display: "flex", gap: 0.25 }}>
                <TbBtn icon={<AddCircleOutlineIcon sx={{ fontSize: 14 }} />} label="Insert Row" onClick={handleAddRow} />
                <TbBtn icon={<ViewWeekIcon sx={{ fontSize: 14 }} />} label="Insert Column" onClick={handleAddColumn} />
              </Box>
              <Box sx={{ display: "flex", gap: 0.25 }}>
                <TbBtn icon={<RemoveCircleOutlineIcon sx={{ fontSize: 14 }} />} label="Delete Row" onClick={handleDeleteRow} />
                <TbBtn icon={<DeleteIcon sx={{ fontSize: 14 }} />} label="Delete Column" onClick={handleDeleteColumn} />
              </Box>
            </Box>
          </TbGroup>
        )}

        <TbDivider />

        {/* ── Editing ── */}
        <TbGroup label="Editing">
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
            <Box sx={{ display: "flex", gap: 0.25 }}>
              <TbBtn icon={<FunctionsIcon sx={{ fontSize: 14 }} />} label="AutoSum (sum selected column)" onClick={handleAutoSum} />
              <TbBtn icon={<FormatLineSpacingIcon sx={{ fontSize: 14 }} />} label="Fill Down" onClick={handleFillDown} />
            </Box>
            <Box sx={{ display: "flex", gap: 0.25 }}>
              <TbBtn icon={<ClearIcon sx={{ fontSize: 14 }} />} label="Clear Cell" onClick={handleClearContents} />
              <TbBtn icon={<DeleteIcon sx={{ fontSize: 14 }} />} label="Clear All" onClick={handleClearAll} />
              <TbBtn icon={<SortIcon sx={{ fontSize: 14 }} />} label="Sort & Filter" onClick={() => setSortOpen(true)} />
              <TbBtn icon={<FindInPageIcon sx={{ fontSize: 14 }} />} label="Find & Replace" onClick={() => setFindReplaceOpen(true)} />
              <TbBtn icon={<FilterListIcon sx={{ fontSize: 14 }} />} label={filterEnabled ? "Turn Off Filter" : "Filter"} onClick={handleToggleFilter} active={filterEnabled} />
              {hasActiveFilters && (
                <TbBtn icon={<ClearIcon sx={{ fontSize: 14 }} />} label="Clear All Filters" onClick={() => setColumnFilters({})} />
              )}
            </Box>
          </Box>
        </TbGroup>

        <TbDivider />

        {/* ── Download ── */}
        <TbGroup label="Export">
          <Tooltip title="Download as Excel" placement="bottom" arrow>
            <IconButton onClick={handleDownloadExcel} size="small"
              sx={{ color: "rgba(255,255,255,0.9)", flexDirection: "column", p: 0.5, borderRadius: 1, "&:hover": { bgcolor: "rgba(255,255,255,0.15)" } }}>
              <DownloadIcon sx={{ fontSize: 22 }} />
              <Typography sx={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.8)", lineHeight: 1 }}>Download</Typography>
            </IconButton>
          </Tooltip>
        </TbGroup>
      </Box>

      {/* ── Dialogs ── */}
      <FindReplaceDialog open={findReplaceOpen} onClose={() => setFindReplaceOpen(false)} rows={rows} columns={columns} onReplace={handleFindReplace} />
      <SortDialog open={sortOpen} onClose={() => setSortOpen(false)} columns={columns} onSort={handleSort} />

      {/* ── Table ── */}
      <TableContainer sx={{ maxHeight: height, "& .MuiTableCell-root": { border: "1px solid #e5e7eb", p: 0, lineHeight: 1 } }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ bgcolor: "#f8fafc", width: 40, borderRight: "1px solid #e2e8f0", textAlign: "center" }} />
              {columns.map((col, idx) => (
                <TableCell key={`letter-${idx}`} align="center"
                  sx={{ bgcolor: "#f8fafc", color: "#64748b", fontSize: "0.7rem", fontWeight: 600, py: 0.25, borderBottom: "none" }}>
                  {getColumnLetter(idx)}
                </TableCell>
              ))}
            </TableRow>

          </TableHead>

          <TableBody>
            {filteredRows.map(({ row, originalIndex: ri }) => (
              <TableRow key={ri} sx={{ bgcolor: ri % 2 === 0 ? "#fff" : "#f8fafc", "&:hover": { bgcolor: "#f1f5f9" } }}>
                {/* Row number */}
                <TableCell align="center" sx={{ bgcolor: "#f1f5f9", color: "#64748b", fontSize: "0.75rem", fontWeight: 600, borderRight: "1px solid #e2e8f0 !important", width: 40, cursor: "pointer" }}
                  onClick={() => {
                    setSelectedRows(prev => { const n = new Set(prev); if (n.has(ri)) n.delete(ri); else n.add(ri); return n; });
                  }}>
                  <Box sx={{ bgcolor: selectedRows.has(ri) ? "#dbeafe" : "transparent", borderRadius: 0.5, px: 0.5 }}>{ri + 1}</Box>
                </TableCell>

                {columns.map((col) => {
                  const cf = getCellFmt(ri, col);
                  const isSelected = selectedCell?.row === ri && selectedCell?.col === col;
                  const isMerged = mergedCells.has(`${ri}-${col}`);
                  const displayVal = formatCellValue(row[col], cf.numberFormat ?? "General");

                  return (
                    <TableCell key={`${ri}-${col}`} onClick={() => handleCellSelect(ri, col)}
                      sx={{
                        p: 0, cursor: "cell",
                        outline: isSelected ? "2px solid #1a5336" : "none",
                        outlineOffset: "-2px",
                        bgcolor: cf.bgColor && cf.bgColor !== "#ffffff" ? cf.bgColor : "inherit",
                        textAlign: cf.hAlign ?? "left",
                        verticalAlign: cf.vAlign ?? "middle",
                        position: "relative",
                        ...(isMerged ? { borderRight: "none" } : {}),
                        // Highlight the filter header row with a subtle green tint
                        ...(filterEnabled && ri === filterRow ? { bgcolor: "#f0fdf4" } : {}),
                      }}>
                      {editable ? (
                        <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
                          <input
                            value={row[col] ?? ""}
                            onChange={e => handleCellChange(ri, col, e.target.value)}
                            onFocus={() => handleCellSelect(ri, col)}
                            onPaste={e => {
                              const text = e.clipboardData.getData("text/plain");
                              // Only intercept multi-cell pastes (tab or newline present)
                              if (text.includes("\t") || text.includes("\n")) {
                                e.preventDefault();
                                const grid = text
                                  .replace(/\r\n/g, "\n").replace(/\r/g, "\n")
                                  .trimEnd()
                                  .split("\n")
                                  .map(line => line.split("\t"));
                                const startColIdx = columns.indexOf(col);
                                applyPastedGrid(ri, startColIdx, grid);
                              }
                              // single-cell paste: let the browser handle it normally
                            }}
                            style={{
                              width: "100%",
                              border: "none",
                              outline: "none",
                              background: "transparent",
                              padding: "6px 12px",
                              fontSize: `${cf.fontSize ?? 11}pt`,
                              fontFamily: cf.fontFamily ?? "Calibri",
                              fontWeight: cf.bold ? "bold" : "normal",
                              fontStyle: cf.italic ? "italic" : "normal",
                              textDecoration: cf.underline ? "underline" : "none",
                              color: cf.color ?? "#1e293b",
                              textAlign: cf.hAlign ?? "left",
                              whiteSpace: cf.wrap ? "pre-wrap" : "nowrap",
                              boxSizing: "border-box",
                            }}
                          />
                          {/* Filter dropdown arrow — shown inline inside the cell when filter is on for this row */}
                          {filterEnabled && ri === filterRow && (
                            <Box
                              onClick={e => e.stopPropagation()}
                              sx={{
                                position: "absolute",
                                bottom: 1, right: 1,
                                bgcolor: columnFilters[col] ? "#d1fae5" : "rgba(248,250,252,0.9)",
                                borderRadius: "3px",
                                border: `1px solid ${columnFilters[col] ? "#1a5336" : "#cbd5e1"}`,
                                display: "flex", alignItems: "center",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                              }}
                            >
                              <ColumnFilterDropdown
                                col={col}
                                rows={rows.filter((_, idx) => idx !== filterRow)}
                                activeValues={columnFilters[col] ?? null}
                                onChange={(val) => setColFilter(col, val)}
                              />
                            </Box>
                          )}
                        </Box>
                      ) : (
                        <Typography variant="body2" sx={{
                          px: 1.5, py: 0.75,
                          fontSize: `${cf.fontSize ?? 11}pt`,
                          fontFamily: cf.fontFamily ?? "Calibri",
                          fontWeight: cf.bold ? "bold" : "normal",
                          fontStyle: cf.italic ? "italic" : "normal",
                          textDecoration: cf.underline ? "underline" : "none",
                          color: cf.color ?? "#1e293b",
                          textAlign: cf.hAlign ?? "left",
                          whiteSpace: cf.wrap ? "pre-wrap" : "nowrap",
                        }}>
                          {displayVal}
                        </Typography>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
