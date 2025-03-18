// Bestseller.jsx
import React from "react";
import Slider from "react-slick";
import "./CommonFonts.css";

function Bestsellers({ title, Bestseller, cart = [], onBestsellerClick }) {
  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const handleClick = (item, quantity) => {
    onBestsellerClick(item, quantity);
  };

  return (
    <div>
      <div
        style={{
          marginLeft: 24,
          fontSize: 24,
          fontFamily: "Arial, sans-serif",
          fontWeight: "bold",
        }}
      >
        {title}
      </div>
      <Slider {...sliderSettings} style={{ margin: "10px 24px", width: "90%" }}>
        {Bestseller.map((item) => {
          const cartItem = cart.find((cartItem) => cartItem.id === item.id);
          const quantity = cartItem ? cartItem.quantity : 0;

          return (
            <div key={item.id}>
              <div
                style={{
                  width: "90%",
                  minWidth: "200px",
                  height: 150, // Increased height to accommodate second name
                  background: "#FFFFFF",
                  borderRadius: 8,
                  position: "relative",
                  margin: "0 10px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <div style={{ color: "black", fontSize: 18, textAlign: "center" }}>
                  {item.name}
                </div>
                <div style={{ color: "black", fontSize: 18, textAlign: "center" }}>
                  {item.name} {/* Added second name */}
                </div>
                <div style={{ color: "black", fontSize: 16, marginTop: 5 }}>
                  ₹{item.price}
                </div>
                <div style={{ marginTop: 15 }}>
                  {quantity > 0 ? (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <button
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 8,
                          backgroundColor: "#ffffff",
                          border: "2px solid lightgrey",
                          cursor: "pointer",
                        }}
                        onClick={() => handleClick(item, -1)}
                      >
                        -
                      </button>
                      <span style={{ margin: "0 10px" }}>{quantity}</span>
                      <button
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 8,
                          backgroundColor: "#ffffff",
                          border: "2px solid lightgrey",
                          cursor: "pointer",
                        }}
                        onClick={() => handleClick(item, 1)}
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      style={{
                        width: 70,
                        height: 35,
                        borderRadius: 8,
                        backgroundColor: "#4CAF50",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                      }}
                      onClick={() => handleClick(item, 1)}
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
}

export default Bestsellers;