import React from 'react';

const Bill = ({ cart, onPlaceOrder, onEditOrder, tableNo, blockNo }) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
      <h2
        style={{
          fontSize: 20,
          marginBottom: 16,
          color: '#333',
        }}
      >
        Bill
      </h2>

      {(tableNo || blockNo) && (
        <p style={{ margin: '5px 0', color: '#666' }}>
          <strong>Table:</strong> {tableNo}
          {blockNo}
        </p>
      )}

      {cart.length === 0 ? (
        <p style={{ color: '#666' }}>No items in cart.</p>
      ) : (
        <>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              borderTop: '1px solid #ccc',
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: '#e0e0e0',
                  color: '#000',
                }}
              >
                <th style={{ textAlign: 'left', padding: '5px' }}>Item</th>
                <th style={{ textAlign: 'center', padding: '5px' }}>Qty</th>
                <th style={{ textAlign: 'right', padding: '5px' }}>Price</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '5px', color: '#000', fontWeight: 'normal' }}>
                    {item.name}
                  </td>
                  <td
                    style={{
                      padding: '5px',
                      textAlign: 'center',
                      color: '#000',
                      fontWeight: 'normal',
                    }}
                  >
                    {item.quantity}
                  </td>
                  <td
                    style={{
                      padding: '5px',
                      textAlign: 'right',
                      color: '#000',
                      fontWeight: 'normal',
                    }}
                  >
                    ₹{item.price * item.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: '1px solid #ccc' }}>
                <td
                  style={{
                    padding: '5px',
                    textAlign: 'left',
                    fontWeight: 'bold',
                  }}
                >
                  Total
                </td>
                <td
                  colSpan="2"
                  style={{
                    padding: '5px',
                    textAlign: 'right',
                    fontWeight: 'bold',
                  }}
                >
                  ₹{total}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Print Button positioned a bit higher */}
          <button
            onClick={onPlaceOrder}
            style={{
              position: 'absolute',
              bottom: '30px', // increased from 15px to 30px for higher placement
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
