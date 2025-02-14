import React, { useState } from "react";
import NavBar from "../MenuManagement/Navbar";
import SubNav from "./SubNav";
import SearchBar from "./SearchBar";
import "./Inventory.css";
import RawMaterial from "./RawMaterial";
import PurchaseOrders from "./PurchaseOrders";

function Inventory(){
    const [rawMaterialActive,setRawMaterialActive]=useState(true);
    const [purchaseOrderActive,setPurchaseOrderActive]=useState(false);
    const [addItems,setAddItems]=useState(false);

    return(
        <>
            <NavBar />
            <nav className="navbar" style={{backgroundColor:'rgb(44,44,42)',height:"4rem"}}>
                <div className="container-fluid" style={{display:"flex",justifyContent:"center",gap:"3rem"}}>
                    <button style={{backgroundColor:"transparent",border:"none"}} onClick={()=>{setRawMaterialActive(true);setPurchaseOrderActive(false)}}>
                        <span className={rawMaterialActive?"green-btn":"raw-material-btn"} style={{fontSize:"x-large",fontWeight:"700"}}>
                            Raw Material
                        </span>
                    </button>
                    
                    <button style={{backgroundColor:"transparent",border:"none"}} onClick={()=>{setPurchaseOrderActive(true);setRawMaterialActive(false)}}>
                        <span className={purchaseOrderActive?"green-btn":"raw-material-btn"} style={{fontSize:"x-large",fontWeight:"700"}}>
                            Purchase Orders
                        </span>
                    </button>
                </div>
            </nav>
            <div className="main-container" style={{padding:"0rem",backgroundColor:"white",height:"65vh"}}>
                {rawMaterialActive && (
                    <RawMaterial />
                )}
                {purchaseOrderActive && (
                    <PurchaseOrders  />
                )}
            </div>
        </>
    )
}

export default Inventory;