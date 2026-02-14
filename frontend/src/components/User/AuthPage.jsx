/* eslint-disable no-unused-vars */
import React from "react";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import "./AuthPage.css"; // Import the CSS file for styling
import { Link, useNavigate } from "react-router-dom";

const AuthPage = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Welcome to SAC Snack Vault</h1>
        <div className="auth-buttons">
          <Link to="/login">
            <button className="auth-button login-button">
              <FaUser className="auth-icon" />
              Login
            </button>
          </Link>
          <Link to="/signup">
          <button className="auth-button signup-button">
            <FaEnvelope className="auth-icon" />
            Sign Up
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
