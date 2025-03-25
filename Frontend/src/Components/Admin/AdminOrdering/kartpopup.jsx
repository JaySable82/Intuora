import React from "react";
import { Link } from "react-router-dom";
import Kart from "./orders";

const Cart = ({ size, total,cart,updateCart }) => {
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
            <Kart cart={cart} updateCart={updateCart} />
        </div>
    );
}

export default Cart;