// src/pages/CustomerDashboard.jsx
import React from 'react';

const ReadOnlyDashboard = () => {
  return (
    <div style={styles.container}>
      <h1> Read-Only Dashboard</h1>
      <p>Welcome, dear user! You can view all accounts and items.</p>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    marginTop: '8rem',
  },
};

export default ReadOnlyDashboard;
