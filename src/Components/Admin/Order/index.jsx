import React, { useEffect, useState } from 'react';
import axios from 'axios';

const url = import.meta.env.VITE_AWS;

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await axios.get(`${url}/bedekar/orders`);
        setOrders(response.data);
        console.log("Fetched Orders: ", response.data);
      } catch (err) {
        console.log("Error in fetching the orders.", err);
      }
    }

    fetchOrders();
  }, []);

  return (
    <div
      style={{
        width: '25%',
        padding: '10px',
        background: '#ffffff',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h2
        style={{
          fontSize: 20,
          marginBottom: 16,
          color: '#333',
        }}
      >
        
      </h2>

      {orders.length === 0 ? (
        <p style={{ color: '#666' }}></p>
      ) : (
        orders.map((order, index) => (
          <div
            key={index}
            style={{
              background: '#f9f9f9',
              padding: '10px',
              marginBottom: '10px',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
              }}
            >
              <h3
                style={{
                  margin: 0,
                  color: '#31B254',
                  fontWeight: 'bold',
                }}
              >
                #{order.orders.token}
              </h3>
              <h3
                style={{
                  margin: 0,
                  color: '#333',
                  fontWeight: 'normal',
                }}
              >
                Table no. {order.tableNo} {order.blockNo}
              </h3>
            </div>

            <p style={{ margin: '5px 0', color: '#555' }}>
              {order.orders.items.map((item) => `${item.quantity} x ${item.name}`).join(', ')}
            </p>

            <hr style={{ margin: '10px 0', borderColor: '#e0e0e0' }} />

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontWeight: 'bold', color: '#333' }}>Total</span>
              <span style={{ fontWeight: 'bold', color: '#333' }}>₹{order.orders.total}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;