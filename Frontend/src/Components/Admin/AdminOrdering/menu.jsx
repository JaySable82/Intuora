// menu.jsx
import React from "react";
import list from "./data";
import Cards from "./Cards";
import "./CommonFonts.css";

function Menu({ handleClick, cart, sectionRefs, selectedTable,tableno ,blockNo,isOpen }) {
  const filterItems = (minId, maxId) => list.filter((item) => item.id >= minId && item.id <= maxId);

  const sections = [
    { ref: "veg unlimited", minId: 1, maxId: 23, title: "Non-Grilled Sandwich" },
    { ref: "veg limited", minId: 24, maxId: 79, title: "Grilled Sandwich" },
    { ref: "nonveg unlimited", minId: 80, maxId: 85, title: "Chocolate Sandwich" },
    { ref: "nonveg limited", minId: 86, maxId: 92, title: "Chocolate Sandwich" },
    { ref: "limited", minId: 93, maxId: 104, title: "Chocolate Sandwich" },
    { ref: "paratha", minId: 105, maxId: 123, title: "Chocolate Sandwich" },
  ];

  return (
    <div style={{ width: "100%", height: "100%", marginTop: 40 }}>
      <div
        style={{
          marginLeft: 24,
          marginBottom: 10,
          fontSize: 24,
          fontFamily: "Arial, sans-serif",
          fontWeight: "bold",
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
              gridTemplateColumns: isOpen ? "repeat(3, auto)" : "repeat(4, auto)", // 3 columns
              // gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", // Responsive grid
              gap: "20px",
              paddingTop: 20,
            }}
          >
            {filterItems(section.minId, section.maxId).map((item) => (
              <Cards key={item.id} item={item} handleClick={handleClick} cart={cart} selectedTable={selectedTable} tableno={tableno}  block={blockNo}  />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Menu;