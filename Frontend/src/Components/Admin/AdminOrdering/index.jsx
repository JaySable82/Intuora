import { React, useRef } from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Bestsellers from './Bestseller';
import Menu from './menu';
import Cart from './kartpopup';
import Nav from './navbar';
import Categories from './Categories';
import peshwai from '../../../assets/pizza.png';
import sadashiv from '../../../assets/pizza.png';
import bombay from '../../../assets/pizza.png';

const YourComponent = ({ cart, updateCart, selectedTable, tableno, blockNo, isOpen, setIsOpen }) => {
  const handleBestsellerClick = (item, quantity) => {
    updateCart(item, quantity);
  };

  const handleNewarrivalClick = (item, quantity) => {
    updateCart(item, quantity);
  };

  const handleMenuClick = (item, quantity) => {
    updateCart(item, quantity);
  };

  const cartSize = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const Bestseller = [
    { id: 1, name: 'Misal Slice', marathi: "मिसळ स्लाइस", price: 100, img: peshwai },
    { id: 12, name: 'Extra Slice', marathi: "एक्स्ट्रा स्लाइस", price: 5, img: sadashiv },
    { id: 19, name: 'Bhaji', marathi: "भजी", price: 50, img: bombay },
    // { id: 36, name: 'Kokam', marathi: "कोकम", price: 30, img: bombay },
  ];

  const sectionRefs = {
    Misal: useRef(null),
    Extras: useRef(null),
    Snacks: useRef(null),
    Beverages: useRef(null),
    Desserts: useRef(null),
    RTE: useRef(null),
  };

  return (
    <div style={isOpen ? { top: 200, left: 260, height: '450vh', width: 750, position: "absolute", backgroundColor: "#F8F8FA", borderRadius: 10, transition: "0.5s ease" } : { top: 200, left: 40, height: '350vh', width: 1000, position: "absolute", backgroundColor: "#F8F8FA", borderRadius: 10, transition: "0.5s ease" }}>
      
      {/* Categories Fixed Position */}
      <div style={{ position: 'sticky', top: '130px', left: '270px', zIndex: 10 }}>
        <Categories sectionRefs={sectionRefs} />
      </div>

      {/* Other Components */}
      <div style={{ marginTop: '30px' }}> {/* Added margin to push the content down to prevent overlap */}
        <Bestsellers title={"Bestseller"} onBestsellerClick={handleBestsellerClick} cart={cart} updateCart={updateCart} Bestseller={Bestseller} tableno={tableno} blockNo={blockNo} isOpen={isOpen} />
        <Menu handleClick={handleMenuClick} cart={cart} sectionRefs={sectionRefs} selectedTable={selectedTable} tableno={tableno} blockNo={blockNo} isOpen={isOpen} />
      </div>

      {/* Uncomment if you want Cart to be used */}
      {/* <Cart size={cartSize} total={cartTotal} cart={cart} updateCart={updateCart} /> */}

    </div>
  );
};

export default YourComponent;
// position: 'sticky', top: '130px', left: '270px', zIndex: 10