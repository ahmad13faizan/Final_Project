// pages/MainDashboard.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const MainDashboard = () => {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      
      <div style={{ flex: 1, overflow: "auto", height: "calc(100vh - 20px)" }}>
        <Outlet />
 
      </div>
    </div>
  );
};

export default MainDashboard;
