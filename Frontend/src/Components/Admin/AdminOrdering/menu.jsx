// menu.jsx
import React from "react";
import list from "./data";
import Cards from "./Cards";
import "./CommonFonts.css";

function Menu({ handleClick, cart, sectionRefs }) {
  const filterItems = (minId, maxId) => list.filter((item) => item.id >= minId && item.id <= maxId);

  const sections = [
    { ref: "nongrilled", minId: 1, maxId: 9, title: "Non-Grilled Sandwich" },
    { ref: "grilled", minId: 10, maxId: 25, title: "Grilled Sandwich" },
    { ref: "chocolate", minId: 26, maxId: 29, title: "Chocolate Sandwich" },
  ];

  return (
    <div style={{ width: "100%", height: "100%", marginTop: 40 }}>
      <div
        style={{
          marginLeft: 24,
          fontSize: 24,
          fontFamily: "Arial, sans-serif",
        }}
      >
        Menu
      </div>
      {sections.map((section) => (
        <div
          key={section.ref}
          ref={sectionRefs[section.ref]}
          style={{ margin: "10px 24px" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", // Responsive grid
              gap: "20px",
              paddingTop: 20,
            }}
          >
            {filterItems(section.minId, section.maxId).map((item) => (
              <Cards key={item.id} item={item} handleClick={handleClick} cart={cart} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Menu;