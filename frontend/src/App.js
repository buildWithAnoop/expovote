// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./Page/HomePage";
import Participants from "./Page/ParticipantsPage";
import Winner from "./Page/WinnerPage";
import Register from "./Page/Register";
import Signup from "./Page/Signup";
import Login from "./Page/Login";
import { AuthProvider } from "./components/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import AdminPanel from "./Page/AdminPanel";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div style={{ minHeight: "80vh" }}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/contact" element={<Navigate to="/" replace />} />
            <Route path="/about" element={<Navigate to="/" replace />} />
            <Route path="/participants" element={<Participants />} />
            <Route
              path="/winners"
              element={
                <PrivateRoute adminOnly={true}>
                  <Winner />
                </PrivateRoute>
              }
            />
            <Route path="/winner" element={<Navigate to="/winners" replace />} />
            <Route
              path="/register"
              element={
                <PrivateRoute>
                  <Register />
                </PrivateRoute>
              }
            />

            {/* Admin only */}
            <Route
              path="/admin"
              element={
                <PrivateRoute adminOnly={true}>
                  <AdminPanel />
                </PrivateRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </AuthProvider>
  );
};

export default App;
