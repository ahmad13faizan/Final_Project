import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/Navbar.module.scss";
import ThemeToggleButton from "./ThemeToggle";
import api from "../api/axios"; // 👈 Make sure path is correct
import { useState } from "react";
import logo from "../assets/images/CloudBalance_logo2.png";
import logoutBtn from "../assets/images/logout-icon.png";

const Navbar = () => {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const [hover, setHover] = useState(false);

  const buttonStyle = {
    backgroundColor: hover ? "red" : "",
    color: hover ? "white" : "blue",
    padding: "0px 12px 0px 0px",
    borderRadius: "7px",
    display: "flex",
    cursor: "pointer",
    border: "solid 1px ",
  };

  const handleLogout = async () => {
    try {
      await api.post("/api/logout"); // 👈 Uses token from interceptor

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
        <img src={logo} alt="" />
      </div>

      <ThemeToggleButton />
      <div className={styles["navbar-links"]}>
        {role === "ROLE_ADMIN" && <Link to="/admin">Admin</Link>}
        {role === "ROLE_CUSTOMER" && <Link to="/customer">Customer</Link>}
        {role === "ROLE_READ_ONLY" && <Link to="/readonly">Read-Only</Link>}

        <div
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={handleLogout}
          style={buttonStyle}
        >
          <img src={logoutBtn} />

          <div style={{ marginTop: "4px" }}> Logout</div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
