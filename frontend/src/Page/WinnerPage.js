import React, { useState } from "react";
import axios from "axios";
import useSWRInfinite from "swr/infinite";
import {
  Container,
  Typography,
  Grid,
  Avatar,
  Box,
  Button,
  LinearProgress,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Alert,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import HomeIcon from "@mui/icons-material/Home";
import { Link } from "react-router-dom";
import API_URL from "../api";

const sidebarCollapsedWidth = 56;
const sidebarExpandedWidth = 160;

const WinnersPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const fetcher = (url) => {
    const token = localStorage.getItem("token");
    return axios
      .get(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then((res) => res.data);
  };

  const getKey = (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.data.length) return null;
    return `${API_URL}/allParticipantsByVotes?page=${pageIndex + 1}&limit=6`;
  };

  const { data, error, size, setSize, isLoading } = useSWRInfinite(getKey, fetcher, {
    revalidateFirstPage: false,
    revalidateOnFocus: false,
  });

  const winnersData = data
    ? data.flatMap((page) => {
        if (Array.isArray(page)) return page;
        return page.data || [];
      })
    : [];

  const maxVotes = winnersData[0]?.votes || 0;

  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.data?.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.data?.length < 6);

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
          [`& .MuiDrawer-paper`]: {
            width: sidebarOpen ? sidebarExpandedWidth : sidebarCollapsedWidth,
            bgcolor: "var(--gandhi-ivory)",
            color: "var(--gandhi-brown)",
            borderRight: "1px solid var(--gandhi-border)",
            overflowX: "hidden",
            transition: "width 0.3s ease",
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
              Gandhigiri Portal
            </Typography>
          )}
        </Box>
        <List>
          {sidebarItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
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
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Container
        sx={{
          py: 5,
          ml: `${sidebarCollapsedWidth}px`,
          width: `calc(100% - ${sidebarCollapsedWidth}px)`,
        }}
      >
        <Box textAlign="center" mb={4}>
          <div
            className="d-inline-flex align-items-center gap-2 px-3 py-1 mb-2 rounded-pill"
            style={{
              backgroundColor: "var(--gandhi-gold-light)",
              border: "1px solid rgba(198, 146, 20, 0.3)",
            }}
          >
            <span style={{ fontSize: "0.85rem", fontWeight: "bold", color: "var(--gandhi-gold-hover)" }}>
              Admin Official Leaderboard &bull; Gandhigiri 2026
            </span>
          </div>
          <Typography
            variant="h4"
            align="center"
            fontWeight="bold"
            gutterBottom
            sx={{ color: "var(--gandhi-brown)", letterSpacing: "-0.5px" }}
          >
            🏆 Event Winners
          </Typography>
          <Typography variant="body2" sx={{ color: "var(--gandhi-text-muted)" }}>
            Live ranking based on authenticated student votes
          </Typography>
        </Box>

        {isLoading && winnersData.length === 0 ? (
          <Box textAlign="center" mt={6}>
            <CircularProgress sx={{ color: "var(--gandhi-terracotta)" }} />
          </Box>
        ) : error ? (
          <Box textAlign="center" mt={4} mb={4}>
            <Alert
              severity="error"
              sx={{
                maxWidth: 550,
                mx: "auto",
                borderRadius: "12px",
                border: "1px solid rgba(211, 47, 47, 0.2)",
              }}
            >
              {error.response?.status === 403
                ? "Access denied: Administrator privileges required to view winner results."
                : error.response?.status === 401
                ? "Session expired or authentication required. Please log in as an administrator."
                : "Failed to load winners. Please try again later."}
            </Alert>
          </Box>
        ) : winnersData.length === 0 ? (
          <Box
            textAlign="center"
            mt={6}
            p={5}
            bgcolor="var(--gandhi-ivory)"
            borderRadius="16px"
            border="1px solid var(--gandhi-border)"
            boxShadow="0 4px 12px rgba(56, 34, 19, 0.05)"
            maxWidth={500}
            mx="auto"
          >
            <Typography variant="h6" sx={{ color: "var(--gandhi-text-muted)" }}>
              No winners or votes recorded yet.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2.5} direction="column" alignItems="center">
            {winnersData.map((winner, index) => {
              const rawProgress = maxVotes > 0 ? (winner.votes / maxVotes) * 100 : 0;
              const progressValue = Math.min(
                100,
                Math.max(0, Number.isFinite(rawProgress) ? rawProgress : 0)
              );

              // Gandhigiri Podium Styling
              const isGold = index === 0;
              const isSilver = index === 1;
              const isBronze = index === 2;

              const cardBg = isGold
                ? "#FFFDF0"
                : isSilver
                ? "#F9FAFB"
                : isBronze
                ? "#FDF8F5"
                : "var(--gandhi-ivory)";

              const cardBorder = isGold
                ? "2px solid #C69214"
                : isSilver
                ? "1.5px solid #9E9E9E"
                : isBronze
                ? "1.5px solid #D85A2A"
                : "1px solid var(--gandhi-border)";

              const medalBadge = isGold
                ? "🥇"
                : isSilver
                ? "🥈"
                : isBronze
                ? "🥉"
                : `#${index + 1}`;

              return (
                <Tooltip key={winner._id} title={`${winner.name} - ${winner.votes} votes`} arrow>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      maxWidth: 680,
                      bgcolor: cardBg,
                      border: cardBorder,
                      borderRadius: "14px",
                      p: 2.5,
                      boxShadow: isGold
                        ? "0 6px 20px rgba(198, 146, 20, 0.2)"
                        : "0 4px 14px rgba(56, 34, 19, 0.06)",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: "0 8px 24px rgba(56, 34, 19, 0.12)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        fontSize: isGold || isSilver || isBronze ? "1.6rem" : "1.1rem",
                        fontWeight: "bold",
                        width: 36,
                        textAlign: "center",
                        mr: 1.5,
                        color: "var(--gandhi-brown)",
                      }}
                    >
                      {medalBadge}
                    </Box>

                    <Avatar
                      alt={winner.name}
                      src={winner.image}
                      sx={{
                        width: 54,
                        height: 54,
                        mr: 2,
                        border: isGold ? "2px solid #C69214" : "2px solid var(--gandhi-border)",
                      }}
                    />

                    <Box sx={{ flexGrow: 1, mr: 2 }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{ color: "var(--gandhi-brown)", lineHeight: 1.3 }}
                      >
                        {index + 1}. {winner.name} ({winner.department})
                      </Typography>

                      <LinearProgress
                        variant="determinate"
                        value={progressValue}
                        sx={{
                          height: 10,
                          borderRadius: 5,
                          mt: 1.2,
                          bgcolor: "rgba(56, 34, 19, 0.08)",
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 5,
                            background: isGold
                              ? "linear-gradient(90deg, #C69214 0%, #E5A91A 100%)"
                              : isSilver
                              ? "linear-gradient(90deg, #78909C 0%, #B0BEC5 100%)"
                              : "linear-gradient(90deg, #D85A2A 0%, #E26A20 100%)",
                          },
                        }}
                      />
                    </Box>

                    <Box
                      sx={{
                        px: 1.8,
                        py: 0.8,
                        borderRadius: "8px",
                        bgcolor: isGold ? "var(--gandhi-gold-light)" : "var(--gandhi-cream)",
                        border: "1px solid var(--gandhi-border)",
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          fontSize: "0.95rem",
                          color: "var(--gandhi-brown)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {winner.votes} votes
                      </Typography>
                    </Box>
                  </Box>
                </Tooltip>
              );
            })}
          </Grid>
        )}

        {/* Load More Button */}
        {winnersData.length > 0 && !isReachingEnd && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <Button
              variant="contained"
              onClick={() => setSize(size + 1)}
              disabled={isLoadingMore}
              sx={{
                fontWeight: "bold",
                px: 5,
                py: 1.3,
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
              {isLoadingMore ? "Loading..." : "Load More"}
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default WinnersPage;
