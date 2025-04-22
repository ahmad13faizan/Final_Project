import React, { useEffect, useState } from "react";
import registerFormConfig from "../config/registerFormConfig";
import styles from "../styles/register.module.scss";
import api from "../api/axios";
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";

import {
  Grid,
  Paper,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const Register = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const editUser = location.state?.editUser || null;


  console.log("Edit User:", editUser);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    password2: "",
    roleId: "",
  });

  const [roles, setRoles] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [hover, setHover] = useState(false);

  const [availableAccounts, setAvailableAccounts] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState([]);

  // Fetch roles on mount
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await api.get("/api/roles");
        setRoles(response.data);
      } catch (err) {
        setError("Failed to load roles: " + err.message);
      }
    };
    fetchRoles();
  }, []);

  // If editing, populate form with user data
  useEffect(() => {
    if (editUser) {
      setFormData({
        email: editUser.email || "",
        username: editUser.username || "",
        password: "",
        password2: "",
        roleId: editUser.role?.id || "",
      });

      if (editUser.accounts && editUser.accounts.length > 0) {
        setSelectedAccounts(editUser.accounts);
      }
    }
  }, [editUser]);


  useEffect(() => {
    if (roles.length > 0 && formData.roleId) {
      const selectedRole = roles.find(
        (role) => role.id === parseInt(formData.roleId)
      );
      if (selectedRole && selectedRole.name === "ROLE_CUSTOMER") {
        const fetchAccounts = async () => {
          try {
            const response = await api.get("/api/accounts");
            const fetchedAccounts = response.data.filter(
              (acc) =>
                !selectedAccounts.some(
                  (selAcc) => selAcc.accountId === acc.accountId
                )
            );
            setAvailableAccounts(fetchedAccounts);
          } catch (err) {
            console.error("Error fetching accounts:", err);
          }
        };
        fetchAccounts();
      } else {
        setAvailableAccounts([]);
        setSelectedAccounts([]);
      }
    }
  }, [formData.roleId, roles]); // Removed selectedAccounts from dependencies

  const handleAvailableSelect = (account) => {
    setAvailableAccounts((prev) =>
      prev.filter((acc) => acc.accountId !== account.accountId)
    );
    setSelectedAccounts((prev) => [...prev, account]);
  };

  const handleSelectedDeselect = (account) => {
    setSelectedAccounts((prev) =>
      prev.filter((acc) => acc.accountId !== account.accountId)
    );
    setAvailableAccounts((prev) => [...prev, account]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Password match check
    if (formData.password !== formData.password2) {
      setError("Passwords do not match");
      setSuccess("");
      return;
    }
  
    // Construct the payload
    const payload = {
      email: formData.email,
      username: formData.username,
      password: formData.password,
      password2: formData.password2,
      roleId: parseInt(formData.roleId),
    };
  
    // If customer, add accountIds
    const selectedRole = roles.find(
      (role) => role.id === parseInt(formData.roleId)
    );
    if (selectedRole?.name === "ROLE_CUSTOMER") {
      payload.accountIds = selectedAccounts.map((acc) => acc.accountId);
    }
  
    try {
      if (editUser) {
        // EDIT user → PUT to /api/users/{id}
        await api.put(`/api/users/${editUser.id}`, payload);
        setSuccess("User updated successfully");
      } else {
        // REGISTER user → POST to /api/register
        await api.post("/api/register", payload);
        setSuccess("Registered successfully");
      }
  
      setError("");
      // Optional: navigate after success
      setTimeout(() => navigate("/admin"), 1000);
    } catch (err) {
      // Display server-side validation or message
      if (err.response && err.response.data) {
        const serverError = err.response.data.message || JSON.stringify(err.response.data);
        setError("Server error: " + serverError);
      } else {
        setError("An unexpected error occurred.");
      }
      setSuccess("");
    }
  };
  
  
  

  const cancelButtonStyle = {
    marginRight: "auto",
    padding: ".3rem",
    backgroundColor: hover ? "#8B0000" : "red",
    color: "white",
    border: "none",
    height: "30px",
    borderRadius: "5px",
    width: "62px",
    fontSize: "0.8rem",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  };

  const handleCancel = () => {
    navigate("/admin"); 
  };

  return (
    <div className={styles.mainFormContainer}>
      <form className={styles.addUserForm} onSubmit={handleSubmit}>
        <button
          type="button"
          style={cancelButtonStyle}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={handleCancel}
        >
          Cancel
        </button>

        
        <h2>{editUser ? "Edit User" : "Add User"}</h2>
          <div className={styles.spacerDiv}></div> {/* Empty div to take up space */}


        {registerFormConfig.map((field) => (
          <div key={field.name} className={styles.formField}>
            {field.type === "select" ? (
              <select
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required={field.required}
              >
                <option value="">-- {field.label} --</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name]}
                onChange={handleChange}
                required={field.required}
              />
            )}
          </div>
        ))}

        {/* Account Selection Panels */}
        {(availableAccounts.length > 0 || selectedAccounts.length > 0) && (
          <div style={{ marginTop: "2rem" }}>
            <h3>Manage Account Associations</h3>
            <Grid container spacing={2}>
              {/* Available Accounts */}
              <Grid item xs={6}>
                <h4>Available Accounts</h4>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">Select</TableCell>
                        <TableCell>Account ID</TableCell>
                        <TableCell>Account Name</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {availableAccounts.map((acc) => (
                        <TableRow key={acc.accountId}>
                          <TableCell align="center">
                            <Checkbox
                              onChange={() => handleAvailableSelect(acc)}
                              checked={false}
                            />
                          </TableCell>
                          <TableCell>{acc.accountId}</TableCell>
                          <TableCell>{acc.accountName}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              {/* Selected Accounts */}
              <Grid item xs={6}>
                <h4>Selected Accounts</h4>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">Deselect</TableCell>
                        <TableCell>Account ID</TableCell>
                        <TableCell>Account Name</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedAccounts.map((acc) => (
                        <TableRow key={acc.accountId}>
                          <TableCell align="center">
                            <Checkbox
                              onChange={() => handleSelectedDeselect(acc)}
                              checked={true}
                            />
                          </TableCell>
                          <TableCell>{acc.accountId}</TableCell>
                          <TableCell>{acc.accountName}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </div>
        )}

        <div className={styles.formField}>
          <button
            type="submit"
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              width: "90px",
              borderRadius: "5px",
            }}
          >
            {editUser ? "Update User" : "Register"}
          </button>
          {error && <div style={{ color: "red" }}>{error}</div>}
          {success && <div style={{ color: "green" }}>{success}</div>}
        </div>
      </form>
    </div>
  );
};

export default Register;
