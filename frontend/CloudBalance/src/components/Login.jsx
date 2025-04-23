/* eslint-disable no-debugger */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import styles from "../styles/login.module.scss";
import logo from "../assets/images/CloudBalance_logo.png";
import ThemeToggleButton from "../components/ThemeToggle";

const Login = () => {

  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/api/login", {
        email,
        password,
      });

      const data = response.data;
      debugger;

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      setMessage("Login Success: " + data.role);
      localStorage.setItem("email", email);

      if (data.role === "ROLE_ADMIN") {
        navigate("/admin");
      } else if (data.role === "ROLE_CUSTOMER") {
        navigate("/customer");
      } else if (data.role === "ROLE_READ_ONLY") {
        navigate("/readonly");
      } else {
        navigate("/login");
      }
    } catch (error) {
      setemail("");
      setPassword("");
      setMessage(
        "Login Failed: " +
          (error.response?.data?.error || "Invalid credentials")
      );
    }
  };

  return (
    <div className={styles.loginContainer}>
      <ThemeToggleButton style={styles.toggle} />
      
      <img src={logo} alt="logo" />
      <form className={styles.loginForm} onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setemail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className={styles.button} type="submit">
          Login
        </button>
        <p>{message}</p>
      </form>
    </div>
  );
};

export default Login;
