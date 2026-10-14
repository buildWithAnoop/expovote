import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Grid,
  Avatar,
  Box,
  IconButton,
  TextField,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Tooltip,
  Pagination,
  Alert,
  Paper,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import HomeIcon from "@mui/icons-material/Home";
import HowToVoteIcon from "@mui/icons-material/HowToVote";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
import API_URL from "../api";

const sidebarCollapsedWidth = 56;
const sidebarExpandedWidth = 160;

const AdminPanel = () => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Determine administrator role from current token
  const token = localStorage.getItem("token");
  let isAdmin = false;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      isAdmin = decoded.role === "admin";
    } catch (_) {
      isAdmin = false;
    }
  }

  // Voting control window state
  const [votingStatus, setVotingStatus] = useState(null);
  const [votingLoading, setVotingLoading] = useState(false);
  const [votingActionInProgress, setVotingActionInProgress] = useState(false);
  const [votingMessage, setVotingMessage] = useState(null);
  const [votingConfirmDialog, setVotingConfirmDialog] = useState({ open: false, action: null });

  // Pagination state (default limit 50 aligned with backend max limit)
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 50;

  const activeRequestRef = useRef(null);

  // Fetch voting status from backend (Admin only)
  const fetchVotingStatus = useCallback(async () => {
    if (!isAdmin) return;
    setVotingLoading(true);
    try {
      const currentToken = localStorage.getItem("token");
      const { data } = await axios.get(`${API_URL}/admin/votingStatus`, {
        headers: currentToken ? { Authorization: `Bearer ${currentToken}` } : {},
      });
      setVotingStatus(Boolean(data.votingEnabled));
    } catch (err) {
      console.error("Error fetching voting status:", err);
      setVotingStatus(false);
      setVotingMessage({
        type: "error",
        text: err.response?.data?.error || "Failed to load voting status from server.",
      });
    } finally {
      setVotingLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      fetchVotingStatus();
    }
  }, [isAdmin, fetchVotingStatus]);

  // Execute start or stop voting action after confirmation
  const handleVotingAction = async (action) => {
    setVotingConfirmDialog({ open: false, action: null });
    setVotingActionInProgress(true);
    setVotingMessage(null);
    try {
      const currentToken = localStorage.getItem("token");
      const endpoint = action === "start" ? "/admin/startVoting" : "/admin/stopVoting";
      const { data } = await axios.post(
        `${API_URL}${endpoint}`,
        {},
        {
          headers: currentToken ? { Authorization: `Bearer ${currentToken}` } : {},
        }
      );
      setVotingMessage({
        type: "success",
        text: data.message || `Voting ${action === "start" ? "started" : "stopped"} successfully!`,
      });
      await fetchVotingStatus();
    } catch (err) {
      console.error(`Error during ${action} voting:`, err);
      setVotingMessage({
        type: "error",
        text: err.response?.data?.error || `Failed to ${action} voting. Please try again.`,
      });
    } finally {
      setVotingActionInProgress(false);
    }
  };

  // Fetch participants with abort controller to prevent duplicate/stale requests
  const fetchParticipants = useCallback(
    async (targetPage = 1, signal) => {
      if (activeRequestRef.current) {
        activeRequestRef.current.abort();
      }
      const controller = new AbortController();
      activeRequestRef.current = controller;

      setLoading(true);
      setError(null);

      try {
        const { data } = await axios.get(
          `${API_URL}/allParticipants?page=${targetPage}&limit=${limit}`,
          { signal: signal || controller.signal }
        );

        let items = [];
        if (data && Array.isArray(data.data)) {
          items = data.data;
        } else if (Array.isArray(data)) {
          items = data;
        }

        setParticipants(items);

        if (data && data.meta) {
          const metaTotal =
            typeof data.meta.total === "number" ? data.meta.total : items.length;
          setTotal(metaTotal);
          setTotalPages(Math.max(1, Math.ceil(metaTotal / limit)));
        } else {
          setTotal(items.length);
          setTotalPages(1);
        }
      } catch (err) {
        if (
          axios.isCancel?.(err) ||
          err.name === "CanceledError" ||
          err.code === "ERR_CANCELED"
        ) {
          return;
        }
        console.error("Error fetching participants:", err);
        setError("Failed to load participants. Please try again.");
        setParticipants([]);
      } finally {
        if (activeRequestRef.current === controller) {
          activeRequestRef.current = null;
          setLoading(false);
        }
      }
    },
    [limit]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchParticipants(page, controller.signal);
    return () => {
      controller.abort();
    };
  }, [page, fetchParticipants]);

  const handlePageChange = (event, value) => {
    if (value !== page && !loading) {
      setPage(value);
    }
  };

  // Delete participant
  const handleDelete = async (participantId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/deleteParticipant/${participantId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const remaining = participants.filter((p) => p._id !== participantId);
      setParticipants(remaining);
      setTotal((prev) => {
        const nextTotal = Math.max(0, prev - 1);
        setTotalPages(Math.max(1, Math.ceil(nextTotal / limit)));
        return nextTotal;
      });
      setDeleteDialog({ open: false, id: null });

      if (remaining.length === 0 && page > 1) {
        setPage((prevPage) => prevPage - 1);
      }
    } catch (err) {
      console.error("Error deleting participant:", err);
      alert(err.response?.data?.error || "Failed to delete participant.");
    }
  };

  // Filter participants (null-safe handling for department, projectName, name, teamNo)
  const filteredParticipants = participants.filter((p) => {
    const s = search.toLowerCase();
    const nameMatch = p.name ? p.name.toLowerCase().includes(s) : false;
    const deptMatch = p.department ? p.department.toLowerCase().includes(s) : false;
    const projectMatch = p.projectName ? p.projectName.toLowerCase().includes(s) : false;
    const teamMatch = p.teamNo ? p.teamNo.toString().includes(s) : false;
    return nameMatch || deptMatch || projectMatch || teamMatch;
  });

  const sidebarItems = [
    { text: "Register", icon: <PersonAddIcon />, link: "/register" },
    { text: "Winners", icon: <EmojiEventsIcon />, link: "/winners" },
    { text: "Signup", icon: <AppRegistrationIcon />, link: "/signup" },
  ];

  return (
    <Box sx={{ display: "flex", backgroundColor: "var(--gandhi-cream)", minHeight: "85vh" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
        sx={{
          width: sidebarOpen ? sidebarExpandedWidth : sidebarCollapsedWidth,
          flexShrink: 0,
          transition: "width 0.3s ease",
          [`& .MuiDrawer-paper`]: {
            width: sidebarOpen ? sidebarExpandedWidth : sidebarCollapsedWidth,
            transition: "width 0.3s ease",
            bgcolor: "var(--gandhi-ivory)",
            color: "var(--gandhi-brown)",
            borderRight: "1px solid var(--gandhi-border)",
            overflowX: "hidden",
            boxShadow: "2px 0 10px rgba(56, 34, 19, 0.05)",
          },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 3, mb: 1 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: "50%",
              bgcolor: "var(--gandhi-terracotta-light)",
              color: "var(--gandhi-terracotta)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <HomeIcon fontSize="medium" />
          </Box>
          {sidebarOpen && (
            <Typography
              variant="subtitle2"
              mt={1}
              fontWeight="bold"
              sx={{ color: "var(--gandhi-brown)", letterSpacing: "0.5px" }}
            >
              Admin Panel
            </Typography>
          )}
        </Box>
        <List>
          {sidebarItems.map((item) => (
            <Tooltip
              key={item.text}
              title={!sidebarOpen ? item.text : ""}
              placement="right"
            >
              <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  component={Link}
                  to={item.link}
                  sx={{
                    borderRadius: 2,
                    mx: 1,
                    transition: "0.25s",
                    color: "var(--gandhi-brown)",
                    "&:hover": {
                      bgcolor: "var(--gandhi-terracotta-light)",
                      transform: "translateX(2px)",
                      color: "var(--gandhi-terracotta)",
                    },
                  }}
                >
                  {item.icon}
                  {sidebarOpen && (
                    <ListItemText
                      primary={item.text}
                      sx={{ ml: 2, "& .MuiTypography-root": { fontWeight: 600, fontSize: "0.9rem" } }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            </Tooltip>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Container
        sx={{
          py: 5,
          ml: sidebarOpen ? `${sidebarExpandedWidth}px` : `${sidebarCollapsedWidth}px`,
          width: `calc(100% - ${sidebarOpen ? sidebarExpandedWidth : sidebarCollapsedWidth}px)`,
          transition: "margin-left 0.3s ease, width 0.3s ease",
        }}
      >
        {/* Admin Voting Window Controls (Only visible to authenticated administrators) */}
        {isAdmin && (
          <Paper
            elevation={3}
            sx={{
              p: 3.5,
              mb: 4,
              borderRadius: "16px",
              bgcolor: "var(--gandhi-ivory)",
              border: "1px solid var(--gandhi-border)",
              boxShadow: "0 6px 20px rgba(56, 34, 19, 0.06)",
            }}
            aria-label="voting-control-panel"
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <Box>
                <div
                  className="d-inline-flex align-items-center gap-2 px-2.5 py-0.5 mb-1.5 rounded-pill"
                  style={{
                    backgroundColor: "var(--gandhi-terracotta-light)",
                    border: "1px solid rgba(216, 90, 42, 0.25)",
                  }}
                >
                  <span style={{ fontSize: "0.75rem", fontWeight: "bold", color: "var(--gandhi-terracotta)" }}>
                    Admin Window Controls &bull; Gandhigiri 2026
                  </span>
                </div>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ color: "var(--gandhi-brown)", letterSpacing: "-0.3px" }}
                >
                  Voting Window Controls
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 1 }}>
                  <Typography variant="body2" sx={{ color: "var(--gandhi-text-muted)" }}>
                    Current Status:
                  </Typography>
                  {votingLoading && votingStatus === null ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CircularProgress size={16} sx={{ color: "var(--gandhi-terracotta)" }} />
                      <Typography variant="body2" sx={{ color: "var(--gandhi-text-muted)" }}>
                        Checking status...
                      </Typography>
                    </Box>
                  ) : votingStatus === true ? (
                    <Chip
                      label="VOTING OPEN"
                      color="success"
                      size="small"
                      icon={<HowToVoteIcon fontSize="small" />}
                      sx={{ fontWeight: "bold", px: 1, borderRadius: "6px" }}
                      aria-label="voting-status-open"
                    />
                  ) : (
                    <Chip
                      label="VOTING CLOSED"
                      color="error"
                      size="small"
                      sx={{ fontWeight: "bold", px: 1, borderRadius: "6px" }}
                      aria-label="voting-status-closed"
                    />
                  )}
                </Box>
              </Box>

              <Stack direction="row" spacing={2} alignItems="center">
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<PlayCircleIcon />}
                  disabled={votingLoading || votingActionInProgress || votingStatus === true}
                  onClick={() => setVotingConfirmDialog({ open: true, action: "start" })}
                  aria-label="start-voting-button"
                  sx={{
                    textTransform: "none",
                    fontWeight: "bold",
                    borderRadius: "8px",
                    px: 2.5,
                  }}
                >
                  Start Voting
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<StopCircleIcon />}
                  disabled={votingLoading || votingActionInProgress || votingStatus === false}
                  onClick={() => setVotingConfirmDialog({ open: true, action: "stop" })}
                  aria-label="stop-voting-button"
                  sx={{
                    textTransform: "none",
                    fontWeight: "bold",
                    borderRadius: "8px",
                    px: 2.5,
                  }}
                >
                  Stop Voting
                </Button>
                {votingActionInProgress && (
                  <CircularProgress size={24} aria-label="voting-action-spinner" sx={{ color: "var(--gandhi-terracotta)" }} />
                )}
              </Stack>
            </Box>

            {votingMessage && (
              <Alert
                severity={votingMessage.type}
                sx={{ mt: 2.5, borderRadius: "10px" }}
                onClose={() => setVotingMessage(null)}
                aria-label="voting-message-alert"
              >
                {votingMessage.text}
              </Alert>
            )}
          </Paper>
        )}

        {/* Search Box */}
        <Box mb={4} textAlign="center">
          <TextField
            variant="outlined"
            placeholder="Search participants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              width: "100%",
              maxWidth: 440,
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                bgcolor: "var(--gandhi-ivory)",
                border: "1px solid var(--gandhi-border)",
                "&.Mui-focused fieldset": { borderColor: "var(--gandhi-terracotta)" },
              },
            }}
          />
        </Box>

        {/* Participants */}
        {loading ? (
          <Box textAlign="center" mt={10}>
            <CircularProgress sx={{ color: "var(--gandhi-terracotta)" }} />
          </Box>
        ) : error ? (
          <Box textAlign="center" mt={4} mb={4}>
            <Alert severity="error" sx={{ maxWidth: 500, mx: "auto", mb: 2, borderRadius: "10px" }}>
              {error}
            </Alert>
            <Button
              variant="contained"
              onClick={() => fetchParticipants(page)}
              sx={{
                bgcolor: "var(--gandhi-terracotta)",
                borderRadius: "8px",
                "&:hover": { bgcolor: "var(--gandhi-terracotta-hover)" },
              }}
            >
              Retry
            </Button>
          </Box>
        ) : (
          <>
            {filteredParticipants.length === 0 ? (
              <Box
                textAlign="center"
                mt={6}
                p={5}
                bgcolor="var(--gandhi-ivory)"
                borderRadius="16px"
                border="1px solid var(--gandhi-border)"
                boxShadow="0 4px 12px rgba(56, 34, 19, 0.05)"
              >
                <Typography variant="h6" sx={{ color: "var(--gandhi-text-muted)" }}>
                  {search ? "No participants match your search criteria." : "No participants found."}
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2.5}>
                {filteredParticipants.map((participant, index) => (
                  <Grid item xs={12} sm={6} md={4} key={participant._id}>
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: index * 0.03 }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          p: 3,
                          borderRadius: "14px",
                          bgcolor: "var(--gandhi-ivory)",
                          border: "1px solid var(--gandhi-border)",
                          boxShadow: "0 4px 14px rgba(56, 34, 19, 0.06)",
                          transition: "0.25s",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: "0 10px 24px rgba(56, 34, 19, 0.12)",
                            borderColor: "rgba(216, 90, 42, 0.3)",
                          },
                        }}
                      >
                        <Avatar
                          alt={participant.name}
                          src={participant.image}
                          sx={{
                            width: 72,
                            height: 72,
                            mb: 2,
                            border: "2px solid var(--gandhi-border)",
                          }}
                        />
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          align="center"
                          sx={{ color: "var(--gandhi-brown)", fontSize: "1.05rem", lineHeight: 1.3 }}
                        >
                          {participant.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "var(--gandhi-text-muted)", fontSize: "0.82rem" }}
                          align="center"
                          mb={1.5}
                        >
                          {participant.email}
                        </Typography>
                        <Chip
                          label={participant.department || participant.projectName || "General"}
                          size="small"
                          sx={{
                            mb: 1.5,
                            bgcolor: "var(--gandhi-terracotta-light)",
                            color: "var(--gandhi-terracotta)",
                            fontWeight: "600",
                            border: "1px solid rgba(216, 90, 42, 0.2)",
                            borderRadius: "6px",
                          }}
                        />
                        {/* Team Number */}
                        {participant.teamNo && (
                          <Typography
                            variant="body2"
                            sx={{
                              color: "var(--gandhi-gold-hover)",
                              fontWeight: "bold",
                              fontSize: "0.82rem",
                            }}
                            align="center"
                            mb={2}
                          >
                            Team No: {participant.teamNo}
                          </Typography>
                        )}
                        <IconButton
                          color="error"
                          aria-label={`delete-${participant._id}`}
                          onClick={() =>
                            setDeleteDialog({ open: true, id: participant._id })
                          }
                          sx={{
                            bgcolor: "rgba(211, 47, 47, 0.08)",
                            "&:hover": { bgcolor: "rgba(211, 47, 47, 0.18)" },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            )}

            {/* Pagination Controls */}
            {total > 0 && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mt: 5,
                  mb: 2,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "var(--gandhi-text-muted)" }}
                  mb={1.5}
                  aria-label="pagination-info"
                >
                  Showing {participants.length ? (page - 1) * limit + 1 : 0} -{" "}
                  {Math.min(page * limit, total)} of {total} projects (Page {page} of {totalPages})
                </Typography>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  showFirstButton
                  showLastButton
                  disabled={loading}
                  aria-label="admin-pagination"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: "var(--gandhi-brown)",
                      "&.Mui-selected": {
                        backgroundColor: "var(--gandhi-terracotta)",
                        color: "#ffffff",
                        "&:hover": { backgroundColor: "var(--gandhi-terracotta-hover)" },
                      },
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, id: null })}
          PaperProps={{
            sx: {
              borderRadius: "14px",
              p: 1,
              bgcolor: "var(--gandhi-ivory)",
            },
          }}
        >
          <DialogTitle sx={{ color: "var(--gandhi-brown)", fontWeight: "bold" }}>
            Are you sure you want to delete this participant?
          </DialogTitle>
          <DialogActions sx={{ pb: 2, px: 3 }}>
            <Button
              onClick={() => setDeleteDialog({ open: false, id: null })}
              sx={{ color: "var(--gandhi-brown)", textTransform: "none", fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button
              color="error"
              variant="contained"
              onClick={() => handleDelete(deleteDialog.id)}
              sx={{ borderRadius: "8px", textTransform: "none", fontWeight: "bold" }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Voting Window Action Confirmation Dialog */}
        <Dialog
          open={votingConfirmDialog.open}
          onClose={() =>
            !votingActionInProgress && setVotingConfirmDialog({ open: false, action: null })
          }
          PaperProps={{
            sx: {
              borderRadius: "14px",
              p: 1,
              bgcolor: "var(--gandhi-ivory)",
            },
          }}
        >
          <DialogTitle sx={{ color: "var(--gandhi-brown)", fontWeight: "bold" }}>
            {votingConfirmDialog.action === "start" ? "Confirm Start Voting" : "Confirm Stop Voting"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ color: "var(--gandhi-text-muted)" }}>
              {votingConfirmDialog.action === "start"
                ? "Are you sure you want to OPEN voting? Authenticated students will immediately be able to cast votes for participants."
                : "Are you sure you want to CLOSE voting? Students will no longer be able to submit new votes. All existing votes and ledger records will be preserved safely."}
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ pb: 2, px: 3 }}>
            <Button
              onClick={() => setVotingConfirmDialog({ open: false, action: null })}
              disabled={votingActionInProgress}
              sx={{ color: "var(--gandhi-brown)", textTransform: "none", fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button
              color={votingConfirmDialog.action === "start" ? "success" : "error"}
              variant="contained"
              onClick={() => handleVotingAction(votingConfirmDialog.action)}
              disabled={votingActionInProgress}
              autoFocus
              sx={{ borderRadius: "8px", textTransform: "none", fontWeight: "bold" }}
            >
              {votingConfirmDialog.action === "start" ? "Open Voting" : "Close Voting"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AdminPanel;
