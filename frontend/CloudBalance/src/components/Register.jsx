import React, { useEffect, useState } from "react";
import registerFormConfig from "../config/registerFormConfig";
import styles from "../styles/register.module.scss";
import api from "../api/axios";


// Material UI imports
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

const Register = ({ setActiveComponent, editUser }) => {
  // Initialize formData, and prefill if editUser exists.
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

  // For accounts handling
  const [availableAccounts, setAvailableAccounts] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState([]);

  // Fetch roles on mount.
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

  // If editing, prefill the form with the user's data.
  useEffect(() => {
    if (editUser) {
      setFormData({
        email: editUser.email,
        username: editUser.username,
        password: "",   // Do not prefill passwords
        password2: "",
        roleId: editUser.role?.id || "",
      });
      if (editUser.accounts && editUser.accounts.length > 0) {
        setSelectedAccounts(editUser.accounts);
      }
    }
  }, [editUser]);

  // Fetch accounts if selected role is ROLE_CUSTOMER and remove already selected ones.
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
  }, [formData.roleId, roles, selectedAccounts]);

  // Handlers for moving accounts between lists.
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
    if (formData.password !== formData.password2) {
      setError("Passwords do not match");
      setSuccess("");
      return;
    }
    try {
      const { email, username, password, password2, roleId } = formData;
      const accountIds = selectedAccounts.map((acc) => acc.accountId);
      const payload = {
        email,
        username,
        password,
        password2,
        roleId: parseInt(roleId),
        accountIds,
      };

      let res;
      if (editUser) {
        // Update user endpoint (e.g., PUT /api/users/:id)
        res = await api.put(`/api/users/${editUser.id}`, payload);
      } else {
        res = await api.post("/api/register", payload);
      }

      setSuccess(
        res.data?.message ||
          (editUser ? "User updated successfully" : "Registered successfully")
      );
      setError("");
      // Clear form
      setFormData({
        email: "",
        username: "",
        password: "",
        password2: "",
        roleId: "",
      });
      setSelectedAccounts([]);
      setAvailableAccounts([]);
    } catch (err) {
      setError(
        err.response?.data ||
          (editUser ? "User update failed" : "Registration failed")
      );
      setSuccess("");
    }
  };

  const cancelButtonStyle = {
    marginRight: "auto",
    padding: ".3rem",
    backgroundColor: hover ? "#8B0000" : "red",
    color: "white",
    border: "none",
    borderRadius: "5px",
    width: "62px",
    fontSize: "0.8rem",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  };

  return (
    <div className={styles.mainFormContainer}>
      <form className={styles.addUserForm} onSubmit={handleSubmit}>
        <button
          type="button"
          style={cancelButtonStyle}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={() => setActiveComponent("usertable")}
        >
          Cancel
        </button>

        <h2 style={{ flexBasis: "100%" }}>
          {editUser ? "Edit User" : "Add User"}
        </h2>

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

        {/* Account Selection Panels: They appear below the form fields */}
        {(availableAccounts.length > 0 || selectedAccounts.length > 0) && (
          <div style={{ marginTop: "2rem" }}>
            <h3>Manage Account Associations</h3>
            <Grid container spacing={2}>
              {/* Available Accounts Panel */}
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
              {/* Selected Accounts Panel */}
              <Grid item xs={6}>
                <h4>Associated Accounts</h4>
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

        <br />

        {error && typeof error === "object" ? (
          <div style={{ color: "red" }}>
            {Object.values(error).map((msg, idx) => (
              <p key={idx}>{msg}</p>
            ))}
          </div>
        ) : (
          <p style={{ color: "red" }}>{error}</p>
        )}

        {success && <p style={{ color: "green" }}>{success}</p>}

        <button type="submit" className={styles.ButtonStyle}>
          {editUser ? "Update User" : "Add User"}
        </button>
      </form>
    </div>
  );
};

export default Register;
