import { useNavigate } from 'react-router-dom';
import styles from '../styles/sidebar.module.scss'; // Your custom styling

import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CloudIcon from '@mui/icons-material/Cloud';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';


const Sidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { label: 'User Management', icon: <DashboardIcon />, path: '/admin' },
    { label: 'Onboarding', icon: <PersonAddIcon />, path: '/admin/onboarding' },
    { label: 'AWS Services', icon: <CloudIcon />, path: '/admin/aws' },
    { label: 'Cost Explorer', icon: <AttachMoneyIcon />, path: '/admin/cost' },
  ];

  return (
    <div className={styles.sidebar}>
      {menuItems.map((item, index) => (
        <button key={index} onClick={() => navigate(item.path)} className={styles.sidebarBtn}>
          <span className={styles.icon}>{item.icon}</span>
          <span className={styles.label}>{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
