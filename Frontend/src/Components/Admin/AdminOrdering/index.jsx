import React from 'react';
import Bestsellers from '../../Bestseller';
import Categories from '../../Categories';
// import Menu from '../../menu';

import peshwai from "../../../assets/pizza.png";
import sadashiv from "../../../assets/pizza.png";
import bombay from "../../../assets/pizza.png";

const AdminOrdering = ({ cart, updateCart }) => {
  const handleBestsellerClick = (item, quantity) => {
    updateCart(item, quantity);
  };

  const Bestseller = [
    { id: 19, name: 'Peshwaii', marathi: "पेशवाई", price: 100, img: peshwai },
    { id: 22, name: 'Sadashiv Grill', marathi: "सदाशिव ग्रिल", price: 100, img: sadashiv },
    { id: 3, name: 'Puneri Veg', marathi: "पुणेरी व्हेज", price: 90, img: bombay },
  ];

  return (
    <div style={{ width: '50%', height: '100vh', background: '#FCFCF9', padding: '10px' }}>
      <Categories />
      <Bestsellers
        title="Bestseller"
        onBestsellerClick={handleBestsellerClick}
        cart={cart}
        Bestseller={Bestseller}
      />
      {/* <Menu handleClick={handleMenuClick} cart={cart} />  */}
    </div>
  );
};

export default AdminOrdering;
