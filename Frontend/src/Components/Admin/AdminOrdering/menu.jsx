// menu.jsx
import React from "react";
import list from "./data";
import Cards from "./Cards";
import "./CommonFonts.css";

function Menu({ handleClick, cart, sectionRefs, selectedTable,tableno ,blockNo,isOpen }) {
  const filterItems = (minId, maxId) => list.filter((item) => item.id >= minId && item.id <= maxId);

  const sections = [
    { ref: "Misal", minId: 1, maxId: 11, title: "Non-Grilled Sandwich" },
    { ref: "Extras", minId: 12, maxId: 18, title: "Grilled Sandwich" },
    { ref: "Snacks", minId: 19, maxId: 27, title: "Chocolate Sandwich" },
    { ref: "Beverages", minId: 36, maxId: 44, title: "Chocolate Sandwich" },
    { ref: "Desserts", minId: 28, maxId: 35, title: "Chocolate Sandwich" },
    { ref: "RTE", minId: 45, maxId: 47, title: "Chocolate Sandwich" },
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
              gridTemplateColumns: isOpen ? "repeat(2, auto)" : "repeat(4, auto)", // 3 columns
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