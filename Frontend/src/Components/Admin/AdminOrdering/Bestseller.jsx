// Bestseller.jsx
import React from "react";
import Slider from "react-slick";
import "./CommonFonts.css";

function Bestsellers({ title, Bestseller, cart = [], onBestsellerClick,tableno,blockNo,isOpen }) {
  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: isOpen ? 3 : 4,
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
    if(!tableno && !blockNo){
        alert("Please select table and seat");
        return;
    }
    onBestsellerClick(item, quantity);
  };

  return (
    <div style={{ marginTop: 20 }}>
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
                style={ isOpen ? {
                  width: "190px",
                  minWidth: "100px",
                  height: 100, // Adjusted height to fit content
                  background: "#FFFFFF",
                  borderRadius: 8,
                  margin: "0 10px 0", // Use margin to space cards
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  transition: "0.5s ease",
                }:{                        width: "190px",
                  minWidth: "100px",
                  height: 100,
                  background: "#FFFFFF",
                  borderRadius: 8,
                  margin: "0 10px 0 20px", // Slight different margin for closed state if needed
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  transition: "0.5s ease",}}
              >
                <div style={{
                  position: "relative",
                  color: "black",
                  fontSize: 18,
                  right: "40px",
                  top: "25px",
                  marginBottom: 25
                }}>
                  {item.name}
                </div>
                <div style={{ position: "relative", color: "black", fontSize: 18, right: "40px", top: "15px",textAlign:"left" }}>
                  {item.marathi} {/* Added second name */}
                </div>
                <div style={{ position: "relative", color: "black", fontSize: 20, marginTop: 5, right: "60px", top: "20px",textAlign:"left" }}>
                  ₹{item.price}
                </div>


                <div style={{ marginTop: 15 }}>
                  {quantity > 0 ? (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <button
                        style={{
                          position: "relative",
                          bottom:30,
                          left: 50,
                          width: 25 ,
                          height: 25,
                          borderRadius: 8,
                          backgroundColor: "#ffffff",
                          border: "2px solid lightgrey",
                          cursor: "pointer",
                        }}
                        onClick={() => handleClick(item, -1)}
                      >
                        -
                      </button>
                      <span style={{
                        position: "relative",
                        bottom:30,
                        left: 50,
                        margin: "0 10px" }}>{quantity}</span>
                      <button
                        style={{
                          position: "relative",
                          bottom:30,
                          left: 50,
                          width: 25,
                          height: 25,
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
                        position: "relative",
                        bottom:30,
                        left: 50,
                        width: 65,
                        height: 30,
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