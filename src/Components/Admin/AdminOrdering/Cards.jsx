function Cards({ item, handleClick, cart, selectedTable,tableno, blockNo }) {
  const cartItem = cart.find((cartItem) => cartItem.id === item.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const onItemClick = (item, delta) => {
    // Prevent adding if table or seat is not selected

    if (!tableno && !blockNo) {
      alert("Please select table and seat first");
      return;
    }
    // Otherwise, call the parent's handleClick
    handleClick(item, delta);
  };

  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 8,
        padding: 15,
        display: "flex",
        flexDirection: "column",
        // minWidth: "20px",
        width: 220,
        height: 120,
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <div style={{ textAlign: "left" }}> {/* Changed from center to left */}
        <div style={{ fontSize: 18, color: "black" }}>{item.name}</div>
        <div style={{ fontSize: 18, color: "black", marginTop: 10 }}>
          {item.marathi}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <div style={{position:"relative",bottom :15, fontSize: 20, color: "black" }}>₹{item.price}</div>
        <div>
          {quantity > 0 ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              <button
                style={{
                  position: "relative",
                  bottom: 15,
                  left: 5,
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  backgroundColor: "#ffffff",
                  border: "2px solid lightgrey",
                  cursor: "pointer",
                  marginRight: 5,
                }}
                onClick={() => handleClick(item, -1)}
              >
                -
              </button>
              <span style={{
                margin: "0 10px", position: "relative",
                bottom: 15,
                left: 5,
              }}>{quantity}</span>
              <button
                style={{
                  position: "relative",
                  bottom: 15,
                  left: 5,
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  backgroundColor: "#ffffff",
                  border: "2px solid lightgrey",
                  cursor: "pointer",
                  marginLeft: 5,
                }}
                onClick={() => handleClick(item, 1)}
              >
                +
              </button>
            </div>
          ) : (
            <button
              style={{
                position: "relative",
                bottom: 15,
                left: 5,
                width: 70,
                height: 35,
                borderRadius: 8,
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => onItemClick(item, 1)}
            >
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cards;