import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Typography,
  IconButton,
  Box,
  Stack,
} from "@mui/material";
import { Edit as EditIcon, Add as AddIcon } from "@mui/icons-material";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const role = localStorage.getItem("role"); // 🧠 get role

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/users");
      setUsers(response.data || []);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = () => {
    navigate("/home/register");
  };

  const handleEdit = (user) => {
    navigate("/home/register", { state: { editUser: user } });
  };

  return (
    <Box sx={{ p: 4 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4" fontWeight={600}>
          Users
        </Typography>
        {/* Hide Add button also if role is readonly (Optional) */}
        {role !== "ROLE_READ_ONLY" && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddUser}
          >
            Add User
          </Button>
        )}
      </Stack>

      <Paper elevation={3} sx={{ borderRadius: 2 }}>
        <TableContainer sx={{ borderRadius: 2, maxHeight: 800 }}>
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height={200}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      backgroundColor: "#1976b2",
                      color: "white",
                      fontWeight: "bolder",
                    }}
                  >
                    Username
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "#1976b2",
                      color: "white",
                      fontWeight: "bolder",
                    }}
                  >
                    Email
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "#1976b2",
                      color: "white",
                      fontWeight: "bolder",
                    }}
                  >
                    Role
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "#1976b2",
                      color: "white",
                      fontWeight: "bolder",
                    }}
                  >
                    Last Login
                  </TableCell>

                  {/* Show Actions column only if not readonly */}
                  {role !== "ROLE_READ_ONLY" && (
                    <TableCell
                      sx={{
                        backgroundColor: "#1976b2",
                        color: "white",
                        fontWeight: "bolder",
                      }}
                      align="center"
                    >
                      Actions
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>

              <TableBody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>{user.username || "N/A"}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        {user.lastLogin
                          ? new Date(user.lastLogin).toLocaleString()
                          : "No login yet"}
                      </TableCell>

                      {/* Show edit button only if not readonly */}
                      {role !== "ROLE_READ_ONLY" && (
                        <TableCell align="center">
                          <IconButton
                            onClick={() => handleEdit(user)}
                            color="primary"
                            size="small"
                            sx={{ bgcolor: "#e3f2fd", borderRadius: 1 }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={role !== "ROLE_READ_ONLY" ? 5 : 4} align="center">
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default UserTable;
