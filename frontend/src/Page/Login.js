import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { AuthContext } from "../components/AuthContext";
import "react-toastify/dist/ReactToastify.css";
import API_URL from "../api";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/login`, formData);
      login(data.token);
      toast.success("Login successful!");
      const role = data.user?.role;
      setTimeout(() => {
        if (role === "admin") {
          navigate("/admin");
        } else {
          navigate("/participants");
        }
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.error || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-page d-flex align-items-center justify-content-center py-5"
      style={{
        minHeight: "85vh",
        backgroundColor: "var(--gandhi-cream)",
      }}
    >
      <div
        className="card shadow-lg p-4 p-md-5"
        style={{
          width: "100%",
          maxWidth: "440px",
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
            <span style={{ fontSize: "1.6rem" }}>🏛️</span>
          </div>
          <h2
            className="fw-bold mb-1"
            style={{ color: "var(--gandhi-brown)", letterSpacing: "-0.5px" }}
          >
            Welcome Back
          </h2>
          <p className="small mb-0" style={{ color: "var(--gandhi-text-muted)" }}>
            Sign in to Gandhigiri 2026 Portal
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold" style={{ color: "var(--gandhi-brown)" }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="name@aitm.edu.in"
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
              placeholder="Enter your password"
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
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-4 pt-2 border-top" style={{ borderColor: "var(--gandhi-border)" }}>
          <p className="small mb-1" style={{ color: "var(--gandhi-text-muted)" }}>
            Don't have an account? connect with admin to be a member
          </p>
          <Link
            to="/signup"
            className="small fw-semibold text-decoration-none"
            style={{ color: "var(--gandhi-terracotta)" }}
          >
            Or create a student account
          </Link>
        </div>
      </div>
      <ToastContainer position="bottom-left" />
    </div>
  );
};

export default Login;
