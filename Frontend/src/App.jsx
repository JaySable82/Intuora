import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/login";
import { ControlContextProvider } from "./Components/ControlContext";
import Home from "./Components/Admin/Home";
import { OrderContextProvider } from "./Components/Admin/OrdersContext";
import PrivateRoute from "./Components/PrivateRoute";

function App() {
    const [cart, setCart] = useState([]);

    const updateCart = (item, change) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
            if (existingItem) {
                const newQuantity = Math.max(0, existingItem.quantity + change);
                if (newQuantity === 0) {
                    return prevCart.filter((cartItem) => cartItem.id !== item.id);
                }
                return prevCart.map((cartItem) =>
                    cartItem.id === item.id ? { ...cartItem, quantity: newQuantity, marathi: item.marathi } : cartItem
                );
            } else if (change > 0) {
                return [...prevCart, { ...item, quantity: change, marathi: item.marathi }];
            }x
            return prevCart;
        });
    };

    return (
        <BrowserRouter>
            <ControlContextProvider>
                <OrderContextProvider>
                    <Routes>
                        <Route path="/bedekar" element={<Login />} />
                        <Route path="/bedekar/dashboard" element={ <PrivateRoute><Home /></PrivateRoute> } />
                    </Routes>
                </OrderContextProvider>
            </ControlContextProvider>
        </BrowserRouter>
    );
}

export default App;
