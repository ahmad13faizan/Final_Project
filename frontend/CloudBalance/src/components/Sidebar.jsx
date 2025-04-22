import { useNavigate } from 'react-router-dom';
import styles from '../styles/sidebar.module.scss'; // Adjust the path as necessary

const Sidebar = () => {
  const navigate = useNavigate();


  return (
    <div className={styles.sidebar}>
      <button onClick={() => navigate('/admin')}>Dashboard</button>
      <button onClick={() => navigate('/admin/onboarding')}>Onboarding</button>
      <button onClick={() => navigate('/admin/aws')}>AWS Services</button>
     
    </div>
  );
};

export default Sidebar;
