import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/Navbar.module.scss";
import ThemeToggleButton from "./ThemeToggle";
import api from "../api/axios";
import { FaUser, FaSignOutAlt } from "react-icons/fa"; // Import icons
import logo from "../assets/images/CloudBalance_logo2.png";

const Navbar = () => {
  const role = localStorage.getItem("role");
  const email = localStorage.getItem("email");
  const navigate = useNavigate();

  const [hover, setHover] = useState(false);

  const buttonStyle = {
  
    padding: "8px 16px",
    borderRadius: "6px",
    border: " solid 1px",
    display: "flex",
    cursor: "pointer",
    alignItems: "center",
    transition: "all 0.3s ease",
  
    // Add hover styles
    boxShadow: hover
      ? "0 0px 8px rgba(0, 0, 0, 0.4), inset 0 0 20px rgba(0, 0, 0, 0.1)"
      : "none",
    filter: hover ? "brightness(0.98) contrast(1.05)" : "none",
  };
  
  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (!confirmed) return;
  
    try {
      await api.post("/api/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };
  

  return (
    <nav className={styles.navbar}>
      <div className={styles["navbar-logo"]}>
        <img src={logo} alt="Logo" />
      </div>

      <ThemeToggleButton />
      <div className={styles["navbar-links"]}>
        {/* Profile Icon */}
        <FaUser
          size={24}
          style={{
            borderRadius: "50%",
            border: "2px solid grey",
            marginRight: "12px",
            padding: "4px",
            color: "var(blue)",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column" }}>
          {role === "ROLE_ADMIN" && <Link to="/admin"><b> Admin</b></Link>}
          {role === "ROLE_CUSTOMER" && <Link to="/customer"><b>Customer</b></Link>}
          {role === "ROLE_READ_ONLY" && <Link to="/readonly"><b>Read-Only</b></Link>}

          <span style={{ marginRight: "18px", fontWeight: "500" }}>{email}</span>
        </div>

        {/* Logout Button with FaSignOutAlt Icon */}
        <div
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={handleLogout}
          style={buttonStyle}
        >
          <FaSignOutAlt size={12} style={{ marginRight: "8px" }} /> {/* Logout icon */}
          <div style={{  fontSize: "16px" }}>Logout</div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
