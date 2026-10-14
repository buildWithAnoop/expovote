import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer-custom mt-auto">
      <div className="container">
        <div className="row g-4">
          {/* Brand Section */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-3 mb-3">
              <img 
                src="axislogo-removebg-preview.png" 
                alt="AITM Logo"
                style={{
                  width: "44px",
                  height: "44px",
                  background: "var(--gandhi-ivory)",
                  borderRadius: "50%",
                  padding: "3px",
                  border: "2px solid var(--gandhi-gold)",
                }}
              />
              <div>
                <h5 className="fw-bold mb-0 text-white" style={{ letterSpacing: "0.5px" }}>
                  AITM Voting System
                </h5>
                <span className="text-gold" style={{ fontSize: "0.78rem", fontWeight: "600" }}>
                  Gandhigiri 2026 Annual Exhibition
                </span>
              </div>
            </div>
            <p className="small" style={{ color: "rgba(255, 253, 249, 0.75)", lineHeight: 1.6 }}>
              The official platform for rating and reviewing projects, events, and participants at Axis Institute of Technology and Management. Fostering excellence through transparent evaluation.
            </p>
            <div className="d-flex gap-2 mt-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-white social-icon-hover"><FaFacebookF /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-white social-icon-hover"><FaTwitter /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white social-icon-hover"><FaInstagram /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-white social-icon-hover"><FaLinkedinIn /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold text-gold mb-3 text-uppercase" style={{ letterSpacing: "1px", fontSize: "0.85rem" }}>
              Quick Links
            </h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link className="text-decoration-none hover-white" style={{ color: "rgba(255, 253, 249, 0.75)" }} to="/">Home</Link></li>
              <li className="mb-2"><Link className="text-decoration-none hover-white" style={{ color: "rgba(255, 253, 249, 0.75)" }} to="/participants">Participants</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold text-gold mb-3 text-uppercase" style={{ letterSpacing: "1px", fontSize: "0.85rem" }}>
              Resources
            </h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link className="text-decoration-none hover-white" style={{ color: "rgba(255, 253, 249, 0.75)" }} to="/login">Admin Login</Link></li>
              <li className="mb-2"><Link className="text-decoration-none hover-white" style={{ color: "rgba(255, 253, 249, 0.75)" }} to="/register">Student Registration</Link></li>
              <li className="mb-2"><span style={{ color: "rgba(255, 253, 249, 0.55)" }}>Privacy Policy</span></li>
              <li className="mb-2"><span style={{ color: "rgba(255, 253, 249, 0.55)" }}>Terms of Service</span></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-lg-4 col-md-6">
            <h6 className="fw-bold text-gold mb-3 text-uppercase" style={{ letterSpacing: "1px", fontSize: "0.85rem" }}>
              Contact Us
            </h6>
            <ul className="list-unstyled" style={{ color: "rgba(255, 253, 249, 0.75)" }}>
              <li className="mb-3 d-flex gap-2 align-items-start">
                <FaMapMarkerAlt className="mt-1 text-gold flex-shrink-0" />
                <span>Axis Institute of Technology and Management<br />Rooma, Kanpur, Uttar Pradesh 208007</span>
              </li>
              <li className="mb-3 d-flex gap-2 align-items-center">
                <FaPhoneAlt className="text-gold flex-shrink-0" />
                <a href="tel:18003132464" className="text-decoration-none hover-white" style={{ color: "rgba(255, 253, 249, 0.75)" }}>1800 313 2464</a>
              </li>
              <li className="mb-3 d-flex gap-2 align-items-center">
                <FaEnvelope className="text-gold flex-shrink-0" />
                <a href="mailto:info@axiscolleges.in" className="text-decoration-none hover-white" style={{ color: "rgba(255, 253, 249, 0.75)" }}>info@axiscolleges.in</a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-4" style={{ borderColor: "rgba(255, 253, 249, 0.15)" }} />

        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-0 small" style={{ color: "rgba(255, 253, 249, 0.6)" }}>
              &copy; {new Date().getFullYear()} AITM Voting System. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <p className="mb-0 small" style={{ color: "rgba(255, 253, 249, 0.6)" }}>
              Gandhigiri 2026 &bull; Designed & Developed by RPWS Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
