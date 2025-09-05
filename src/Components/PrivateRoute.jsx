// Components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    return isLoggedIn ? children : <Navigate to="/bedekar" replace />;
};

export default PrivateRoute;
