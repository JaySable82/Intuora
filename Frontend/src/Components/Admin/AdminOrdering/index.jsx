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

const YourComponent = ({ cart, updateCart,selectedTable,tableno,blockNo }) => {
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
        { id: 1, name: 'Misal Slice',marathi:"मिसळ स्लाइस", price: 100, img:peshwai },
        { id: 3, name: 'Extra Slice',marathi:"एक्स्ट्रा स्लाइस", price: 5, img:sadashiv },
        { id: 10, name: 'Bhaji',marathi:"भजी", price:50, img:bombay }
    ];

    // const NewArrivals=[
    //     { id: 17, name: "Window's Farm", price: 139, img:peshwai },
    //     { id: 18, name: ' Jalapeno & Paprika', price: 129, img:sadashiv },
    //     { id: 19, name: 'Blazing Onion & Paprika', price:119, img:bombay }
    // ];

    const sectionRefs = {
        Grilled: useRef(null),
        NonGrilled: useRef(null),
        Chocolate: useRef(null),
    };

    return (
        // <div style={{left:310, width: '32%',overflow:'hidden',display:'flex',flexDirection:'column', position: 'relative', background: 'white' }}>
        //     {/* <Nav size={cartSize} /> */}
        //     <div style={{ marginBottom: 10 }}>
        //         <Categories sectionRefs={sectionRefs}/>
        //     </div>
        //     {/* <Bestsellers title={"New Arrivals"} onBestsellerClick={handleNewarrivalClick} cart={cart} updateCart={updateCart} Bestseller={NewArrivals}/> */}
        //     <div style={{ marginTop: 20 }}>
        //     <Bestsellers title={"Bestseller"} onBestsellerClick={handleBestsellerClick} cart={cart} updateCart={updateCart} Bestseller={Bestseller} />
        //     </div>
        //     <Menu handleClick={handleMenuClick} cart={cart} sectionRefs={sectionRefs} selectedTable={selectedTable} block={block} />
        //     {/* <Cartx size={cartSize} total={cartTotal} cart={cart} updateCart={updateCart} /> */}
        // </div>

        <div style={{top:300,left:420,height:1000,width:630,position:"absolute",backgroundColor:"#F8F8FA",borderRadius:10,overflowY:"auto" }}> 
            <Categories sectionRefs={sectionRefs}/>
            <Bestsellers title={"Bestseller"} onBestsellerClick={handleBestsellerClick} cart={cart} updateCart={updateCart} Bestseller={Bestseller} tableno={tableno} blockNo={blockNo} />
            <Menu handleClick={handleMenuClick} cart={cart} sectionRefs={sectionRefs} selectedTable={selectedTable} tableno={tableno} blockNo={blockNo} />
            {/* <Cart size={cartSize} total={cartTotal} cart={cart} updateCart={updateCart} /> */}

        </div>
    );
};

export default YourComponent;