import { useNavigate,  useLocation } from "react-router-dom";
import styles from "../styles/sidebar.module.scss";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CloudIcon from "@mui/icons-material/Cloud";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";


const Sidebar = () => {
  const location = useLocation();

  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  let basePath = "/login"; // default fallback
  if (role === "ROLE_ADMIN") basePath = "/home";
  else if (role === "ROLE_CUSTOMER") basePath = "/customer";
  else if (role === "ROLE_READ_ONLY") basePath = "/readonly";

  // Define all menu items
  let allMenuItems = [
    { label: "User Management", icon: <DashboardIcon />, path: basePath },
    { label: "Onboarding", icon: <PersonAddIcon />, path: `${basePath}/onboarding` },
    { label: "AWS Services", icon: <CloudIcon />, path: `${basePath}/aws` },
    { label: "Cost Explorer", icon: <AttachMoneyIcon />, path: `${basePath}/cost` },
  ];

  // Special: If role is customer, change "User Management" label to "Customer Dashboard"
  if (role === "ROLE_CUSTOMER") {
    allMenuItems = allMenuItems.map(item => 
      item.label === "User Management"
        ? { ...item, label: "Customer Dashboard" }
        : item
    );
  }

  // Filter menu based on role
  let menuItems = [];
  if (role === "ROLE_ADMIN") {
    menuItems = allMenuItems; // admin sees everything
  } else if (role === "ROLE_CUSTOMER") {
    menuItems = allMenuItems.filter(item => 
      item.label === "Customer Dashboard" || item.label === "AWS Services" || item.label === "Cost Explorer"
    );
  } else if (role === "ROLE_READ_ONLY") {
    menuItems = allMenuItems.filter(item => item.label !== "Onboarding");
  }

  return (
    <div className={styles.sidebar}>
      {menuItems.map((item, index) => (
        <button
        key={index}
        onClick={() => navigate(item.path)}
        className={`${styles.sidebarBtn} ${location.pathname === item.path ? styles.active : ''}`}
      >
      
          <span className={styles.icon}>{item.icon}</span>
          <span className={styles.label}>{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
