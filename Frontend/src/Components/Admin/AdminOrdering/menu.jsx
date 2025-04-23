import React from "react";
import list from "./data";
import Cards from "./Cards";
import "./CommonFonts.css";

function Menu({ handleClick, cart, sectionRefs, selectedTable, tableno, blockNo, isOpen }) {
  const filterItems = (minId, maxId) => list.filter((item) => item.id >= minId && item.id <= maxId);

  const sections = [
    { ref: "Misal", minId: 1, maxId: 12, title: "Misal" },
    { ref: "Extras", minId: 13, maxId: 20, title: "Extras" },
    { ref: "Snacks", minId: 21, maxId: 33, title: "Snacks" },
    { ref: "Desserts", minId: 34, maxId: 40, title: "Desserts" },
    { ref: "Beverages", minId: 41, maxId: 50, title: "Beverages" },
    { ref: "RTE", minId: 51, maxId: 53, title: "Ready to Eat (RTE)" },
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
        {/* Menu */}
      </div>
      {sections.map((section) => (
        <div
          key={section.ref}
          ref={sectionRefs[section.ref]}
          style={{ margin: "10px 24px" }}
        >
          {/* Section Title */}
          <div
            style={{
          marginLeft: 4,
          marginBottom: 10,
          fontSize: 24,
          fontFamily: "Arial, sans-serif",
          fontWeight: "bold",
            }}
          >
            {section.title}
          </div>

          {/* Card Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isOpen ? "repeat(3, auto)" : "repeat(4, auto)",
              gap: "20px",
              paddingTop: 20,
            }}
          >
            {filterItems(section.minId, section.maxId).map((item) => (
              <Cards
                key={item.id}
                item={item}
                handleClick={handleClick}
                cart={cart}
                selectedTable={selectedTable}
                tableno={tableno}
                block={blockNo}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Menu;
