import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import UserTable from "./UserTable";
import Register from "../components/Register";

export const AdminDashboard = () => {
  // activeComponent controls which view is shown.
  const [activeComponent, setActiveComponent] = useState("dashboard");
  // editUser stores the user data when you’re editing a user.
  const [editUser, setEditUser] = useState(null);

  // This function accepts a component name and optional user data.
  const handleSetActiveComponent = (component, userData) => {
    setActiveComponent(component);
    setEditUser(userData || null);
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case "ok":
        return <>ok</>;
      case "registerUser":
        // pass editUser to Register so that when you are editing a user their details appear in the form.
        return <Register setActiveComponent={handleSetActiveComponent} editUser={editUser} />;
      case "usertable":
        return <UserTable setActiveComponent={handleSetActiveComponent} />;
      default:
        return <UserTable setActiveComponent={handleSetActiveComponent} />;
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar setActiveComponent={handleSetActiveComponent} />
      <div style={{ flex: 1, padding: "5rem 1.5rem", paddingTop: "5rem" }}>
        {renderComponent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
