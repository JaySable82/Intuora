import React, { useState } from "react";
import list from "../../data";

const Card = () => {

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)", // 3 columns
        gap: "20px", // spacing between cards
        padding: "40px",
      }}
    >
      {list.map((item, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            borderRadius: "12px",
            top:"80px",
            right:"500px",
            padding: "10px", 
            boxShadow: "0 10px 10px rgba(0, 0, 0, 0.1)",
            position: "relative",
            height: "250px",
            width: "380px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
         
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                marginRight: "8px",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              ₹{item.price}
            </span>
            <ToggleButton />
          </div>

        
          <div>
            <h2
              style={{
                margin: "15px",
                fontSize: "25px",
                fontWeight: "bold",
                textAlign: "center",
                color: "#000",
              }}
            >
              {item.name}
            </h2>
            <p
              style={{
                fontSize: "15px",
                color: "#555",
                textAlign: "center",
                margin: "5px",
              }}
            >
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};


const ToggleButton = () => {
  const [isToggled, setIsToggled] = useState(false); 

  const handleToggle = () => {
    setIsToggled(!isToggled); 
  };

  return (
    <button
      onClick={handleToggle}
      style={{
        width: "50px",
        height: "25px",
        backgroundColor: isToggled ? "green" : "#ccc", 
        border: "none",
        borderRadius: "15px",
        position: "relative",
        cursor: "pointer",
        padding: 0,
      }}
    >
      <div
        style={{
          width: "20px",
          height: "20px",
          backgroundColor: "#ffffff",
          borderRadius: "50%",
          position: "absolute",
          top: "2.5px",
          left: isToggled ? "27px" : "2.5px", 
          transition: "left 0.3s ease",
        }}
      />
    </button>
  );
};

export default Card;