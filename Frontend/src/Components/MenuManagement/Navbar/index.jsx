import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from '../../../assets/dinein.png';
import "./Navbar.css";
import { ControlContext } from "../../ControlContext";
import open from "./open_1.png";
import close from "./close_1.png";
import Warning from "../../warning";

function NavBar() {
    const [isOpen, setOpen] = useState(false);
    const { kitchenActive, setKitchenActive } = useContext(ControlContext);
    const[showWarning,setshowWarning]=useState(false);

    const handleOpen = () => {
        setOpen(!isOpen);
    };

    const handleHideWarning = () => {

        setshowWarning(false); // Function to hide the warning
    };
    const handleLogout= () =>{
        setshowWarning(true);
    } 

    

    return (
        <>
            <nav className="navbar">
                <div className="navbar-div" style={{ display: "flex", justifyContent: "space-between",width:"100%",paddingRight:"2rem"}}>
                    <div className="logo-div" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="more-logo" style={{ height: "2rem", width: "2rem", backgroundColor: "black", marginTop: "0rem", marginLeft: "1rem" }} onClick={handleOpen}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                        <img src={logo} alt="DineIn" style={{ marginTop: "0rem", marginLeft: "2rem", marginBottom: "0.5rem", height: 50, width: 110 }} />
                    </div>
                    <button className="kitchen-control-btn ml-auto" style={{backgroundColor:"black",width:"10%",height:"100%",border:"none",cursor:"pointer"}} onClick={handleLogout}>
                        <img src={kitchenActive?open:close} style={{height:"3.5rem"}} />
                    </button>
                </div>

                {showWarning && <Warning offWarning={handleHideWarning}/>}

                <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                    <ul>
                        <li className="home">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="home-icon">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                            </svg>
                            <span>
                                <Link to={"/ambika-admin/dashboard"} style={{ textDecoration: "none", color: "white" }}>
                                    Home
                                </Link>
                            </span>
                        </li>
                        <li className="menu">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="menu-logo">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                            </svg>
                            <span>
                                <Link to={"/ambika-admin/menu"} style={{ textDecoration: "none", color: "white" }}>
                                    Menu
                                </Link>
                            </span>
                        </li>
                        <li className="order">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="order-logo">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                            </svg>
                            <span>Inventory</span>
                        </li>
                        <li className="login">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="login-logo">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                            <span>Log in</span>
                        </li>
                        <li className="menu">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="menu-logo">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                            </svg>
                            <span>
                                <Link to={"/ambika/user/cart"} style={{ textDecoration: "none", color: "white" }}>
                                    kart
                                </Link>
                            </span>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    );
}

export default NavBar;
