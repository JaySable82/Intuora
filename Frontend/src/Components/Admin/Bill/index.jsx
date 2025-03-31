import React from 'react';
import axios from 'axios';
import { useEffect } from 'react';

const url = import.meta.env.VITE_AWS;

const Bill = ({
  cart,
  billData,
  billTotal,
  tableNo,
  blockNo,
  onClearLocalCart,
  placedorder,
  setPlacedOrder,
  setOrderedTableNo
}) => {
  // Function to update item quantity in the cart
  const updateCartItemQuantity = (item, newQuantity) => {
    // Implementation will be handled in parent component
    if (item.updateQuantity) {
      item.updateQuantity(newQuantity);
    }
  };

  function buildBlockString(selectedMain, selectedMulti) {
    // Convert the selectedMulti object into an array of active keys
    const multiKeys = Object.entries(selectedMulti)
      .filter(([_, isActive]) => isActive)
      .map(([key]) => key);
  
    if (selectedMain && multiKeys.length > 0) {
      // e.g. "A-AI" or "B-BO"
      return `${selectedMain}-${multiKeys.join("-")}`;
    } else if (selectedMain) {
      // e.g. "A" or "Full"
      return selectedMain;
    } else if (multiKeys.length > 0) {
      // e.g. "AI-AO" if no main seat is selected
      return multiKeys.join("-");
    }
    // If nothing is selected, return empty string
    return "";
  }


  

  // Function to handle place order
  const handlePlaceOrder = async () => {
    try {
      // 1. Ensure we have items in cart
      if (cart.length === 0) {
        alert("Please add items to the cart before placing an order");
        return;
      }
      if (!tableNo || !blockNo) {
        alert("Please select a table/block first!");
        return;
      }

      // 2. Build order data
      const orderData = {
        cart: cart.map((item) => ({
          ...item,
          marathi: item.marathi || "",
          parcel: item.parcel || false,
        })),
        total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        tableNo,
        blockNo,
      };
      // 3. Send order to DB
      const response = await axios.post('https://dinein.live/admin/cart', orderData);
      if (response.data) {
        console.log("Order placed successfully:", response.data);

        // 4. DO NOT clear the local cart here
        // (So the items remain in the bill)

        // 5. Optionally refresh the bill data from DB
        // fetchBillData && fetchBillData();

        alert("Order placed successfully!");
        setPlacedOrder(true); // Set placed order to true
        const tableBlock = `${tableNo}${blockNo}`;
        setOrderedTableNo(tableBlock); // Set the ordered table number
      }
    } catch (err) {
      console.error("Error in placing the order:", err);
      console.log("error response:", err.response);
      alert("Failed to place order. Please try again.");
    }
  };

  useEffect(() => {
    console.log("placedorder has updated:", placedorder);
  }, [placedorder]);

  // Function to clear all items LOCALLY ONLY
  const handleClear = async () => {
    // If combinedItems is empty, stop
    if (!combinedItems.length) {
      alert("No items to clear!");
      return;
    }
  
    // If no table or block, stop
    if (!tableNo || !blockNo) {
      alert("No table/block selected!");
      return;
    }
  
    if (window.confirm("Are you sure you want to CLEAR this orders")) {
      try {
        // 1) Call your new backend route
        await axios.post(`${url}/bedekar/dashboard`, {
          tableNo,
          blockNo
        });
  
        // 2) Also clear from local dictionary
        onClearLocalCart && onClearLocalCart();
      } catch (err) {
        console.error("Error clearing/archiving from DB:", err);
        alert("Order is cleard successfully! Try to refresh the page.");
      }
    }
  };

  const getAllItems = () => {
    const dbItems = billData.flatMap(order => order.orders.items);
    // Convert DB items to a dictionary keyed by `id`
    const dbMap = {};
    dbItems.forEach((dbItem) => {
      dbMap[dbItem.id] = {
        ...dbItem,
        fromBill: true,
        orderId: dbItem.orderId, // or something
      };
    });
  
    // Merge local cart items
    const merged = [];
    cart.forEach((localItem) => {
      if (dbMap[localItem.id]) {
        // If same ID is in DB, decide how to unify quantity
        const totalQty = Math.max(dbMap[localItem.id].quantity, localItem.quantity);

        merged.push({
          ...localItem,
          quantity: totalQty,
          fromBill: true, // or combine flags
        });
        // remove from dbMap so we don’t add it again
        delete dbMap[localItem.id];
      } else {
        // Not in DB, push local item
        merged.push(localItem);
      }
    });
  
    // Now push remaining DB items that didn't match local
    Object.keys(dbMap).forEach((id) => {
      merged.push(dbMap[id]);
    });
  
    return merged;
  };

  const combinedItems = getAllItems();
  const totalFromDb = billTotal;
const totalFromLocal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
const totalAmount = Math.max(totalFromDb, totalFromLocal);
  // const totalAmount =
  //   billTotal + cart.reduce((sum, item) => (sum + item.price * item.quantity), 0);

  console.log
    

  return (
    <div
      style={{
        width: "20%",
        top: 0,
        padding: "10px",
        background: "#F8F8FA",
        borderRadius: "10px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        fontFamily: "Arial, sans-serif",
        fontSize: 16,
        marginLeft: "auto",
        position: "relative",
      }}
    >
      <h2 style={{ fontSize: 20, marginBottom: 16, color: "#333" }}>Bill</h2>

      {(tableNo || blockNo) && (
        <p style={{ margin: "5px 0", color: "#666" }}>
          <strong>Table:</strong> {tableNo} {blockNo}
        </p>
      )}

      {combinedItems.length === 0 ? (
        <p style={{ color: "#666" }}>No items in cart.</p>
      ) : (
        <>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  borderTop: "1px solid #ccc",
                  borderBottom: "1px solid #ccc",
                }}
              >
                <th
                  style={{
                    textAlign: "left",
                    padding: "5px",
                    background: "#F8F8FA",
                  }}
                >
                  Item
                </th>
                <th
                  style={{
                    textAlign: "center",
                    padding: "5px",
                    background: "#F8F8FA",
                  }}
                >
                  Qty
                </th>
                <th
                  style={{
                    textAlign: "right",
                    padding: "5px",
                    background: "#F8F8FA",
                  }}
                >
                  Price
                </th>
              </tr>
            </thead>

            <tbody>
              {combinedItems.map((item, index) => (
                <tr key={`item-${index}`}>
                  <td style={{ padding: "5px", color: "#000" }}>{item.name}</td>
                  <td
                    style={{
                      padding: "5px",
                      textAlign: "center",
                      color: "#000",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {/* <button
                        onClick={() =>
                          updateCartItemQuantity(item, item.quantity - 1)
                        }
                        style={{
                          width: "25px",
                          height: "25px",
                          border: "1px solid #ccc",
                          cursor: "pointer",
                          borderRadius: "3px",
                          marginRight: "8px",
                        }}
                      >
                        -
                      </button> */}
                      {item.quantity}
                      {/* <button
                        onClick={() =>
                          updateCartItemQuantity(item, item.quantity + 1)
                        }
                        style={{
                          width: "25px",
                          height: "25px",
                          border: "1px solid #ccc",
                          cursor: "pointer",
                          borderRadius: "3px",
                          marginLeft: "8px",
                        }}
                      >
                        +
                      </button> */}
                    </div>
                  </td>
                  <td style={{ padding: "5px", textAlign: "right" }}>
                    ₹{item.price * item.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: "1px solid #ccc" }}>
                <td style={{ padding: "5px", textAlign: "left" }}>Total</td>
                <td colSpan="2" style={{ padding: "5px", textAlign: "right" }}>
                  ₹{totalAmount}
                </td>
              </tr>
            </tfoot>
          </table>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
              gap: "10px",
            }}
          >
            <button
              onClick={handleClear}
              style={{
                padding: "10px 15px",
                background: "#ffffff",
                color: "#000000",
                border: "1px solid #ccc",
                cursor: "pointer",
                borderRadius: "5px",
                flex: "1",
              }}
            >
              Clear
            </button>

            <button
              onClick={handlePlaceOrder}
              style={{
                padding: "10px 15px",
                background: "#31B254",
                color: "white",
                border: "none",
                cursor: "pointer",
                borderRadius: "5px",
                flex: "1",
              }}
            >
              Save Order
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Bill;
