import React from "react";
import styles from "../styles/sidebar.module.scss";

const Sidebar =({ setActiveComponent }) =>{
  return (
    <div className={styles.sidebar}>
      <h2 className={styles.title}>Control Panel</h2>
      <ul className={styles.menu}>
        <li onClick={()=>setActiveComponent("usertable")}>Users</li>
        <li>Dashboard</li>
        <li>Module Control Grid</li>
      </ul>
    </div>
  );
};

export default Sidebar;
