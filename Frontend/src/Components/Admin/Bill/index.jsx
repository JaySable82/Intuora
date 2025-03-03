import React, { useEffect, useState } from 'react';
import axios from 'axios';

const url = import.meta.env.VITE_LOCAL;

const Bill = ({ onPlaceOrder, tableNo, blockNo }) => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await axios.get(`${url}/admin/bill`, {
          params: { tableNo, blockNo },
        });
        setCart(response.data.orders);
        let calculatedTotal = response.data.orders.reduce((acc, order) => acc + order.orders.total, 0);
        setTotal(calculatedTotal);
        console.log("Bill orders: ", response.data.orders);
      } catch (err) {
        console.log("Error in fetching the orders for billing.", err);
      }
    }

    fetchOrders();
  }, [tableNo, blockNo]);

  const handlePrint = async () => {
    try {
      await axios.delete(`${url}/admin/bill`, {
        params: { tableNo, blockNo },
      });
      console.log("Order deleted successfully");
      setCart([]);
      setTotal(0);
    } catch (err) {
      console.log("Error in deleting the orders.", err);
    }
  };

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

      {cart.length === 0 ? (
        <p style={{ color: '#666' }}>No items in cart.</p>
      ) : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse', borderTop: '1px solid #ccc' }}>
            <thead>
              <tr style={{ backgroundColor: '#e0e0e0', color: '#000' }}>
                <th style={{ textAlign: 'left', padding: '5px' }}>Item</th>
                <th style={{ textAlign: 'center', padding: '5px' }}>Qty</th>
                <th style={{ textAlign: 'right', padding: '5px' }}>Price</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((order) =>
                order.orders.items.map((item, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '5px', color: '#000' }}>{item.name}</td>
                    <td style={{ padding: '5px', textAlign: 'center', color: '#000' }}>{item.quantity}</td>
                    <td style={{ padding: '5px', textAlign: 'right', color: '#000' }}>
                      ₹{item.price * item.quantity}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: '1px solid #ccc' }}>
                <td style={{ padding: '5px', textAlign: 'left', fontWeight: 'bold' }}>Total</td>
                <td colSpan="2" style={{ padding: '5px', textAlign: 'right', fontWeight: 'bold' }}>
                  ₹{total}
                </td>
              </tr>
            </tfoot>
          </table>

          <button
            onClick={handlePrint}
            style={{
              position: 'absolute',
              bottom: '30px',
              right: '15px',
              padding: '15px',
              background: '#31B254',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '5px',
            }}
          >
            Print
          </button>
        </>
      )}
    </div>
  );
};

export default Bill;
