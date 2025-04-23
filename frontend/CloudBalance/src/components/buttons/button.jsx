import React, { useState } from "react";

const LogoutButton = ({ handleLogout }) => {
  const [hover, setHover] = useState(false);

  const buttonStyle = {
    backgroundColor: hover ? '#ff4d4d' : 'blue', // light red on hover, red normally
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  return (
    <button
      onClick={handleLogout}
      style={buttonStyle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
