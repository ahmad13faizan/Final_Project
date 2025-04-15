import React from "react";
import styles from "../../styles/Footer.module.scss";

const Footer = () => {
  return (
    <footer className={styles.footer}>
  <div className={styles["footer-left"]}>
  <span>CloudBalance © 2025 ||  All rights reserved.</span>
   
  </div>
  <div className={styles["footer-right"]}>
  
    <a href="#contact">Contact Us</a>
  </div>
</footer>

  
  
  );
};

export default Footer;
