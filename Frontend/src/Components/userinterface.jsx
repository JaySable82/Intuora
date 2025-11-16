import{React,useRef}  from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Bestsellers from './Bestseller';
import Menu from './menu';
import Cart from '../Components/kartpopup';
import Nav from '../Components/navbar';
import Categories from './Categories';
import peshwai from '../assets/mtp.jpg'
import sadashiv from '../assets/food.jpg'
import bombay from '../assets/bombay.jpg'

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
        { id: 6, name: 'Pashwaii Veg Chesse Grill',marathi:"पेशवाई व्हेज चीज ग्रिल", price: 100, img:peshwai },
        { id: 5, name: 'Sadashiv Veg Cheese Grill',marathi:"सदाशिव व्हेज चीज ग्रिल", price: 100, img:sadashiv },
        { id: 7, name: 'Veg Grill',marathi:"व्हेज ग्रिल", price:100, img:bombay }
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
            {/* <Bestsellers title={"New Arrivals"} onBestsellerClick={handleNewarrivalClick} cart={cart} updateCart={updateCart} Bestseller={NewArrivals}/> */}
            <div style={{ marginTop: 20 }}>
            <Bestsellers title={"Bestseller"} onBestsellerClick={handleBestsellerClick} cart={cart} updateCart={updateCart} Bestseller={Bestseller} />
            </div>
            <Menu handleClick={handleMenuClick} cart={cart} sectionRefs={sectionRefs} />
            <Cart size={cartSize} total={cartTotal} />
        </div>
    );
};

export default YourComponent;