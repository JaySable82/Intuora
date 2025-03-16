import React from "react";
import { Link } from "react-router-dom";

const Cart = ({ size, total }) => {
    return (
        <div style={{ 
            position: 'fixed', 
            bottom: 0, 
            left: '25.5%', 
            width: '48%', 
            background: '#0D0F11', 
            color: 'white', 
            padding: '10px', 
            zIndex: 10, 
            boxSizing: 'border-box', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
        }}>
            <div style={{ marginLeft: '20px' }}>
                <div>{size} Items</div>
                <div>₹{total}</div>
            </div>
            <Link to="/ambika-admin/dashboard" style={{ 
                color: 'white', 
                textDecoration: 'none', 
                marginRight: '20px' 
            }}>View Cart</Link>
        </div>
    );
}

export default Cart;