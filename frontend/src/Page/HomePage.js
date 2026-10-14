import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const HomePage = () => {
  return (
    <div className="bg-light">
      {/* HERO SECTION */}
      <section
        className="position-relative d-flex align-items-center"
        style={{
          minHeight: "85vh",
          background: "linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-dark) 100%)",
          overflow: "hidden"
        }}
      >
        {/* Abstract Background Shapes */}
        <div
          className="position-absolute top-0 end-0"
          style={{ opacity: 0.08, pointerEvents: "none" }}
        >
          <svg width="600" height="600" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#FFD700" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-4.9C93.5,9.3,82.2,22.9,71.3,35.2C60.4,47.5,49.9,58.5,37.6,66.3C25.3,74.1,11.2,78.7,-2.3,82.7C-15.8,86.7,-30.3,90.1,-43.3,84.7C-56.3,79.3,-67.8,65.1,-76.3,49.8C-84.8,34.5,-90.3,18.1,-88.9,2.4C-87.5,-13.3,-79.2,-28.3,-68.8,-41.2C-58.4,-54.1,-45.9,-64.9,-32.6,-72.6C-19.3,-80.3,-5.2,-84.9,5.6,-94.6L16.4,-104.3" transform="translate(100 100)" />
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
                <div className="d-inline-block px-3 py-1 mb-3 rounded-pill border border-light bg-white bg-opacity-10 backdrop-blur">
                  <span className="text-gold fw-bold small">OFFICIAL AITM PORTAL</span>
                </div>
                <h1 className="display-3 fw-bold mb-4 lh-sm">
                  Excellence in <span className="text-gold">Evaluation</span> & <span className="text-gold">Recognition</span>
                </h1>
                <p className="lead mb-5 opacity-90" style={{ maxWidth: "680px" }}>
                  The centralized platform for managing events, rating projects, and celebrating student achievements at Angadi Institute of Technology and Management.
                </p>
                <div className="d-flex gap-3 flex-wrap">
                  <Link
                    to="/participants"
                    className="btn btn-gold-custom btn-lg shadow-lg"
                  >
                    Start Rating
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-outline-light btn-lg"
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