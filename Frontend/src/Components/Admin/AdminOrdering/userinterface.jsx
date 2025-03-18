// YourComponent.jsx
import React, { useRef } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Bestsellers from "./Bestseller";
import Menu from "./menu";
import Cart from "../Components/kartpopup";
import Nav from "../Components/navbar";
import Categories from "./Categories";
import peshwai from "../assets/pizza.png";
import sadashiv from "../assets/pizza.png";
import bombay from "../assets/pizza.png";

const YourComponent = ({ cart, updateCart }) => {
  const handleBestsellerClick = (item, quantity) => {
    updateCart(item, quantity);
  };

  const handleMenuClick = (item, quantity) => {
    updateCart(item, quantity);
  };

  const cartSize = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const Bestseller = [
    { id: 19, name: "Pashwaii", price: 100, img: peshwai },
    { id: 22, name: "Sadashiv Grill", price: 100, img: sadashiv },
    { id: 3, name: "Puneri Veg", price: 90, img: bombay },
  ];

  const sectionRefs = {
    nongrilled: useRef(null),
    grilled: useRef(null),
    chocolate: useRef(null),
  };

  return (
    <div
      className="Menu-compo"
      style={{ width: "100%", overflow: "hidden", background: "#FCFCF9" }}
    >
      <Nav size={cartSize} />
      <Categories sectionRefs={sectionRefs} />
      <Bestsellers
        title={"Bestseller"}
        onBestsellerClick={handleBestsellerClick}
        cart={cart}
        updateCart={updateCart}
        Bestseller={Bestseller}
      />
      <Menu handleClick={handleMenuClick} cart={cart} sectionRefs={sectionRefs} />
      {/* <Cart size={cartSize} total={cartTotal} /> */}
    </div>
  );
};

export default YourComponent;