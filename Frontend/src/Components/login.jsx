import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css'; // Make sure to import your CSS file

function Login() {
  const [mobileNumber, setMobileNumber] = useState('');
  // Pre-fill the password field with the desired default value.
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleMobileChange = (e) => {
    const value = e.target.value;
    // Allow only numeric characters for mobile
    const numericValue = value.replace(/\D/g, '');
    setMobileNumber(numericValue);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLoginClick = (e) => {
    console.log("Login clicked");
    e.preventDefault();

    // 1. Check if mobile number is less than 10 digits
    if (mobileNumber.length < 10) {
      setErrorMessage('Enter valid 10 digit no.');
      return;
    }
    // 2. Check if mobile number is not one of the allowed numbers
    if (mobileNumber !== '7798959576' && mobileNumber !== '8261969419') {
      setErrorMessage('Enter correct phone no.');
      return;
    }
    // 3. Check if password is incorrect
    if (password !== 'bedekar@aditya') {
      setErrorMessage('Enter correct password.');
      return;
    }

    // If all validations pass, clear error and navigate.
    setErrorMessage('');
    navigate('/bedekar/dashboard');
  };

  // Shared inline style for input boxes
  const inputBoxStyle = {
    display: "flex",
    alignItems: "left",
    width: "100%",
    height: "50px",
    background: "#EDECE9",
    borderRadius: "8px",
    paddingLeft: "10px",
    fontFamily: "Poppins, sans-serif",
    textAlign: "left"
  };

  return (
    <div className="outer-container">
      <div className="inner-container">
        <div className="Welcome">Welcome!</div>
        <div className="main-card">
          <div className="mobile">Enter your mobile number</div>
          <div className="input-container">
            <span>+91 |</span>
            <input
              type="text"
              value={mobileNumber}
              onChange={handleMobileChange}
              maxLength={10}
              placeholder="Enter mobile number"
            />
          </div>

          {/* Password input box with same style and gap */}
          <div style={{ ...inputBoxStyle, marginTop: "20px" }}>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter password"
              style={{
                width: "100%",
                border: "none",
                background: "transparent",
                fontFamily: "Poppins, sans-serif",
                fontSize: "16px",
                outline: "none"
              }}
            />
          </div>

          <div className="otpbutton">
            <button onClick={handleLoginClick}>Login</button>
          </div>

          {errorMessage && (
            <div style={{ position:"relative",bottom:60,color: 'grey', marginTop: '10px', textAlign: "center" }}>
              {errorMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
