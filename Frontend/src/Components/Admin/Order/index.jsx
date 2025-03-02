import React from 'react';

const Orders = ({ orders }) => {
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
        Orders
      </h2>

      {orders.length === 0 ? (
        <p style={{ color: '#666' }}>No orders placed yet.</p>
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
            {/* Order Header: ID on the left, Table no. on the right */}
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
                  color: '#31B254', // Green
                  fontWeight: 'bold',
                }}
              >
                #{order.id}
              </h3>
              <h3
                style={{
                  margin: 0,
                  color: '#333',
                  fontWeight: 'normal',
                }}
              >
                Table no. {order.table}
                {order.block}
              </h3>
            </div>

            {/* Order Items */}
            <p style={{ margin: '5px 0', color: '#555' }}>
              {order.items
                .map((item) => `${item.quantity} x ${item.name}`)
                .join(', ')}
            </p>

            {/* Separator */}
            <hr style={{ margin: '10px 0', borderColor: '#e0e0e0' }} />

            {/* Total Row: "Total" on the left, amount on the right */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontWeight: 'bold', color: '#333' }}>Total</span>
              <span style={{ fontWeight: 'bold', color: '#333' }}>
                {order.total}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
