import{React,useRef}  from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Bestsellers from './Bestseller';
import Menu from './menu';
import Cart from '../Components/kartpopup';
import Nav from '../Components/navbar';
import Categories from './Categories';
import peshwai from '../assets/pizza.png'
import sadashiv from '../assets/pizza.png'
import bombay from '../assets/pizza.png'

const YourComponent = ({ cart, updateCart }) => {
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
        { id: 8, name: 'Paneer Makhani', price: 129, img:peshwai },
        { id: 7, name: 'Supreme Veggie', price: 129, img:sadashiv },
        { id: 2, name: 'Veggie Delight', price:89, img:bombay }
    ];

    const NewArrivals=[
        { id: 17, name: "Window's Farm", price: 139, img:peshwai },
        { id: 18, name: ' Jalapeno & Paprika', price: 129, img:sadashiv },
        { id: 19, name: 'Blazing Onion & Paprika', price:119, img:bombay }
    ];

    const sectionRefs = {
        Grilled: useRef(null),
        NonGrilled: useRef(null),
        Chocolate: useRef(null),
    };

    return (
        <div style={{ width: '100%', height: '100vh', position: 'relative', background: '#FCFCF9' }}>
            <Nav size={cartSize} />
            <div style={{ marginBottom: 110 }}>
                <Categories sectionRefs={sectionRefs}/>
            </div>
            <Bestsellers title={"New Arrivals"} onBestsellerClick={handleNewarrivalClick} cart={cart} updateCart={updateCart} Bestseller={NewArrivals}/>
            <div style={{ marginTop: 20 }}>
            <Bestsellers title={"Bestseller"} onBestsellerClick={handleBestsellerClick} cart={cart} updateCart={updateCart} Bestseller={Bestseller} />
            </div>
            <Menu handleClick={handleMenuClick} cart={cart} sectionRefs={sectionRefs} />
            <Cart size={cartSize} total={cartTotal} />
        </div>
    );
};

export default YourComponent;