import React, { useState, useCallback, useMemo, memo } from "react";
import axios from "axios";
import useSWRInfinite from "swr/infinite";
import { useInView } from "react-intersection-observer";
import {
  Container,
  Typography,
  Grid,
  Button,
  Box,
  Paper,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
  Skeleton,
} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkIcon from "@mui/icons-material/Link";
import HowToVoteIcon from "@mui/icons-material/HowToVote";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import API_URL from "../api";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const VOTE_STORAGE_KEY = "guestVotes";
const VOTE_COOLDOWN_MS = 12 * 60 * 60 * 1000;

const getGuestVotes = () => {
  try {
    return JSON.parse(localStorage.getItem(VOTE_STORAGE_KEY)) || {};
  } catch {
    return {};
  }
};

// ---- Optimized Lazy Image ----
const LazyImage = ({ src, alt }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: "300px",
  });

  return (
    <Box
      ref={ref}
      component="img"
      src={inView ? src : ""}
      alt={alt}
      loading="lazy"
      sx={{
        width: "100%",
        height: 160,
        objectFit: "cover",
        borderRadius: "12px",
        mb: 2,
        background: "var(--gandhi-cream)",
        border: "1px solid var(--gandhi-border)",
        filter: inView ? "blur(0px)" : "blur(10px)",
        transition: "filter 0.4s ease-out",
      }}
    />
  );
};

// ---- Memoized Card with Gandhigiri 2026 Theme ----
const ParticipantCard = memo(({ participant, voted, onVote }) => (
  <Grid item xs={12} sm={6} md={4}>
    <Paper
      elevation={3}
      sx={{
        width: "100%",
        maxWidth: 320,
        height: 520,
        p: 2.5,
        borderRadius: "16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        bgcolor: "var(--gandhi-ivory)",
        border: "1px solid var(--gandhi-border)",
        transition: "all 0.25s ease",
        mx: "auto",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 12px 28px rgba(56, 34, 19, 0.12)",
          borderColor: "rgba(216, 90, 42, 0.4)",
        },
      }}
    >
      {/* Team / Participant Name Badge */}
      <Box
        sx={{
          py: 1,
          px: 1.5,
          mb: 1.5,
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "1.05rem",
          color: "#ffffff",
          background: "linear-gradient(135deg, var(--gandhi-brown) 0%, var(--gandhi-brown-light) 100%)",
          borderRadius: "10px",
          letterSpacing: "0.5px",
          boxShadow: "0 2px 6px rgba(56, 34, 19, 0.2)",
        }}
      >
        {participant.name}
      </Box>

      {/* Project Name or Department */}
      {(participant.projectName || participant.department) && (
        <Box
          sx={{
            py: 0.6,
            px: 1.5,
            fontWeight: "600",
            fontSize: "0.85rem",
            textAlign: "center",
            background: "var(--gandhi-terracotta-light)",
            color: "var(--gandhi-terracotta)",
            border: "1px solid rgba(216, 90, 42, 0.2)",
            borderRadius: "8px",
            mb: 1,
          }}
        >
          {participant.projectName || participant.department}
        </Box>
      )}

      {participant.email && (
        <Typography
          align="center"
          sx={{
            fontWeight: "500",
            fontSize: "0.8rem",
            color: "var(--gandhi-text-muted)",
            mb: 1,
          }}
        >
          {participant.email}
        </Typography>
      )}

      <LazyImage src={participant.image} alt={participant.name} />

      {/* Project Description Container */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", pr: 0.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: "700",
              color: "var(--gandhi-brown)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Team #{participant.teamNo || "-"}
          </Typography>
        </Box>

        <Typography
          variant="body2"
          sx={{
            border: "1px dashed rgba(216, 90, 42, 0.3)",
            p: 1.5,
            borderRadius: "10px",
            background: "var(--gandhi-cream)",
            color: "var(--gandhi-text-dark)",
            fontSize: "0.82rem",
            lineHeight: 1.5,
          }}
        >
          {participant.description}
        </Typography>
      </Box>

      {/* Vote Action */}
      {!voted ? (
        <Button
          variant="contained"
          fullWidth
          startIcon={<HowToVoteIcon />}
          sx={{
            mt: 2,
            py: 1.2,
            borderRadius: "10px",
            background: "linear-gradient(135deg, var(--gandhi-terracotta) 0%, var(--gandhi-saffron) 100%)",
            color: "#ffffff",
            fontWeight: "bold",
            fontSize: "0.95rem",
            textTransform: "none",
            boxShadow: "0 4px 12px rgba(216, 90, 42, 0.25)",
            "&:hover": {
              background: "linear-gradient(135deg, var(--gandhi-terracotta-hover) 0%, var(--gandhi-terracotta) 100%)",
            },
          }}
          onClick={() => onVote(participant._id)}
        >
          Vote
        </Button>
      ) : (
        <Box
          sx={{
            mt: 2,
            py: 1,
            borderRadius: "10px",
            bgcolor: "rgba(46, 125, 50, 0.1)",
            border: "1px solid rgba(46, 125, 50, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <CheckCircleIcon sx={{ color: "#2E7D32", fontSize: "1.1rem" }} />
          <Typography sx={{ color: "#2E7D32", fontWeight: "bold", fontSize: "0.9rem" }}>
            You have voted
          </Typography>
        </Box>
      )}
    </Paper>
  </Grid>
));

const ParticipantsPage = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // ---- SWR Infinite for Pagination ----
  const getKey = (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.data.length) return null;
    return `${API_URL}/allParticipants?page=${pageIndex + 1}&limit=6`;
  };

  const { data, mutate, size, setSize, isLoading } = useSWRInfinite(
    getKey,
    fetcher,
    {
      revalidateFirstPage: false,
      revalidateOnFocus: false,
    }
  );

  const allParticipants = data
    ? data.flatMap((page) => {
        if (Array.isArray(page)) return page;
        return page.data || [];
      })
    : [];
  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.data?.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.data?.length < 6);

  const loading = isLoading && !data;

  // ---- Voting Logic ----
  const handleVote = useCallback(
    async (id) => {
      const token = localStorage.getItem("token");
      if (!token) {
        setSnackbar({
          open: true,
          message: "Please login to cast your vote!",
          severity: "warning",
        });
        return;
      }

      // Optimistic UI update
      mutate(
        (currentData) => {
          if (!currentData) return currentData;
          return currentData.map((page) => ({
            ...page,
            data: page.data.map((p) =>
              p._id === id ? { ...p, votes: (p.votes || 0) + 1 } : p
            ),
          }));
        },
        { revalidate: false }
      );

      try {
        const res = await axios.post(
          `${API_URL}/voteParticipant/${id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        mutate();
        if (res.data?.alreadyVoted) {
          setSnackbar({
            open: true,
            message: "Vote already recorded for this participant.",
            severity: "info",
          });
        } else {
          setSnackbar({
            open: true,
            message: "Vote Successful!",
            severity: "success",
          });
        }
      } catch (err) {
        mutate();
        const errorMsg =
          err.response?.data?.error ||
          (err.response?.status === 401
            ? "Session expired. Please login again to vote."
            : "Vote Failed!");
        setSnackbar({ open: true, message: errorMsg, severity: "error" });
      }
    },
    [mutate]
  );

  // ---- Share ----
  const handleShareClick = (e) => setAnchorEl(e.currentTarget);
  const handleShareClose = (platform) => {
    setAnchorEl(null);
    if (!platform) return;

    const url = window.location.href;

    const links = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
    };

    if (platform === "link") {
      navigator.clipboard.writeText(url);
      setSnackbar({ open: true, message: "Link Copied!", severity: "success" });
      return;
    }

    window.open(links[platform], "_blank");
  };

  const guestVotes = useMemo(() => getGuestVotes(), []);

  return (
    <Box sx={{ backgroundColor: "var(--gandhi-cream)", minHeight: "85vh", py: 6 }}>
      <Container>
        {/* Header Section */}
        <Box textAlign="center" mb={4}>
          <div
            className="d-inline-flex align-items-center gap-2 px-3 py-1 mb-2 rounded-pill"
            style={{
              backgroundColor: "var(--gandhi-terracotta-light)",
              border: "1px solid rgba(216, 90, 42, 0.25)",
            }}
          >
            <span style={{ fontSize: "0.85rem", fontWeight: "bold", color: "var(--gandhi-terracotta)" }}>
              Gandhigiri 2026 Exhibition
            </span>
          </div>
          <Typography
            variant="h4"
            align="center"
            fontWeight="bold"
            sx={{ color: "var(--gandhi-brown)", letterSpacing: "-0.5px" }}
          >
            🏅 Participants of the Event
          </Typography>
          <Typography
            variant="body1"
            align="center"
            sx={{ color: "var(--gandhi-text-muted)", maxWidth: 600, mx: "auto", mt: 1 }}
          >
            Explore innovative projects submitted by students and cast your vote to recognize excellence
          </Typography>
        </Box>

        {/* Share Button */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <Button
            variant="outlined"
            startIcon={<ShareIcon />}
            onClick={handleShareClick}
            sx={{
              borderColor: "var(--gandhi-border)",
              color: "var(--gandhi-brown)",
              bgcolor: "var(--gandhi-ivory)",
              borderRadius: "10px",
              px: 3,
              fontWeight: 600,
              textTransform: "none",
              "&:hover": {
                borderColor: "var(--gandhi-terracotta)",
                bgcolor: "var(--gandhi-terracotta-light)",
                color: "var(--gandhi-terracotta)",
              },
            }}
          >
            Share Participants
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => handleShareClose(null)}
            PaperProps={{
              sx: {
                borderRadius: "12px",
                bgcolor: "var(--gandhi-ivory)",
                border: "1px solid var(--gandhi-border)",
                boxShadow: "0 6px 20px rgba(56, 34, 19, 0.1)",
              },
            }}
          >
            <MenuItem onClick={() => handleShareClose("whatsapp")} sx={{ gap: 1.5, py: 1.2 }}>
              <WhatsAppIcon sx={{ color: "#25D366" }} /> WhatsApp
            </MenuItem>
            <MenuItem onClick={() => handleShareClose("facebook")} sx={{ gap: 1.5, py: 1.2 }}>
              <FacebookIcon sx={{ color: "#1877F2" }} /> Facebook
            </MenuItem>
            <MenuItem onClick={() => handleShareClose("twitter")} sx={{ gap: 1.5, py: 1.2 }}>
              <TwitterIcon sx={{ color: "#1DA1F2" }} /> Twitter
            </MenuItem>
            <MenuItem onClick={() => handleShareClose("link")} sx={{ gap: 1.5, py: 1.2 }}>
              <LinkIcon sx={{ color: "var(--gandhi-terracotta)" }} /> Copy Link
            </MenuItem>
          </Menu>
        </Box>

        {/* PARTICIPANT GRID */}
        <Grid container spacing={4} justifyContent="center">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Grid key={i} item xs={12} sm={6} md={4}>
                  <Skeleton
                    variant="rectangular"
                    height={520}
                    sx={{ borderRadius: "16px", bgcolor: "var(--gandhi-border-subtle)" }}
                  />
                </Grid>
              ))
            : allParticipants?.map((p) => {
                const voted =
                  guestVotes[p._id] &&
                  Date.now() - guestVotes[p._id] < VOTE_COOLDOWN_MS;

                return (
                  <ParticipantCard
                    key={p._id}
                    participant={p}
                    voted={voted}
                    onVote={handleVote}
                  />
                );
              })}
        </Grid>

        {/* Load More Button */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          {!isReachingEnd && (
            <Button
              variant="contained"
              onClick={() => setSize(size + 1)}
              disabled={isLoadingMore}
              sx={{
                fontWeight: "bold",
                px: 5,
                py: 1.4,
                borderRadius: "10px",
                background: "linear-gradient(135deg, var(--gandhi-brown) 0%, var(--gandhi-brown-light) 100%)",
                color: "#ffffff",
                boxShadow: "0 4px 14px rgba(56, 34, 19, 0.2)",
                textTransform: "none",
                "&:hover": {
                  background: "linear-gradient(135deg, var(--gandhi-brown-dark) 0%, var(--gandhi-brown) 100%)",
                },
              }}
            >
              {isLoadingMore ? "Loading..." : "Load More Projects"}
            </Button>
          )}
        </Box>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={2500}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        >
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default ParticipantsPage;
