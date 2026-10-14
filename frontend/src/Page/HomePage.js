import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const HomePage = () => {
  return (
    <div style={{ backgroundColor: "var(--gandhi-cream)", minHeight: "85vh" }}>
      {/* HERO SECTION */}
      <section
        className="position-relative d-flex align-items-center"
        style={{
          minHeight: "85vh",
          background: "linear-gradient(135deg, #2D1A0E 0%, #3D2415 50%, #231409 100%)",
          overflow: "hidden",
          borderBottom: "3px solid var(--gandhi-terracotta)",
        }}
      >
        {/* Subtle Decorative Mandala / Wheel SVG Background */}
        <div
          className="position-absolute top-0 end-0"
          style={{ opacity: 0.1, pointerEvents: "none" }}
        >
          <svg
            width="650"
            height="650"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Elegant 24-spoke inspired ornamental pattern */}
            <circle cx="100" cy="100" r="90" fill="none" stroke="#D85A2A" strokeWidth="2" strokeDasharray="4 4" />
            <circle cx="100" cy="100" r="75" fill="none" stroke="#C69214" strokeWidth="1.5" />
            <circle cx="100" cy="100" r="50" fill="none" stroke="#E26A20" strokeWidth="2" />
            <circle cx="100" cy="100" r="16" fill="#C69214" />
            {Array.from({ length: 24 }).map((_, i) => (
              <line
                key={i}
                x1="100"
                y1="100"
                x2={100 + 72 * Math.cos((i * 15 * Math.PI) / 180)}
                y2={100 + 72 * Math.sin((i * 15 * Math.PI) / 180)}
                stroke="#D85A2A"
                strokeWidth="1.5"
              />
            ))}
          </svg>
        </div>

        <div className="container position-relative z-1 py-5">
          <div className="row align-items-center">
            <div className="col-lg-9 col-xl-8 text-white">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* Official Institutional Badge */}
                <div
                  className="d-inline-flex align-items-center gap-2 px-3 py-1 mb-3 rounded-pill"
                  style={{
                    backgroundColor: "rgba(216, 90, 42, 0.18)",
                    border: "1px solid rgba(216, 90, 42, 0.4)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <span
                    className="fw-bold small"
                    style={{ color: "var(--gandhi-gold)", letterSpacing: "1px" }}
                  >
                    OFFICIAL AITM PORTAL
                  </span>
                  <span style={{ color: "rgba(255, 253, 249, 0.4)" }}>&bull;</span>
                  <span
                    className="small fw-semibold"
                    style={{ color: "var(--gandhi-saffron)" }}
                  >
                    Gandhigiri 2026
                  </span>
                </div>

                <h1
                  className="display-3 fw-bold mb-3 lh-sm"
                  style={{ color: "var(--gandhi-ivory)", letterSpacing: "-0.02em" }}
                >
                  Excellence in <span style={{ color: "var(--gandhi-saffron)" }}>Evaluation</span> &{" "}
                  <span style={{ color: "var(--gandhi-gold)" }}>Recognition</span>
                </h1>

                <p
                  className="lead mb-4"
                  style={{
                    maxWidth: "680px",
                    color: "rgba(255, 253, 249, 0.85)",
                    lineHeight: 1.65,
                    fontSize: "1.2rem",
                  }}
                >
                  The centralized platform for managing events, rating projects, and celebrating student achievements at Angadi Institute of Technology and Management.
                </p>

                {/* Subtitle / Theme Motto */}
                <div
                  className="p-3 mb-4 rounded-3"
                  style={{
                    backgroundColor: "rgba(255, 253, 249, 0.05)",
                    borderLeft: "4px solid var(--gandhi-terracotta)",
                    maxWidth: "640px",
                  }}
                >
                  <p className="mb-0 small fst-italic" style={{ color: "rgba(255, 253, 249, 0.9)" }}>
                    &ldquo;Live as if you were to die tomorrow. Learn as if you were to live forever.&rdquo; &mdash; Celebrating Innovation & Purpose at Gandhigiri 2026.
                  </p>
                </div>

                {/* Action CTA Buttons */}
                <div className="d-flex gap-3 flex-wrap align-items-center">
                  <Link
                    to="/participants"
                    className="btn btn-primary-custom btn-lg shadow-lg"
                    style={{ minWidth: "160px" }}
                  >
                    Start Rating
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-outline-light btn-lg"
                    style={{
                      minWidth: "180px",
                      borderRadius: "8px",
                      borderColor: "rgba(255, 253, 249, 0.4)",
                      fontWeight: "600",
                    }}
                  >
                    Student Registration
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;