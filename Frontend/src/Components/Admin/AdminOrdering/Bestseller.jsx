import React from "react";
import Slider from "react-slick";
import vegImage from "../../../assets/veg.png";
import "./CommonFonts.css";

function Bestsellers({ title, Bestseller, cart = [], onBestsellerClick }) {
  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1.5,
    slidesToScroll: 1,
  };

  // Always call onBestsellerClick when an item is clicked.
  const handleClick = (item, quantity) => {
    onBestsellerClick(item, quantity);
  };

  return (
    <div style={{ margintop: 20 }}>
      {/* Title */}
      <div
        style={{
          marginLeft: 24,
          marginTop: 100,
          color: "black",
          fontSize: 25,
          fontFamily: "Arial, sans-serif",
          position: "relative",
        }}
      >
        {title}
      </div>
      {/* Slider */}
      <Slider {...sliderSettings} style={{ marginLeft: 24, width: "90%" }}>
        {Bestseller.map((item) => {
          const cartItem = cart.find((cartItem) => cartItem.id === item.id);
          const quantity = cartItem ? cartItem.quantity : 0;

          return (
            <div key={item.id}>
              {/* Item Card */}
              <div
                style={{
                  width: 194,
                  height: 120,
                  background: "#EDECE9",
                  borderRadius: 8,
                  position: "relative",
                  marginTop: 30,
                }}
              >
                <img
                  src={item.img}
                  alt={item.name}
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 6,
                    position: "absolute",
                    left: 10,
                    top: 10,
                  }}
                />
                {/* Veg/Non-Veg Badge */}
                <div
                  style={{
                    position: "absolute",
                    left: 90,
                    top: 10,
                    color: "black",
                  }}
                >
                  <img
                    src={vegImage}
                    alt="veg"
                    style={{ height: 20, width: 20 }}
                  />
                </div>
                {/* Name */}
                <div
                  style={{
                    position: "absolute",
                    left: 90,
                    top: 30,
                    color: "black",
                  }}
                >
                  {item.name}
                </div>
                {/* Price */}
                <div
                  style={{
                    position: "absolute",
                    left: 90,
                    top: 70,
                    color: "black",
                  }}
                >
                  ₹{item.price}
                </div>
                {/* Add/Remove Button */}
                <div style={{ position: "absolute", left: 15, top: 85 }}>
                  {quantity > 0 ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        position: "relative",
                        right: 10,
                      }}
                    >
                      <button
                        style={{
                          width: 25,
                          height: 25,
                          borderRadius: 8,
                          backgroundColor: "#ffffff",
                          border: "2px solid lightgrey",
                          cursor: "pointer",
                          alignItems: "center",
                        }}
                        onClick={() => handleClick(item, -1)}
                      >
                        <p style={{ bottom: 1, position: "relative" }}>-</p>
                      </button>
                      <span style={{ margin: "0 10px" }}>{quantity}</span>
                      <button
                        style={{
                          width: 25,
                          height: 25,
                          borderRadius: 8,
                          backgroundColor: "#ffffff",
                          border: "2px solid lightgrey",
                          cursor: "pointer",
                          alignItems: "center",
                        }}
                        onClick={() => handleClick(item, 1)}
                      >
                        <p style={{ bottom: 1, position: "relative" }}>+</p>
                      </button>
                    </div>
                  ) : (
                    <button
                      style={{
                        width: 60,
                        height: 30,
                        borderRadius: 8,
                        backgroundColor: "#ffffff",
                        border: "2px solid lightgrey",
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
