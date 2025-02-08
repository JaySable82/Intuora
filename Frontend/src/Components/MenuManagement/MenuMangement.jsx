import React, { useContext, useEffect } from "react";
import NavBar from "./Navbar";
import SearchBar from "./SearchBar";
import Filter from "./Filter";
import "./MenuManagement.css";
import { ControlContext } from "../ControlContext";

function MenuManagement(){
    const {kitchenActive,setKitchenActive}=useContext(ControlContext);
    
    useEffect(() => {
            const interval = setInterval(() => {
                console.log(`Kitchen is ${kitchenActive ? "open" : "closed"}`);
            }, 1000); // Log every second
    
            // Cleanup interval on component unmount
            return () => clearInterval(interval);
        }, [kitchenActive]);

    return(
        <>
            <NavBar />
            <div className="control-panel">
                <div>
                    <SearchBar />
                </div>
                <div>
                    <Filter />
                </div>
            </div>
        </>
    )
}

export default MenuManagement;