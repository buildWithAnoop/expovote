import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../components/AuthContext";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Box,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import HomeIcon from "@mui/icons-material/Home";
import { jwtDecode } from "jwt-decode";
import API_URL from "../api";

const sidebarCollapsedWidth = 56;
const sidebarExpandedWidth = 160;

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      toast.error("Invalid email address");
      return false;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      };
      const { data } = await axios.post(`${API_URL}/signup`, payload);
      login(data.token);
      toast.success("Signup successful!");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      toast.error(err.response?.data?.error || "Network error");
    } finally {
      setLoading(false);
    }
  };

  const { token } = useContext(AuthContext);
  let userRole = null;
  if (token) {
    try {
      userRole = jwtDecode(token).role;
    } catch (_) {}
  }

  const sidebarItems = [
    { text: "Register", icon: <PersonAddIcon />, link: "/register" },
    ...(userRole === "admin"
      ? [{ text: "Winners", icon: <EmojiEventsIcon />, link: "/winners" }]
      : []),
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
      <Box
        sx={{
          ml: `${sidebarCollapsedWidth}px`,
          width: `calc(100% - ${sidebarCollapsedWidth}px)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 6,
          px: 2,
        }}
      >
        <div
          className="signup-card shadow-lg p-4 p-md-5"
          style={{
            width: "100%",
            maxWidth: "460px",
            backgroundColor: "var(--gandhi-ivory)",
            border: "1px solid var(--gandhi-border)",
            borderRadius: "16px",
          }}
        >
          <div className="text-center mb-4">
            <div
              className="d-inline-flex align-items-center justify-content-center mb-2"
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                backgroundColor: "var(--gandhi-terracotta-light)",
                border: "2px solid rgba(216, 90, 42, 0.25)",
              }}
            >
              <span style={{ fontSize: "1.6rem" }}>✨</span>
            </div>
            <h2
              className="fw-bold mb-1"
              style={{ color: "var(--gandhi-brown)", letterSpacing: "-0.5px" }}
            >
              Create Account
            </h2>
            <p className="small mb-0" style={{ color: "var(--gandhi-text-muted)" }}>
              Join Gandhigiri 2026 Student Voting & Project Portal
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-semibold" style={{ color: "var(--gandhi-brown)" }}>
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                placeholder="Enter your full name"
                className="form-control form-control-lg"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-semibold" style={{ color: "var(--gandhi-brown)" }}>
                College Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                placeholder="student@aitm.edu.in"
                className="form-control form-control-lg"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label small fw-semibold" style={{ color: "var(--gandhi-brown)" }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                placeholder="Minimum 6 characters"
                className="form-control form-control-lg"
                onChange={handleChange}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary-custom w-100 btn-lg fw-bold"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Signup"}
            </button>
          </form>

          <p className="text-center mt-4 mb-0 small" style={{ color: "var(--gandhi-text-muted)" }}>
            Already have an account?{" "}
            <Link
              to="/login"
              className="fw-semibold text-decoration-none"
              style={{ color: "var(--gandhi-terracotta)" }}
            >
              Login
            </Link>
          </p>
        </div>
        <ToastContainer position="bottom-left" />
      </Box>
    </Box>
  );
};

export default Signup;
