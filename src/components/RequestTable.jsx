import { useState } from "react";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    Stack,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link, useNavigate } from "react-router-dom";
import { useRequests } from "../context/RequestContext";
import { useAuth } from "../context/AuthContext";

const STATUS_COLORS = {
    Pending: { bg: "#fef3c7", color: "#d97706", label: "Pending" },
    Completed: { bg: "#d1fae5", color: "#059669", label: "Completed" },
    Overdue: { bg: "#fee2e2", color: "#dc2626", label: "Overdue" },
    "In Progress": { bg: "#dbeafe", color: "#2563eb", label: "In Progress" },
};

export default function RequestTable({ requests }) {
    const { deleteRequest } = useRequests();
    const { user, isAdmin, isEditor } = useAuth();
    const navigate = useNavigate();

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteClick = (id) => {
        setIdToDelete(id);
        setDeleteModalOpen(true);
    };

    const handleCloseModal = () => {
        setDeleteModalOpen(false);
        setIdToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!idToDelete) return;

        setIsDeleting(true);
        try {
            await deleteRequest(idToDelete);
            handleCloseModal();
        } catch (error) {
            console.error("Failed to delete request:", error);
            alert("Failed to delete request. Please check the console for details.");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEdit = (id) => {
        // Since editing happens on the detail page, navigate there
        navigate(`/request/${id}`);
    };

    return (
        <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e5e7eb" }}>
            <Table sx={{ minWidth: 650 }} aria-label="request table">
                <TableHead sx={{ bgcolor: "#f9fafb" }}>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 600, color: "#4b5563" }}>Request Name</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: "#4b5563" }}>Entries</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: "#4b5563" }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: "#4b5563" }}>Due Date</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: "#4b5563" }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {requests.map((row) => {
                        const statusStyle = STATUS_COLORS[row.status] || STATUS_COLORS["Pending"];
                        const entryCount = (row.initialRows?.length || 0) +
                            (row.submissions?.reduce((acc, s) => acc + (s.rows?.length || 0), 0) || 0);

                        return (
                            <TableRow
                                key={row.id}
                                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    <Typography variant="body2" fontWeight={500}>
                                        {row.title}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" align="center" color="text.secondary">
                                        {entryCount}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={statusStyle.label}
                                        size="small"
                                        sx={{
                                            bgcolor: statusStyle.bg,
                                            color: statusStyle.color,
                                            fontWeight: 600,
                                            borderRadius: 1,
                                            height: 24,
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" color="text.secondary">
                                        {row.deadline ? new Date(row.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "-"}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Stack direction="row" spacing={1}>
                                        {(isAdmin || isEditor) && (
                                            <IconButton size="small" onClick={() => handleEdit(row.id)} sx={{ color: "#4b5563" }} title="Edit">
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        )}

                                        {(isAdmin || (isEditor && row.createdBy === user?.id)) && (
                                            <IconButton size="small" onClick={() => handleDeleteClick(row.id)} sx={{ color: "#dc2626" }} title="Delete">
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        )}
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                    {requests.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                <Typography color="text.secondary">No requests found</Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <Dialog
                open={deleteModalOpen}
                onClose={handleCloseModal}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">
                    {"Confirm Delete"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Are you sure you want to delete this data request? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0 }}>
                    <Button onClick={handleCloseModal} color="inherit">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        color="error"
                        variant="contained"
                        disabled={isDeleting}
                        autoFocus
                    >
                        {isDeleting ? "Deleting..." : "Delete Request"}
                    </Button>
                </DialogActions>
            </Dialog>
        </TableContainer>
    );
}
