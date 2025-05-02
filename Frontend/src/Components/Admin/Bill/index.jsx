import React, { useEffect,useRef } from 'react';
import axios from 'axios';

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
  setOrderedTableNo,
  bills,
  setbills,
  setBillData,
  clearOrder, 
  setClearOrder,
  setIsDisabled,
  isDisabled
}) => {
  // Build a unique key for the current table-block
  const key = tableNo && blockNo ? `${tableNo}-${blockNo}` : null;
  const hasInitializedRef = useRef({});

  // 1. Retrieve the current bill array for the selected table-block
  const getCurrentBill = () => {
    console.log("weeee"+tableNo+"weeee"+blockNo);
    if (!key) return [];
    return bills[key] || [];
  };

  // 2. Overwrite the current bill array in the dictionary
  const updateCurrentBill = (newItems) => {
    if (!key) return;
    setbills((prev) => ({
      ...prev,
      [key]: newItems,
    }));
  };

  useEffect(() => {
    const fetchAndInitialize = async () => {
      console.log("useEffect triggered");
  
      if (
        key &&
        !hasInitializedRef.current[key] &&
        (!bills[key] || bills[key].length === 0)
      ) {
        try {
          const response = await fetch(`${url}/admin/tbbills?tableNo=${tableNo}&blockNo=${blockNo}`);
          const data = await response.json();
  
          if (data && data.length > 0) {
            const dbItems = data.flatMap(order =>
              order.orders.items.map(item => ({
                ...item,
                fromBill: true,
                orderId: item.orderId,
                updateQuantity: (finalQty) => {
                  const diff = finalQty - item.quantity;
                  updateBillItems(item, diff);
                },
              }))
            );
  
            updateCurrentBill(dbItems);
            hasInitializedRef.current[key] = true;
          }
        } catch (error) {
          console.error("Error fetching table order:", error);
        }
      }
    };
  
    fetchAndInitialize();
  }, [key, bills,clearOrder]);
  
  
  // Function to update bill items (for editing quantity)
  const updateBillItems = (item, change) => {
    
    if (!blockNo || !tableNo) {
      alert("Please select table and seat first!");
      return;
    }
    
    const currentBill = getCurrentBill();
    const existingItem = currentBill.find((it) => it.id === item.id);
    let newBill;
    
    if (!existingItem && change > 0) {
      newBill = [
        ...currentBill,
        {
          ...item,
          quantity: change,
          updateQuantity: (finalQty) => {
            const diff = finalQty - change;
            updateBillItems(item, diff);
          },
        },
      ];
    } else if (existingItem) {
      const newQuantity = existingItem.quantity + change;
      if (newQuantity <= 0) {
        newBill = currentBill.filter((it) => it.id !== item.id);
      } else {
        newBill = currentBill.map((it) =>
          it.id === item.id
            ? {
                ...it,
                quantity: newQuantity,
                updateQuantity: (finalQty) => {
                  const diff = finalQty - newQuantity;
                  updateBillItems(item, diff);
                },
              }
            : it
        );
      }
    } else {
      return;
    }
    setIsDisabled(false);
    updateCurrentBill(newBill);
  };

  const handlePlaceOrder = async () => {
    try {
      if (getCurrentBill().length === 0) {
        alert("Please add items to the cart before placing an order");
        return;
      }
      if (!tableNo || !blockNo) {
        alert("Please select a table/block first!");
        return;
      }
      
      const currentBill = getCurrentBill();
      console.log("Before update ",currentBill);
      const orderData = {
        cart: currentBill.map((item) => ({
          ...item,
          marathi: item.marathi || "",
          parcel: item.parcel || false,
        })),
        total: currentBill.reduce((sum, item) => sum + item.price * item.quantity, 0),
        tableNo,
        blockNo,
      };
      console.log("After update",orderData);
      try {
        await axios.delete(`${url}/admin/bill`, {
          data: { tableNo, blockNo }  // ✅ Correct way to send body in DELETE
        });
  
        // ✅ Clear local bill after successful response
        updateCurrentBill([]);
        setBillData([]);
        setClearOrder(true);
        if (onClearLocalCart) onClearLocalCart();
        updateCurrentBill([]);
        setBillData([]);
        if (onClearLocalCart) onClearLocalCart();
  
      } catch (err) {
        if (err.response && err.response.status === 404) {
          console.warn("No matching orders in DB, but clearing locally.");
          updateCurrentBill([]);
          setBillData([]);
          if (onClearLocalCart) onClearLocalCart();
        } else {
          console.error("Error clearing/archiving from DB:", err);
          alert("Failed to clear order. Please try again.");
        }
      }
      const response = await axios.post(`${url}/admin/cart`, orderData);
      if (response.data) {
        console.log("Order placed successfully:", response.data);
        // setPlacedOrder(true);
        // const tableBlock = `${tableNo}${blockNo}`;
        // setOrderedTableNo(tableBlock);
        // setIsDisabled(true);
        updateCurrentBill(orderData.cart); // or use response.data.cart if returned
      setBillData(orderData.cart);
      setPlacedOrder(true);
      const tableBlock = `${tableNo}${blockNo}`;
      setOrderedTableNo(tableBlock);
      setIsDisabled(true);
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

  // const handleClear = async () => {
  //   const currentBill = getCurrentBill();
  //   if (!currentBill.length) {
  //     alert("No items to clear!");
  //     return;
  //   }
  //   if (!tableNo || !blockNo) {
  //     alert("No table/block selected!");
  //     return;
  //   }
  //   if (window.confirm("Are you sure you want to CLEAR these orders")) {
  //     try {
  //       await axios.post(`${url}/bedekar/dashboard`, {
  //         tableNo,
  //         blockNo
  //       });
  //       // Clear the local bill immediately
  //       updateCurrentBill([]);
  //       setBillData([]); // Clear fetched data as well
  //       onClearLocalCart && onClearLocalCart();
  //     } catch (err) {
  //       console.error("Error clearing/archiving from DB:", err);
  //       alert("Order cleared successfully! Try refreshing the page.");
  //     }
  //   }
  // };



  // Use only the local bill data for this table-block
  
  const handleClear = async () => {
    const currentBill = getCurrentBill();
    if (!currentBill.length) {
      alert("No items to clear!");
      return;
    }
    if (!tableNo || !blockNo) {
      alert("No table/block selected!");
      return;
    }
    if (window.confirm("Are you sure you want to CLEAR these orders")) {
      try {
        await axios.delete(`${url}/admin/bill`, {
          data: { tableNo, blockNo }  // ✅ Correct way to send body in DELETE
        });
  
        // ✅ Clear local bill after successful response
        updateCurrentBill([]);
        setBillData([]);
        setClearOrder(true);
        if (onClearLocalCart) onClearLocalCart();
        updateCurrentBill([]);
        setBillData([]);
        if (onClearLocalCart) onClearLocalCart();
  
      } catch (err) {
        if (err.response && err.response.status === 404) {
          console.warn("No matching orders in DB, but clearing locally.");
          updateCurrentBill([]);
          setBillData([]);
          if (onClearLocalCart) onClearLocalCart();
        } else {
          console.error("Error clearing/archiving from DB:", err);
          alert("Failed to clear order. Please try again.");
        }
      }
    }
  };
  
  
  const combinedItems = getCurrentBill();
  const totalAmount = combinedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
        marginBottom: 20,
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
              <tr style={{ borderTop: "1px solid #ccc", borderBottom: "1px solid #ccc" }}>
                <th style={{ textAlign: "left", padding: "5px", background: "#F8F8FA" }}>
                  Item
                </th>
                <th style={{ textAlign: "center", padding: "5px", background: "#F8F8FA" }}>
                  Qty
                </th>
                <th style={{ textAlign: "right", padding: "5px", background: "#F8F8FA" }}>
                  Price
                </th>
              </tr>
            </thead>
            <tbody>
            {combinedItems.map((item, index) => (
                <tr key={`item-${index}`}>
                  <td style={{ padding: "5px", color: "#000" }}>{item.name}</td>
                  <td style={{ padding: "5px", textAlign: "center", color: "#000" }}>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                      <button
                        onClick={() => updateBillItems(item, -1)}
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
                      </button>
                      {item.quantity}
                      <button
                        onClick={() => updateBillItems(item, 1)}
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
                      </button>
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
              onClick={isDisabled ? () => {} : handlePlaceOrder} // Prevent click when disabled
              disabled={isDisabled}
              style={{
                padding: "10px 15px",
                background: isDisabled ? "#999" : "#31B254", // Gray out the button when disabled
                color: "white",
                border: "none",
                cursor: isDisabled ? "not-allowed" : "pointer", // Change cursor when disabled
                borderRadius: "5px",
                flex: "1",
                opacity: isDisabled ? 0.7 : 1, // Optional: Add opacity change for visual feedback
              }}
            >
              {isDisabled ? "Order saved" : "Save Order"} {/* Update text while disabled */}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Bill;