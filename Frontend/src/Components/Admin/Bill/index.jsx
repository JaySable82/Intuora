import React from 'react';
import axios from 'axios';

const url = import.meta.env.VITE_LOCAL;

const Bill = ({ cart, billData, billTotal, tableNo, blockNo, fetchBillData }) => {
  // Function to update item quantity in the cart
  const updateCartItemQuantity = (item, newQuantity) => {
    // Implementation will be handled in parent component
    if (item.updateQuantity) {
      item.updateQuantity(newQuantity);
    }
  };

  // Function to handle print action (previously handlePrint)
  const handlePrint = async () => {
    try {
      await axios.delete(`${url}/admin/bill`, {
        params: { tableNo, blockNo },
      });
      console.log("Order deleted successfully");
      fetchBillData(); // Refresh bill data after deleting
    } catch (err) {
      console.log("Error in deleting the orders.", err);
    }
  };

  // Function to clear all items
  const handleClear = () => {
    try {
      // Clear cart items - this will be implemented in parent component
      if (window.confirm("Are you sure you want to clear all items?")) {
        axios.delete(`${url}/admin/bill`, {
          params: { tableNo, blockNo },
        }).then(() => {
          console.log("Orders cleared successfully");
          fetchBillData(); // Refresh bill data after clearing
        });
      }
    } catch (err) {
      console.log("Error in clearing the orders.", err);
    }
  };

  // Combine bill items and cart items for display
  const getAllItems = () => {
    const billItems = billData.flatMap(order => 
      order.orders.items.map(item => ({
        ...item,
        fromBill: true,
        orderId: order.id
      }))
    );
    
    return [...billItems, ...cart];
  };

  const combinedItems = getAllItems();
  const totalAmount = billTotal + cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div
      style={{
        width: '25%',
        padding: '10px',
        background: '#ffffff',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Arial, sans-serif',
        fontSize: 16,
        marginLeft: 'auto',
        position: 'relative',
      }}
    >
      <h2 style={{ fontSize: 20, marginBottom: 16, color: '#333' }}>Bill</h2>

      {(tableNo || blockNo) && (
        <p style={{ margin: '5px 0', color: '#666' }}>
          <strong>Table:</strong> {tableNo} {blockNo}
        </p>
      )}

      {combinedItems.length === 0 ? (
        <p style={{ color: '#666' }}>No items in cart.</p>
      ) : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse'}}>
          <thead>
            <tr style={{
              borderTop: '1px solid #ccc', 
              borderBottom: '1px solid #ccc'
            }}>
              <th style={{ textAlign: 'left', padding: '5px', background: 'white' }}>Item</th>
              <th style={{ textAlign: 'center', padding: '5px', background: 'white' }}>Qty</th>
              <th style={{ textAlign: 'right', padding: '5px', background: 'white' }}>Price</th>
            </tr>
          </thead>

            <tbody>
              {combinedItems.map((item, index) => (
                <tr key={`item-${index}`}>
                  <td style={{ padding: '5px', color: '#000' }}>{item.name}</td>
                  <td style={{ padding: '5px', textAlign: 'center', color: '#000' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <button 
                        onClick={() => updateCartItemQuantity(item, item.quantity - 1)}
                        style={{ 
                          width: '25px', 
                          height: '25px', 
                          border: '1px solid #ccc',
                          cursor: 'pointer',
                          borderRadius: '3px',
                          marginRight: '8px'
                        }}
                      >
                        -
                      </button>
                      {item.quantity}
                      <button 
                        onClick={() => updateCartItemQuantity(item, item.quantity + 1)}
                        style={{ 
                          width: '25px', 
                          height: '25px', 
                          border: '1px solid #ccc',  
                          cursor: 'pointer',
                          borderRadius: '3px',
                          marginLeft: '8px'
                        }}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td style={{ padding: '5px', textAlign: 'right'}}>
                    ₹{item.price * item.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: '1px solid #ccc' }}>
                <td style={{ padding: '5px', textAlign: 'left'}}>Total</td>
                <td colSpan="2" style={{ padding: '5px', textAlign: 'right' }}>
                  ₹{totalAmount}
                </td>
              </tr>
            </tfoot>
          </table>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', gap: '10px' }}>
            <button
              onClick={handleClear}
              style={{
                padding: '10px 15px',
                background: '#ffffff',
                color: '#000000',
                border: '1px solid #ccc',
                cursor: 'pointer',
                borderRadius: '5px',
                flex: '1',
              }}
            >
              Clear
            </button>
            
            <button
              onClick={handlePrint}
              style={{
                padding: '10px 15px',
                background: '#31B254',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '5px',
                flex: '1',

              }}
            >
              Print
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Bill;