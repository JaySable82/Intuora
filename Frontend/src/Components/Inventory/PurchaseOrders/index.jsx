import React from "react";
import "./purchaseOrder.css";

function PurchaseOrders(){

    const rawMaterialData = [
        {item:"Salt",vendor:"AB Supplies",Invoice_No:"INV-202423",quantity:"100",unit_price:140,total_price:140},
        {item:"Salt",vendor:"AB Supplies",Invoice_No:"INV-202423",quantity:"100",unit_price:140,total_price:140},
        {item:"Salt",vendor:"AB Supplies",Invoice_No:"INV-202423",quantity:"100",unit_price:140,total_price:140},
        {item:"Salt",vendor:"AB Supplies",Invoice_No:"INV-202423",quantity:"100",unit_price:140,total_price:140},
        {item:"Salt",vendor:"AB Supplies",Invoice_No:"INV-202423",quantity:"100",unit_price:140,total_price:140},
        {item:"Salt",vendor:"AB Supplies",Invoice_No:"INV-202423",quantity:"100",unit_price:140,total_price:140},
        {item:"Salt",vendor:"AB Supplies",Invoice_No:"INV-202423",quantity:"100",unit_price:140,total_price:140},
        {item:"Salt",vendor:"AB Supplies",Invoice_No:"INV-202423",quantity:"100",unit_price:140,total_price:140},
        {item:"Salt",vendor:"AB Supplies",Invoice_No:"INV-202423",quantity:"100",unit_price:140,total_price:140},
        {item:"Salt",vendor:"AB Supplies",Invoice_No:"INV-202423",quantity:"100",unit_price:140,total_price:140},
        {item:"Salt",vendor:"AB Supplies",Invoice_No:"INV-202423",quantity:"100",unit_price:140,total_price:140},
        {item:"Salt",vendor:"AB Supplies",Invoice_No:"INV-202423",quantity:"100",unit_price:140,total_price:140},
        {item:"Salt",vendor:"AB Supplies",Invoice_No:"INV-202423",quantity:"100",unit_price:140,total_price:140},
        {item:"Salt",vendor:"AB Supplies",Invoice_No:"INV-202423",quantity:"100",unit_price:140,total_price:140},
        {item:"Salt",vendor:"AB Supplies",Invoice_No:"INV-202423",quantity:"100",unit_price:140,total_price:140},
        {item:"Salt",vendor:"AB Supplies",Invoice_No:"INV-202423",quantity:"100",unit_price:140,total_price:140},
    ];


    return(
        <>
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
                    <td>{row.Invoice_No}</td>
                    <td>{row.quantity}</td>
                    <td>{row.unit_price}</td>
                    <td>{row.total_price}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </>
    )
}

export default PurchaseOrders;