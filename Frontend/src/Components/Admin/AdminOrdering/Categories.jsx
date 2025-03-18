// Categories.jsx
import React from "react";
import "./CommonFonts.css";

function Categories({ sectionRefs }) {
  const scrollHandler = (refKey) => {
    if (sectionRefs[refKey]?.current) {
      sectionRefs[refKey].current.scrollIntoView({ behavior: "smooth" });
    } else {
      console.error(`Ref for ${refKey} is not defined.`);
    }
  };

  const categories = ["Non Grilled", "Grilled", "Chocolate"];

  return (
    <div style={{ marginTop: 20 }}>
      <h2
        className="categories"
        style={{
          marginLeft: 24,
          fontSize: 24,
          fontFamily: "Arial, sans-serif",
          fontWeight: "bold",
        }}
      >
        Categories
      </h2>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          gap: 15,
          margin: "15px 24px",
        }}
      >
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() =>
              scrollHandler(category.toLowerCase().replace(" ", ""))
            }
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              backgroundColor: "#ffffff",
              border: "1px solid lightgrey",
              cursor: "pointer",
              fontSize: 16,
              fontFamily: "Arial, sans-serif",
            }}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Categories;