import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  Paper,
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
import DeleteIcon from "@mui/icons-material/Delete";
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import CloseIcon from '@mui/icons-material/Close';

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
  const [selected, setSelected] = useState([]);

  // Initialize rows from props
  useEffect(() => {
    if (data && data.length > 0) {
      setRows(data);
    } else {
      // If no data, create empty rows
      if (editable) {
        const initialRows = Array.from({ length: Math.max(minRows, 1) }, () => {
          const emptyRow = {};
          columns.forEach((col) => {
            emptyRow[col] = "";
          });
          return emptyRow;
        });
        setRows(initialRows);
      } else {
        setRows([]);
      }
    }
  }, [data, columns, editable, minRows]);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(rows.map((_, index) => index));
    } else {
      setSelected([]);
    }
  };

  const handleSelectRow = (index) => {
    const selectedIndex = selected.indexOf(index);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, index);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleCellChange = (rowIndex, column, value) => {
    const newRows = [...rows];
    newRows[rowIndex] = { ...newRows[rowIndex], [column]: value };
    setRows(newRows);
    if (onDataChange) {
      onDataChange(newRows);
    }
  };

  const handleAddRow = () => {
    const newRow = {};
    columns.forEach((col) => {
      newRow[col] = "";
    });
    const newRows = [...rows, newRow];
    setRows(newRows);
    if (onDataChange) {
      onDataChange(newRows);
    }
  };

  const handleDeleteSelected = () => {
    const newRows = rows.filter((_, index) => !selected.includes(index));
    setRows(newRows);
    setSelected([]);
    if (onDataChange) {
      onDataChange(newRows);
    }
  };

  const handleAddColumn = () => {
    const name = window.prompt("Enter new column name:");
    if (name && !columns.includes(name)) {
      if (onColumnsChange) {
        onColumnsChange([...columns, name]);
      }
    }
  };

  const handleDeleteColumn = (colToDelete) => {
    if (window.confirm(`Delete column "${colToDelete}"?`)) {
      if (onColumnsChange) {
        onColumnsChange(columns.filter(c => c !== colToDelete));
      }
    }
  };

  // Column Actions
  const showColumnActions = editable || allowColumnManagement;

  // Helper to get Excel column letter
  const getColumnLetter = (index) => {
    let letter = "";
    while (index >= 0) {
      letter = String.fromCharCode((index % 26) + 65) + letter;
      index = Math.floor(index / 26) - 1;
    }
    return letter;
  };

  return (
    <Box sx={{ width: "100%", bgcolor: '#fff', borderRadius: 2, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
      {/* Excel Ribbon / Toolbar */}
      <Box
        sx={{
          bgcolor: '#1a5336', // Dark Green
          color: 'white',
          p: '4px 8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 48
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              height: 48,
              px: 3,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.75rem', letterSpacing: 0.5 }}>HOME</Typography>
          </Box>
        </Box>

        {showColumnActions && (
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon sx={{ fontSize: 16 }} />}
              onClick={handleAddRow}
              sx={{
                bgcolor: 'rgba(255,255,255,0.15)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
                textTransform: 'none',
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: 2,
                px: 2
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
                bgcolor: 'rgba(255,255,255,0.15)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
                textTransform: 'none',
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: 2,
                px: 2
              }}
            >
              Add Column
            </Button>
          </Stack>
        )}
      </Box>

      <TableContainer
        sx={{
          maxHeight: height,
          '& .MuiTableCell-root': {
            border: '1px solid #e5e7eb',
            p: 1,
            lineHeight: 1
          }
        }}
      >
        <Table stickyHeader size="small">
          <TableHead>
            {/* Column Letters Row (Excel Style) */}
            <TableRow>
              <TableCell sx={{ bgcolor: '#f8fafc', width: 40, borderRight: '1px solid #e2e8f0', textAlign: 'center' }} />
              {editable && <TableCell sx={{ bgcolor: '#f8fafc', width: 40, textAlign: 'center' }} />}
              {columns.map((_, idx) => (
                <TableCell
                  key={`letter-${idx}`}
                  align="center"
                  sx={{
                    bgcolor: '#f8fafc',
                    color: '#64748b',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    py: 0.5,
                    borderBottom: 'none'
                  }}
                >
                  {getColumnLetter(idx)}
                </TableCell>
              ))}
            </TableRow>
            {/* Column Names Row */}
            <TableRow>
              <TableCell sx={{ bgcolor: '#f1f5f9', borderRight: '1px solid #e2e8f0' }} />
              {editable && (
                <TableCell padding="checkbox" sx={{ bgcolor: '#f1f5f9', textAlign: 'center' }}>
                  <Checkbox
                    size="small"
                    indeterminate={selected.length > 0 && selected.length < rows.length}
                    checked={rows.length > 0 && selected.length === rows.length}
                    onChange={handleSelectAll}
                    sx={{ p: 0.5 }}
                  />
                </TableCell>
              )}
              {columns.map((col) => (
                <TableCell
                  key={col}
                  sx={{
                    minWidth: 150,
                    bgcolor: '#f1f5f9',
                    color: '#1e293b',
                    fontWeight: 600,
                    px: 1.5,
                    py: 1,
                    borderBottom: '1px solid #e2e8f0'
                  }}
                >
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{col}</Typography>
                    {showColumnActions && columns.length > 1 && (
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteColumn(col)}
                        sx={{ p: 0.2, opacity: 0.4, ':hover': { opacity: 1, color: 'error.main' } }}
                      >
                        <CloseIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    )}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, rowIndex) => {
              const isSelected = selected.indexOf(rowIndex) !== -1;
              return (
                <TableRow
                  key={rowIndex}
                  sx={{
                    bgcolor: rowIndex % 2 === 0 ? '#fff' : '#f8fafc',
                    '&.Mui-selected': { bgcolor: '#f0f9ff' },
                    '&:hover': { bgcolor: '#f1f5f9' }
                  }}
                >
                  {/* Row Number (Excel Style) */}
                  <TableCell
                    align="center"
                    sx={{
                      bgcolor: '#f1f5f9',
                      color: '#64748b',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      borderRight: '1px solid #e2e8f0 !important',
                      width: 40
                    }}
                  >
                    {rowIndex + 1}
                  </TableCell>

                  {editable && (
                    <TableCell padding="checkbox" align="center" sx={{ width: 40 }}>
                      <Checkbox
                        size="small"
                        checked={isSelected}
                        onChange={() => handleSelectRow(rowIndex)}
                        sx={{ p: 0.5 }}
                      />
                    </TableCell>
                  )}
                  {columns.map((col) => (
                    <TableCell key={`${rowIndex}-${col}`}>
                      {editable ? (
                        <TextField
                          fullWidth
                          size="small"
                          variant="standard"
                          value={row[col] || ""}
                          onChange={(e) => handleCellChange(rowIndex, col, e.target.value)}
                          InputProps={{ disableUnderline: true }}
                          sx={{
                            '& .MuiInputBase-root': {
                              fontSize: '0.875rem',
                              px: 1.5,
                              py: 0.75,
                              '&:focus-within': {
                                outline: '2px solid #1a5336',
                                outlineOffset: '-2px',
                                zIndex: 1,
                                bgcolor: 'white'
                              }
                            }
                          }}
                        />
                      ) : (
                        <Typography variant="body2" sx={{ px: 1.5, py: 0.75 }}>{row[col]}</Typography>
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
