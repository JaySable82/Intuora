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
            <div className="control-panel" style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    width: '100%',
                                                    padding: '1rem',
                                                    paddingLeft: '4rem',
                                                    paddingRight: '4rem',
                                                    paddingTop: '1rem'
                                                    }}>
                <div>
                    <SearchBar />
                </div>
                <div className="right-side-buttons" style={{display:"flex",justifyContent:"space-around",gap:"3rem",marginRight:"0rem"}}>
                    <button style={{border:"none",backgroundColor:"rgb(49,180,117)",borderRadius:"1rem",height:"3rem",width:"9rem"}} onClick={()=>{setAddItems(true)}}>
                        <span style={{color:"white",fontWeight:"600"}}>Add Items</span>
                    </button>
                    <button style={{border:"none",backgroundColor:"rgb(49,180,117)",borderRadius:"1rem",height:"3rem",width:"9rem"}}>
                        <span style={{color:"white",fontWeight:"600"}}>Update Items</span>
                    </button>
                </div>
            </div>
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