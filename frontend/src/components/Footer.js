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
            <div className="d-flex align-items-center gap-2 mb-3">
              <img 
                src="axislogo-removebg-preview.png" 
                alt="AITM Logo" 
                style={{ width: "40px", height: "40px", background: "white", borderRadius: "50%", padding: "2px" }} 
              />
              <h5 className="fw-bold mb-0 text-white">AITM Voting System</h5>
            </div>
            <p className="text-white-50 small">
              The official platform for rating and reviewing projects, events, and participants at Axis Institute of Technology and Management. Fostering excellence through transparent evaluation.
            </p>
            <div className="d-flex gap-3 mt-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-white social-icon-hover"><FaFacebookF /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-white social-icon-hover"><FaTwitter /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white social-icon-hover"><FaInstagram /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-white social-icon-hover"><FaLinkedinIn /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold text-gold mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link className="text-white-50 text-decoration-none hover-white" to="/">Home</Link></li>
              <li className="mb-2"><Link className="text-white-50 text-decoration-none hover-white" to="/participants">Participants</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold text-gold mb-3">Resources</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link className="text-white-50 text-decoration-none hover-white" to="/login">Admin Login</Link></li>
              <li className="mb-2"><Link className="text-white-50 text-decoration-none hover-white" to="/register">Student Registration</Link></li>
              <li className="mb-2"><span className="text-white-50">Privacy Policy</span></li>
              <li className="mb-2"><span className="text-white-50">Terms of Service</span></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-lg-4 col-md-6">
            <h6 className="fw-bold text-gold mb-3">Contact Us</h6>
            <ul className="list-unstyled text-white-50">
              <li className="mb-3 d-flex gap-2">
                <FaMapMarkerAlt className="mt-1 text-gold flex-shrink-0" />
                <span>Axis Institute of Technology and Management<br />Rooma, Kanpur, Uttar Pradesh 208007</span>
              </li>
              <li className="mb-3 d-flex gap-2">
                <FaPhoneAlt className="mt-1 text-gold flex-shrink-0" />
                <a href="tel:18003132464" className="text-white-50 text-decoration-none hover-white">1800 313 2464</a>
              </li>
              <li className="mb-3 d-flex gap-2">
                <FaEnvelope className="mt-1 text-gold flex-shrink-0" />
                <a href="mailto:info@axiscolleges.in" className="text-white-50 text-decoration-none hover-white">info@axiscolleges.in</a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-secondary my-4" />

        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-0 text-white-50 small">&copy; {new Date().getFullYear()} AITM Voting System. All rights reserved.</p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <p className="mb-0 text-white-50 small">Designed & Developed by RPWS Team</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
