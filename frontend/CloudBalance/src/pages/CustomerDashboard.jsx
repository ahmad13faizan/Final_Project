// src/pages/CustomerDashboard.jsx
import React from 'react';

const CustomerDashboard = () => {
  return (
    <div style={styles.container}>
      <h1>🛍️ Customer Dashboard</h1>
      <p>Welcome, dear customer! You can browse and make purchases here.</p>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    marginTop: '8rem',
  },
};

export default CustomerDashboard;
