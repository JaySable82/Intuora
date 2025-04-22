import{React,useRef}  from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Bestsellers from './Bestseller';
import Menu from './menu';
import Cart from './kartpopup';
import Nav from './navbar';
import Categories from './Categories';
import peshwai from '../../../assets/pizza.png' 
import sadashiv from '../../../assets/pizza.png'
import bombay from '../../../assets/pizza.png'

const YourComponent = ({ cart, updateCart,selectedTable,tableno,blockNo,isOpen,setIsOpen }) => {
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
        { id: 100,marathi:"चपाती", price: 10, img:peshwai },
        { id: 105,marathi:"सादा राईस हॉफ", price: 30, img:sadashiv },
        { id: 107,marathi:"जीरा राईस हॉफ", price:50, img:bombay },
        // { id: 36, name: 'Kokam',marathi:"कोकम", price:30, img:bombay },

    ];

    // const NewArrivals=[
    //     { id: 17, name: "Window's Farm", price: 139, img:peshwai },
    //     { id: 18, name: ' Jalapeno & Paprika', price: 129, img:sadashiv },
    //     { id: 19, name: 'Blazing Onion & Paprika', price:119, img:bombay }
    // ];

    const sectionRefs = {
        VegUnlimited: useRef(null),
        VegLimited: useRef(null),
        NonVeg_Unlimited: useRef(null),
        Limited: useRef(null),
        Rice: useRef(null),
        Paratha: useRef(null),
    };

    return (

        <div style={isOpen ? {top:200,left:260,height:1000,width:750,position:"absolute",backgroundColor:"#F8F8FA",borderRadius:10,overflowY:"auto", transition:"0.5s ease"} : {top:200,left:40,height:1000,width:1000,position:"absolute",backgroundColor:"#F8F8FA",borderRadius:10,overflowY:"auto",transition:"0.5s ease"}}> 
            <Categories sectionRefs={sectionRefs}/>
            <Bestsellers title={"Bestseller"} onBestsellerClick={handleBestsellerClick} cart={cart} updateCart={updateCart} Bestseller={Bestseller} tableno={tableno} blockNo={blockNo} isOpen={isOpen} />
            <Menu handleClick={handleMenuClick} cart={cart} sectionRefs={sectionRefs} selectedTable={selectedTable} tableno={tableno} blockNo={blockNo} isOpen={isOpen}/>
            {/* <Cart size={cartSize} total={cartTotal} cart={cart} updateCart={updateCart} /> */}

        </div>
    );
};

export default YourComponent;