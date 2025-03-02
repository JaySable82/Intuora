import React, { useState } from "react";
import logo from "../../../assets/dinein.png";

function NavBar() {
  // Local state to track authentication status.
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Toggle the authentication status when the button is clicked.
  const handleAuthClick = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  return (
    <nav
      style={{
        backgroundColor: "#000000",
        padding: "0.5rem",
        height: "5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", marginLeft: "1rem" }}>
        <img src={logo} alt="DineIn" style={{ height: "50px", width: "110px" }} />
      </div>
      <button
        onClick={handleAuthClick}
        style={{
          backgroundColor: "#000000",
          color: "white",
          border: "none",
          cursor: "pointer",
          marginRight: "2rem",
          fontSize: "1rem",
        }}
      >
        {isLoggedIn ? "Logout" : "Login"}
      </button>
    </nav>
  );
}

export default NavBar;
