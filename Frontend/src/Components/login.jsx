import React, { useState } from 'react';
import {useNavigate } from 'react-router-dom';
import './login.css'; // Make sure to import your CSS file

function Login() {
    const [mobileNumber, setMobileNumber] = useState('');
    const [errorMessage,setErrorMessage]=useState();
    const navigate=useNavigate();

    const handleChange = (e) => {
        const value = e.target.value;
        // Regex to allow only numeric characters
        const numericValue = value.replace(/\D/g, '');
        setMobileNumber(numericValue);
    };

    const handleGetOTP = () => {
        // Perform validation or logic here
        if (mobileNumber.length === 10) {
            // Proceed with OTP generation or navigate to OTP component
            console.log('Mobile number:', mobileNumber);
            navigate('/user');
        } 
        else {
            setErrorMessage('Please enter a valid 10-digit mobile number');
        }
    };

    return (
        <div className='outer-container'>
            <div className='inner-container'>
                <div className='Welcome'>Welcome!</div>
                <div className='mobile'>Enter your mobile number</div>
                <div className="input-container">
                    <span>+91 |</span>
                    <input
                        type="text"
                        value={mobileNumber}
                        onChange={handleChange}
                        minLength={10}
                        maxLength={10}
                        placeholder="Enter mobile number"
                    />
                </div>
                {errorMessage && (
                    <div className="alert" style={{position:'absolute',marginTop:220,marginLeft:75,color:'grey'}}>
                        <h6>{errorMessage}</h6>
                    </div>
                )}
                <div className='otpbutton'>
                    <button onClick={handleGetOTP}>Login</button>
                </div>
            </div>
        </div>
    );
}
 
export default Login;
