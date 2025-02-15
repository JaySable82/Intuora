import React, { useEffect, useRef, useState } from "react";
import "./purchaseOrder.css";
import SearchBar from "../SearchBar";
import axios from "axios";

function PurchaseOrders() {
  const [purchaseOrdersList, setPurchaseOrdersList] = useState([]);
  const [purchaseOrdersListCopy,setPurchaseOrdersListCopy]=useState([]);
  const [addItems, setAddItems] = useState(false);
  const [updateItems,setUpdateItems]=useState(false);
  const url = import.meta.env.VITE_AWS_MAIN;
  const hasFetchedRef=useRef(false);
  const [temporary, setTemporary] = useState({
    item: "",
    quantity: 0,
    unit_price: 0,   
    total_price: 0,
    vendor: "",
    invoice_no: "",
  });
  

  useEffect(() => {
    if(hasFetchedRef.current){
        return;
    }
    hasFetchedRef.current=true;
    async function fetchOrders() {
      try {
        const response = await axios.get(`${url}/purchase-orders`);
        console.log("Purchase orders: ", response.data);
        setPurchaseOrdersList(prevList => [...prevList, ...response.data]);
        console.log("Final data: ", response.data);
      } catch (error) {
        console.log("Error in fetching the elements at the frontend");
      }
    }
    fetchOrders();
  }, []);

  async function handleSave() {
        console.log("temporary: ", temporary);
        setPurchaseOrdersList(prevList => [...prevList, temporary]);

        try {
        const response = await axios.post(`${url}/purchase-orders/upload`, { temporary });  // Wrap in an object
        console.log("Data sent successfully: ", response);
        } catch (err) {
        console.log("Error in sending the temporary row", err);
        }

        setTemporary({
        item: "",
        quantity: 0,
        unit_price: 0,   
        total_price: 0,
        vendor: "",
        invoice_no: "",
        });

        setAddItems(false);
    }

  

  async function handleSave2() {
    try {
      const response = await axios.put(`${url}/purchase-orders/update`, {
        purchaseOrdersList,
      });
      console.log("Updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating purchase orders:", error);
    }
    setUpdateItems(false);
  }
  

  return (
    <>
      <div
        className="control-panel"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          padding: '1rem',
          paddingLeft: '4rem',
          paddingRight: '4rem',
          paddingTop: '1rem'
        }}
      >
        <div>
        <SearchBar style={addItems || updateItems ? { filter: "blur(3px)" } : {}} />
        </div>
        <div
          className="right-side-buttons"
          style={{
            display: "flex",
            justifyContent: "space-around",
            gap: "3rem",
            marginRight: "0rem"
          }}
        >
          <button
            style={{
              display: addItems || updateItems ? "none":"block",
              border: "none",
              backgroundColor: "rgb(49,180,117)",
              borderRadius: "1rem",
              height: "3rem",
              width: "9rem"
            }}
            onClick={() => {
              setAddItems(true);
            }}
          >
            <span style={{ color: "white", fontWeight: "600" }}>New Order</span>
          </button>
          <button
            style={{
              display: addItems || updateItems ? "none":"block",
              border: "none",
              backgroundColor: "rgb(49,180,117)",
              borderRadius: "1rem",
              height: "3rem",
              width: "9rem"
            }}
            onClick={()=>{
                setUpdateItems(true);
                setPurchaseOrdersListCopy(purchaseOrdersList);
            }}
          >
            <span style={{ color: "white", fontWeight: "600" }}>Edit Order</span>
          </button>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: "10rem" }}>
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
            {!updateItems && (
                purchaseOrdersList.map((row, index) => (
                <tr key={index} style={{ borderBottomWidth: "1px" }}>
                    <td>{row.item}</td>
                    <td>{row.vendor}</td>
                    <td>{row.invoice_no}</td>
                    <td>{row.quantity}</td>
                    <td>Rs. {row.unit_price}</td>
                    <td>Rs. {row.total_price}</td>
                </tr>
                ))
            )}
            
            {updateItems && (
                
                purchaseOrdersList.map((row, index) => (
              <tr key={row._id} style={{ borderBottomWidth: "1px" }}>
                <td style={{ padding: "0.5rem", textAlign: "center", verticalAlign: "middle" }}>
                <input type="text" value={row.item} style={{ width: "6rem", height: "3rem", padding: "0.5rem", textAlign: "center", margin: "0 auto" }} onChange={(e)=>{const newOrdersList=[...purchaseOrdersList];
                                        newOrdersList[index]={...newOrdersList[index],item:e.target.value};
                                        setPurchaseOrdersList(newOrdersList);
                                        }} /></td>
                <td style={{ padding: "0.5rem", textAlign: "center", verticalAlign: "middle" }}>
                <input type="text" value={row.vendor} style={{ width: "8rem", height: "3rem", padding: "0.5rem", textAlign: "center", margin: "0 auto" }} onChange={(e)=>{const newOrdersList=[...purchaseOrdersList];
                                        newOrdersList[index]={...newOrdersList[index],vendor:e.target.value};
                                        setPurchaseOrdersList(newOrdersList);
                                        }} /></td>                                                        
                <td style={{ padding: "0.5rem", textAlign: "center", verticalAlign: "middle" }}>
                <input type="text" value={row.invoice_no} style={{ width: "9rem", height: "3rem", padding: "0.5rem", textAlign: "center", margin: "0 auto" }} onChange={(e)=>{const newOrdersList=[...purchaseOrdersList];
                                        newOrdersList[index]={...newOrdersList[index],invoice_no:e.target.value};
                                        setPurchaseOrdersList(newOrdersList);
                                        }} /></td>
                <td style={{ padding: "0.5rem", textAlign: "center", verticalAlign: "middle" }}>
                <input type="number" value={row.quantity} style={{ width: "5rem", height: "3rem", padding: "0.5rem", textAlign: "center", margin: "0 auto" }} onChange={(e)=>{const newOrdersList=[...purchaseOrdersList];
                                        newOrdersList[index]={...newOrdersList[index],quantity:e.target.value};
                                        setPurchaseOrdersList(newOrdersList);
                                        }} /></td>
                <td style={{ padding: "0.5rem", textAlign: "center", verticalAlign: "middle" }}> 
                <input type="number" value={row.unit_price} style={{ width: "5rem", height: "3rem", padding: "0.5rem", textAlign: "center", margin: "0 auto" }} onChange={(e)=>{const newOrdersList=[...purchaseOrdersList];
                                        newOrdersList[index]={...newOrdersList[index],unit_price:e.target.value};
                                        setPurchaseOrdersList(newOrdersList);
                                        }} /></td>
                <td style={{ padding: "0.5rem", textAlign: "center", verticalAlign: "middle" }}>
                <input type="number" value={row.total_price} style={{ width: "5rem", height: "3rem", padding: "0.5rem", textAlign: "center", margin: "0 auto" }} onChange={(e)=>{const newOrdersList=[...purchaseOrdersList];
                                    newOrdersList[index]={...newOrdersList[index],total_price:e.target.value};
                                    setPurchaseOrdersList(newOrdersList);
                                    }} /></td>
              </tr>
            )))}

            {addItems && (
              <tr style={{ borderBottomWidth: "1px" }}>
                <td style={{ padding: "0.5rem", textAlign: "center", verticalAlign: "middle" }}>
                  <input
                    type="text"
                    style={{ width: "6rem", height: "3rem", padding: "0.5rem", textAlign: "center", margin: "0 auto" }}
                    value={temporary.item}
                    onChange={(e) => setTemporary({ ...temporary, item: e.target.value })}
                  />
                </td>
                <td style={{ padding: "0.5rem", textAlign: "center", verticalAlign: "middle" }}>
                  <input
                    type="text"
                    style={{ width: "8rem", height: "3rem", padding: "0.5rem", textAlign: "center", margin: "0 auto" }}
                    value={temporary.vendor}
                    onChange={(e) => setTemporary({ ...temporary, vendor: e.target.value })}
                  />
                </td>
                <td style={{ padding: "0.5rem", textAlign: "center", verticalAlign: "middle" }}>
                  <input
                    type="text"
                    style={{ width: "9rem", height: "3rem", padding: "0.5rem", textAlign: "center", margin: "0 auto" }}
                    value={temporary.invoice_no}
                    onChange={(e) => setTemporary({ ...temporary, invoice_no: e.target.value })}
                  />
                </td>
                <td style={{ padding: "0.5rem", textAlign: "center", verticalAlign: "middle" }}>
                  <input
                    type="number"
                    style={{ width: "5rem", height: "3rem", padding: "0.5rem", textAlign: "center", margin: "0 auto" }}
                    value={temporary.quantity===0?"":temporary.quantity}
                    onChange={(e) => setTemporary({ ...temporary, quantity: Number(e.target.value) })}
                  />
                </td>
                <td>
                <input
                    type="number"
                    value={temporary.unit_price===0?"":temporary.unit_price}
                    style={{ width: "5rem", height: "3rem", padding: "0.5rem", textAlign: "center", margin: "0 auto" }}
                    onChange={(e) => {
                    const value = e.target.value === 0 ? 0 : Number(e.target.value);
                    setTemporary({ ...temporary, unit_price: value });
                    }}
                />
                </td>

                <td>
                <input
                    type="number"
                    value={temporary.total_price===0?"":temporary.total_price}
                    style={{ width: "5rem", height: "3rem", padding: "0.5rem", textAlign: "center", margin: "0 auto" }}
                    placeholder={temporary.quantity && temporary.unit_price ? temporary.quantity * temporary.unit_price : ""}
                    onChange={(e) => {
                    const value = e.target.value === "" ? 0 : Number(e.target.value);
                    setTemporary({ ...temporary, total_price: value });
                    }}
                />
                </td>

              </tr>
            )}
          </tbody>
        </table>
        {addItems && (
          <div className="botton-control" style={{ display: "flex", justifyContent: "space-between", paddingTop: "4rem", paddingLeft: "1rem", paddingRight: "1rem" }}>
            <button style={{ border: "none", backgroundColor: "grey", borderRadius: "1rem", height: "3rem", width: "9rem" }} onClick={()=>{setAddItems(false)}}>
              <span style={{ color: "white", fontWeight: "600", fontSize:"x-large" }}>Cancel</span>
            </button>
            <button
              style={{
                border: "none",
                backgroundColor: "rgb(49,180,117)",
                borderRadius: "1rem",
                height: "3rem",
                width: "9rem"
              }}
              onClick={() => {
                handleSave();
              }}
            >
              <span style={{ color: "white", fontWeight: "600", fontSize:"x-large"}}>Save</span>
            </button>
          </div>
        )}
        {updateItems && (
          <div className="botton-control" style={{ display: "flex", justifyContent: "space-between", paddingTop: "4rem", paddingLeft: "1rem", paddingRight: "1rem" }}>
            <button style={{ border: "none", backgroundColor: "grey", borderRadius: "1rem", height: "3rem", width: "9rem" }} onClick={()=>{setPurchaseOrdersList(purchaseOrdersListCopy);
            setUpdateItems(false)}}>
              <span style={{ color: "white", fontWeight: "600", fontSize:"x-large"  }}>Cancel</span>
            </button>
            <button
              style={{
                border: "none",
                backgroundColor: "rgb(49,180,117)",
                borderRadius: "1rem",
                height: "3rem",
                width: "9rem"
              }}
              onClick={() => {
                handleSave2();
              }}
            >
              <span style={{ color: "white", fontWeight: "600", fontSize:"x-large"  }}>Save</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default PurchaseOrders;
