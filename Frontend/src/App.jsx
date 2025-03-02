import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/login";
import Otpform from "./Components/otp";
import YourComponent from "./Components/userinterface";
import Kart from "./Components/orders";
import Menu from "./Components/menu";
import Admin from "./Components/Admininterface";
import Adminlogin from "./Components/Admin";
import Finalorder from "./Components/placeorder";
import { ControlContextProvider } from "./Components/ControlContext";
import MenuManagement from "./Components/MenuManagement/MenuMangement";
import NavBar from "./Components/MenuManagement/Navbar";
import Inventory from "./Components/Inventory/Inventory";
import Home from "./Components/pages/Home";

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
            }
            return prevCart;
        });
    };

    

    return (
        <BrowserRouter>
            <ControlContextProvider>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/otp" element={<Otpform />} />
                    <Route path="/ambika/user" element={<YourComponent cart={cart} updateCart={updateCart} />} />
                    <Route path="/ambika/user/cart" element={<Kart cart={cart} updateCart={updateCart} />} />
                    <Route path="/menu" element={<Menu cart={cart} updateCart={updateCart} />} />
                    <Route path="/ambika-admin/dashboard" element={<Home />} />
                    <Route path="/ambika-admin" element={<Adminlogin />} />
                    <Route path="/ambika/user/cart/placedorder" element={<Finalorder />} />
                    <Route path="/ambika-admin/menu" element={<MenuManagement />} />
                    <Route path="/ambika-admin/inventory" element={<Inventory />} />
                    <Route path="/nav" element={<NavBar />} />
                </Routes>
            </ControlContextProvider>
        </BrowserRouter>
    );
    return <Home />;
}

export default App;
