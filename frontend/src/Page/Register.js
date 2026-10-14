import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Box,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Tooltip,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import HomeIcon from "@mui/icons-material/Home";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import API_URL from "../api";

const sidebarCollapsedWidth = 56;
const sidebarExpandedWidth = 160;

const Register = () => {
  const [formData, setFormData] = useState({
    teamNo: "",
    name: "",
    projectName: "",
    department: "",
    email: "",
    description: "",
    image: null,
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("teamNo", formData.teamNo);
      data.append("name", formData.name);
      data.append("projectName", formData.projectName);
      data.append("department", formData.department);
      data.append("email", formData.email);
      data.append("description", formData.description);

      if (formData.image) {
        data.append("image", formData.image);
      } else {
        data.append("image", "https://example.com/default.jpg");
      }

      const token = localStorage.getItem("token");
      const headers = { "Content-Type": "multipart/form-data" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await axios.post(`${API_URL}/addParticipants`, data, { headers });

      console.log("✅ Participant added:", res.data);
      alert("🎉 Registration Successful!");
      setFormData({
        teamNo: "",
        name: "",
        projectName: "",
        department: "",
        email: "",
        description: "",
        image: null,
      });
    } catch (error) {
      console.error("❌ Error registering participant:", error);
      alert(error.response?.data?.error || "Something went wrong! Check console for details.");
    }
  };

  const token = localStorage.getItem("token");
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
      {/* Collapsible Sidebar */}
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
            <Tooltip key={item.text} title={!sidebarOpen ? item.text : ""} placement="right">
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
          py: 6,
          ml: `${sidebarCollapsedWidth}px`,
          width: `calc(100% - ${sidebarCollapsedWidth}px)`,
        }}
      >
        <Box textAlign="center" mb={4}>
          <div
            className="d-inline-flex align-items-center gap-2 px-3 py-1 mb-2 rounded-pill"
            style={{
              backgroundColor: "var(--gandhi-terracotta-light)",
              border: "1px solid rgba(216, 90, 42, 0.25)",
            }}
          >
            <span style={{ fontSize: "0.85rem", fontWeight: "bold", color: "var(--gandhi-terracotta)" }}>
              Gandhigiri 2026 Project Showcase
            </span>
          </div>
          <Typography
            variant="h4"
            align="center"
            fontWeight="bold"
            sx={{ color: "var(--gandhi-brown)", letterSpacing: "-0.5px" }}
          >
            📝 Register for the Event
          </Typography>
          <Typography variant="body2" sx={{ color: "var(--gandhi-text-muted)", mt: 1 }}>
            Submit your student project details for institutional rating & exhibition
          </Typography>
        </Box>

        <Paper
          elevation={4}
          sx={{
            p: { xs: 3, sm: 5 },
            maxWidth: 680,
            mx: "auto",
            borderRadius: "16px",
            bgcolor: "var(--gandhi-ivory)",
            border: "1px solid var(--gandhi-border)",
            boxShadow: "0 10px 30px rgba(56, 34, 19, 0.08)",
          }}
        >
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <Grid container spacing={3}>
              {/* Team Number */}
              <Grid item xs={12} sm={6}>
                <TextField
                  name="teamNo"
                  label="Team Number"
                  variant="outlined"
                  fullWidth
                  required
                  value={formData.teamNo}
                  onChange={handleChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      bgcolor: "#ffffff",
                      "&.Mui-focused fieldset": { borderColor: "var(--gandhi-terracotta)" },
                    },
                    "& label.Mui-focused": { color: "var(--gandhi-terracotta)" },
                  }}
                />
              </Grid>

              {/* Team Name */}
              <Grid item xs={12} sm={6}>
                <TextField
                  name="name"
                  label="Team Name"
                  variant="outlined"
                  fullWidth
                  required
                  value={formData.name}
                  onChange={handleChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      bgcolor: "#ffffff",
                      "&.Mui-focused fieldset": { borderColor: "var(--gandhi-terracotta)" },
                    },
                    "& label.Mui-focused": { color: "var(--gandhi-terracotta)" },
                  }}
                />
              </Grid>

              {/* Project Name */}
              <Grid item xs={12} sm={6}>
                <TextField
                  name="projectName"
                  label="Project Name"
                  variant="outlined"
                  fullWidth
                  required
                  value={formData.projectName}
                  onChange={handleChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      bgcolor: "#ffffff",
                      "&.Mui-focused fieldset": { borderColor: "var(--gandhi-terracotta)" },
                    },
                    "& label.Mui-focused": { color: "var(--gandhi-terracotta)" },
                  }}
                />
              </Grid>

              {/* Department */}
              <Grid item xs={12} sm={6}>
                <TextField
                  name="department"
                  label="Department"
                  variant="outlined"
                  fullWidth
                  required
                  value={formData.department}
                  onChange={handleChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      bgcolor: "#ffffff",
                      "&.Mui-focused fieldset": { borderColor: "var(--gandhi-terracotta)" },
                    },
                    "& label.Mui-focused": { color: "var(--gandhi-terracotta)" },
                  }}
                />
              </Grid>

              {/* Email Address */}
              <Grid item xs={12}>
                <TextField
                  name="email"
                  label="Email Address"
                  type="email"
                  variant="outlined"
                  fullWidth
                  required
                  value={formData.email}
                  onChange={handleChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      bgcolor: "#ffffff",
                      "&.Mui-focused fieldset": { borderColor: "var(--gandhi-terracotta)" },
                    },
                    "& label.Mui-focused": { color: "var(--gandhi-terracotta)" },
                  }}
                />
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Project Description / Participation Details"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  required
                  value={formData.description}
                  onChange={handleChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      bgcolor: "#ffffff",
                      "&.Mui-focused fieldset": { borderColor: "var(--gandhi-terracotta)" },
                    },
                    "& label.Mui-focused": { color: "var(--gandhi-terracotta)" },
                  }}
                />
              </Grid>

              {/* Image Upload */}
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<UploadFileIcon />}
                  fullWidth
                  sx={{
                    py: 1.5,
                    borderRadius: "10px",
                    borderColor: "var(--gandhi-border)",
                    color: "var(--gandhi-brown)",
                    bgcolor: "var(--gandhi-cream)",
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": {
                      borderColor: "var(--gandhi-terracotta)",
                      bgcolor: "var(--gandhi-terracotta-light)",
                      color: "var(--gandhi-terracotta)",
                    },
                  }}
                >
                  Project Image (Optional)
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    name="image"
                    onChange={handleChange}
                  />
                </Button>
                {formData.image && (
                  <Box mt={2} display="flex" justifyContent="center">
                    <Avatar
                      src={URL.createObjectURL(formData.image)}
                      alt="preview"
                      sx={{
                        width: 100,
                        height: 100,
                        border: "2px solid var(--gandhi-terracotta)",
                        boxShadow: "0 4px 12px rgba(216, 90, 42, 0.2)",
                      }}
                    />
                  </Box>
                )}
              </Grid>

              {/* Submit */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    py: 1.5,
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, var(--gandhi-terracotta) 0%, var(--gandhi-saffron) 100%)",
                    color: "#ffffff",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    boxShadow: "0 4px 16px rgba(216, 90, 42, 0.3)",
                    textTransform: "none",
                    "&:hover": {
                      background: "linear-gradient(135deg, var(--gandhi-terracotta-hover) 0%, var(--gandhi-terracotta) 100%)",
                    },
                  }}
                >
                  Register
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
