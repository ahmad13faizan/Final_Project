import React, { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/UserDashboard.scss";
import { Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
    navigate("/admin/register");
  };

  const handleEdit = (user) => {
    navigate("/admin/register", { state: { editUser: user } });
  };

  return (
    <div className="user-dashboard-container">
      <div className="dashboard-header">
        <h2>Users</h2>
        <div className="actions">
          <button onClick={handleAddUser} className="btn-add-user">
            + Add User
          </button>
        </div>
      </div>

      <div className="table-container">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>User ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.id}</td>
                    <td>{user.username || "N/A"}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "No login yet"}</td>
                    <td className="cursor-pointer">
                      <button onClick={() => handleEdit(user)}>
                      <Pencil color="#000" size={18} style={{ padding: '4px', borderRadius: '4px' }} />

                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserTable;
