import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css'; // Make sure to import your CSS file

function Login() {
  const [mobileNumber, setMobileNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // For programmatic navigation
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.value;
    // Regex to allow only numeric characters
    const numericValue = value.replace(/\D/g, '');
    setMobileNumber(numericValue);
  };

  const handleLoginClick = (e) => {
    e.preventDefault(); // Prevent default form/link behavior

    // 1) Check if input is empty or not 10 digits
    if (mobileNumber.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }
    // 2) Check if input is not 8261969419
    if (mobileNumber !== '7798959576' && mobileNumber!=='8261969419') {
      setErrorMessage('Login error');
      return;
    }
    // 3) If we reach here, no errors
    setErrorMessage('');

    // Now navigate to /bedekar/dashboard
    navigate('/bedekar/dashboard');
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
              onChange={handleChange}
              maxLength={10}
              placeholder="Enter mobile number"
            />
          </div>

          {/* Instead of <Link>, just use a regular button */}
          <div className="otpbutton">
            <button onClick={handleLoginClick}>Login</button>
          </div>

          {/* Show the error message below the button if any */}
          {errorMessage && (
            <div style={{ color: 'grey', marginTop: '10px',textAlign:"center" }}>
              {errorMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
