import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { jwtDecode } from "jwt-decode";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Navbar = () => {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  let userRole = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userRole = decoded.role;
    } catch (e) {
      userRole = null;
    }
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-custom sticky-top">
      <div className="container">
        {/* Brand Section */}
        <Link
          className="navbar-brand d-flex align-items-center gap-3"
          to="/"
          style={{ textDecoration: "none" }}
        >
          <div className="position-relative">
            <img
              src="axislogo-removebg-preview.png"
              alt="AITM Logo"
              className="aitm-logo"
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                objectFit: "contain",
                background: "var(--gandhi-ivory)",
                padding: "3px",
                border: "2px solid var(--gandhi-gold)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
            />
          </div>
          <div className="d-flex flex-column">
            <span
              className="fw-bold fs-5 text-white"
              style={{ letterSpacing: "1.2px", lineHeight: 1.15 }}
            >
              AITM
            </span>
            <span
              className="text-gold"
              style={{ fontSize: "0.78rem", fontWeight: "600", letterSpacing: "0.5px" }}
            >
              Gandhigiri 2026
            </span>
          </div>
        </Link>

        {/* Toggle Button */}
        <button
          className="navbar-toggler border-0 text-white"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{
            backgroundColor: "rgba(255, 253, 249, 0.1)",
            padding: "8px 12px",
            borderRadius: "8px",
          }}
        >
          <span className="navbar-toggler-icon" style={{ filter: "invert(1)" }}></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-2 gap-lg-3 mt-3 mt-lg-0">
            {/* Navigation Links */}
            <li className="nav-item">
              <Link className="nav-link px-2" to="/">
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link px-2" to="/participants">
                Participants
              </Link>
            </li>

            {token && userRole === "admin" && (
              <li className="nav-item">
                <Link className="nav-link px-2" to="/winners">
                  Winners
                </Link>
              </li>
            )}

            {/* Unauthenticated: Login & Sign Up buttons */}
            {!token && (
              <>
                <li className="nav-item">
                  <Link
                    className="btn btn-sm px-3 fw-semibold"
                    to="/login"
                    style={{
                      color: "var(--gandhi-text-light)",
                      border: "1.5px solid rgba(255, 253, 249, 0.3)",
                      borderRadius: "6px",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--gandhi-saffron)";
                      e.currentTarget.style.color = "var(--gandhi-saffron)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255, 253, 249, 0.3)";
                      e.currentTarget.style.color = "var(--gandhi-text-light)";
                    }}
                  >
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-gold-custom btn-sm px-3" to="/signup">
                    Sign Up
                  </Link>
                </li>
              </>
            )}

            {/* Authenticated Admin Dropdown */}
            {token && userRole === "admin" && (
              <li className="nav-item dropdown" ref={dropdownRef}>
                <button
                  type="button"
                  aria-label="Admin Menu"
                  className="btn btn-gold-custom btn-sm rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                  style={{
                    width: "36px",
                    height: "36px",
                    fontWeight: "bold",
                    fontSize: "0.95rem",
                  }}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  A
                </button>

                {dropdownOpen && (
                  <ul
                    className="dropdown-menu dropdown-menu-end show mt-2 shadow border-0"
                    style={{
                      borderRadius: "10px",
                      position: "absolute",
                      right: 0,
                      minWidth: "160px",
                      backgroundColor: "var(--gandhi-ivory)",
                      border: "1px solid var(--gandhi-border)",
                      padding: "8px 0",
                    }}
                  >
                    <li>
                      <button
                        type="button"
                        className="dropdown-item py-2 px-3 fw-semibold"
                        style={{ color: "var(--gandhi-brown)" }}
                        onClick={() => {
                          navigate("/admin");
                          setDropdownOpen(false);
                        }}
                      >
                        Admin Panel
                      </button>
                    </li>
                    <li>
                      <hr className="dropdown-divider my-1" style={{ borderColor: "var(--gandhi-border)" }} />
                    </li>
                    <li>
                      <button
                        type="button"
                        className="dropdown-item py-2 px-3 text-danger fw-semibold"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                )}
              </li>
            )}

            {/* Authenticated Student / Non-Admin Logout */}
            {token && userRole !== "admin" && (
              <li className="nav-item">
                <button
                  type="button"
                  className="btn btn-sm px-3"
                  style={{
                    color: "var(--gandhi-text-light)",
                    border: "1.5px solid rgba(255, 253, 249, 0.3)",
                    borderRadius: "6px",
                    fontWeight: "500",
                  }}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
