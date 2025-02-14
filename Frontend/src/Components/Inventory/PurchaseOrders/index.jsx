import React, { useState } from "react";
import "./purchaseOrder.css";
import SearchBar from "../SearchBar";

function PurchaseOrders(){

    const rawMaterialData = [
        {item:"Salt",vendor:"AB Supplies",invoice_no:"INV-202423",quantity:"100",unit_price:140,total_price:140},
        {item:"Salt",vendor:"AB Supplies",invoice_no:"INV-202423",quantity:"100",unit_price:140,total_price:140},
        {item:"Salt",vendor:"AB Supplies",invoice_no:"INV-202423",quantity:"100",unit_price:140,total_price:140},
        {item:"Salt",vendor:"AB Supplies",invoice_no:"INV-202423",quantity:"100",unit_price:140,total_price:140},
        {item:"Salt",vendor:"AB Supplies",invoice_no:"INV-202423",quantity:"100",unit_price:140,total_price:140},
        {item:"Salt",vendor:"AB Supplies",invoice_no:"INV-202423",quantity:"100",unit_price:140,total_price:140},
        {item:"Salt",vendor:"AB Supplies",invoice_no:"INV-202423",quantity:"100",unit_price:140,total_price:140},
        {item:"Salt",vendor:"AB Supplies",invoice_no:"INV-202423",quantity:"100",unit_price:140,total_price:140},
        {item:"Salt",vendor:"AB Supplies",invoice_no:"INV-202423",quantity:"100",unit_price:140,total_price:140},
        {item:"Salt",vendor:"AB Supplies",invoice_no:"INV-202423",quantity:"100",unit_price:140,total_price:140},
        {item:"Salt",vendor:"AB Supplies",invoice_no:"INV-202423",quantity:"100",unit_price:140,total_price:140},
        {item:"Salt",vendor:"AB Supplies",invoice_no:"INV-202423",quantity:"100",unit_price:140,total_price:140},
        {item:"Salt",vendor:"AB Supplies",invoice_no:"INV-202423",quantity:"100",unit_price:140,total_price:140},
        {item:"Salt",vendor:"AB Supplies",invoice_no:"INV-202423",quantity:"100",unit_price:140,total_price:140},
        {item:"Salt",vendor:"AB Supplies",invoice_no:"INV-202423",quantity:"100",unit_price:140,total_price:140},
        {item:"Salt",vendor:"AB Supplies",invoice_no:"INV-202423",quantity:"100",unit_price:140,total_price:140},
    ];
    const [addItems,setAddItems]=useState(false);
    const [temporary,setTemporary]=useState({});

    function handleSave(){
        console.log(temporary);
    }
    return(
        <>
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
                    <span style={{color:"white",fontWeight:"600"}}>New Order</span>
                </button>
                <button style={{border:"none",backgroundColor:"rgb(49,180,117)",borderRadius:"1rem",height:"3rem",width:"9rem"}}>
                    <span style={{color:"white",fontWeight:"600"}}>Edit Order</span>
                </button>
            </div>
        </div>

        <div className="container" style={{paddingBottom:"10rem"}}>
            <table border="0" style={{ width: "100%", textAlign: "center" }}>
            <thead>
                <tr>
                <th>Item</th>
                <th>Vendor</th>
                <th>Invoice No.</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total Price</th>
                </tr>
            </thead>
            <tbody>
                {rawMaterialData.map((row) => (
                <tr key={row.key} style={{borderBottomWidth:"1px"}}>
                    <td>{row.item}</td>
                    <td>{row.vendor}</td>
                    <td>{row.invoice_no}</td>
                    <td>{row.quantity}</td>
                    <td>{row.unit_price}</td>
                    <td>{row.total_price}</td>
                </tr>
                ))}

            {addItems && (
                <tr style={{ borderBottomWidth: "1px" }}>
                    <td style={{ padding: "0.5rem", textAlign: "center", verticalAlign: "middle" }}>
                        <input
                            type="text"
                            style={{ width: "6rem", height: "3rem", padding: "0.5rem", textAlign: "center", margin: "0 auto" }}
                            value={temporary.item || ''}
                            onChange={(e) => setTemporary({ ...temporary, item: e.target.value })}
                        />
                    </td>
                    <td style={{ padding: "0.5rem", textAlign: "center", verticalAlign: "middle" }}>
                        <input
                            type="text"
                            style={{ width: "8rem", height: "3rem", padding: "0.5rem", textAlign: "center", margin: "0 auto" }}
                            value={temporary.vendor || ''}
                            onChange={(e) => setTemporary({ ...temporary, vendor: e.target.value })}
                        />
                    </td>
                    <td style={{ padding: "0.5rem", textAlign: "center", verticalAlign: "middle" }}>
                        <input
                            type="text"
                            style={{ width: "9rem", height: "3rem", padding: "0.5rem", textAlign: "center", margin: "0 auto" }}
                            value={temporary.invoice_No || ''}
                            onChange={(e) => setTemporary({ ...temporary, invoice_No: e.target.value })}
                        />
                    </td>
                    <td style={{ padding: "0.5rem", textAlign: "center", verticalAlign: "middle" }}>
                        <input
                            type="text"
                            style={{ width: "5rem", height: "3rem", padding: "0.5rem", textAlign: "center", margin: "0 auto" }}
                            value={temporary.quantity || ''}
                            onChange={(e) => setTemporary({ ...temporary, quantity: e.target.value })}
                        />
                    </td>
                    <td style={{ padding: "0.5rem", textAlign: "center", verticalAlign: "middle" }}>
                        <input
                            type="text"
                            style={{ width: "5rem", height: "3rem", padding: "0.5rem", textAlign: "center", margin: "0 auto" }}
                            value={temporary.unit_price || ''}
                            onChange={(e) => setTemporary({ ...temporary, unit_price: e.target.value })}
                        />
                    </td>
                    <td style={{ padding: "0.5rem", textAlign: "center", verticalAlign: "middle" }}>
                        <input
                            type="text"
                            style={{ width: "5rem", height: "3rem", padding: "0.5rem", textAlign: "center", margin: "0 auto" }}
                            value={temporary.total_price || ''}
                            onChange={(e) => setTemporary({ ...temporary, total_price: e.target.value })}
                        />
                    </td>
                </tr>
            )}

            </tbody>
            </table>
            {addItems && (
                <div className="botton-control" style={{display:"flex",justifyContent:"space-between",paddingTop:"4rem",paddingLeft:"1rem",paddingRight:"1rem"}}>
                    <button style={{border:"none",backgroundColor:"grey",borderRadius:"1rem",height:"3rem",width:"9rem"}}>
                        <span style={{color:"white",fontWeight:"600"}}>Cancel</span>
                    </button>
                    <button style={{border:"none",backgroundColor:"rgb(49,180,117)",borderRadius:"1rem",height:"3rem",width:"9rem"}} onClick={()=>{handleSave}}>
                        <span style={{color:"white",fontWeight:"600"}}>Save</span>
                    </button>
                </div>
            )}
        </div>
        </>
    )
}

export default PurchaseOrders;