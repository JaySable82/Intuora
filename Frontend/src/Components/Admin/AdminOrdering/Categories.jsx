import React from "react";
import "./CommonFonts.css";

function Categories({ sectionRefs }) {
  const scrollHandler = (refKey) => {
    if (sectionRefs[refKey] && sectionRefs[refKey].current) {
      // Get the current scroll position and adjust the offset
      const targetElement = sectionRefs[refKey].current;
      const offset = 190; // Adjust this value to tweak the scroll position (in pixels)

      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;

      // Scroll with an offset to prevent going too far
      window.scrollTo({
        top: targetPosition - offset,
        behavior: "smooth",
      });
    } else {
      console.error(`Ref for ${refKey} is not defined.`);
    }
  };
  const categories = ["Misal", "Extras","Snacks", "Beverages","Desserts","RTE"];

  return (
    <div style={{ marginTop: 20,position:"sticky"  }}>
      <h2
        className="categories"
        style={{
          marginLeft: 24,
          marginBottom: 10,
          fontSize: 24,
          fontFamily: "Arial, sans-serif",
          fontWeight: "bold",
          
        }}
      >
        {/* Categories */}
      </h2>
      <div
        style={{
          position:"relative",
          display: "flex",
          justifyContent: "flex-start",
          gap: 10,
          left:10
        }}
      >
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() =>
              // scrollHandler(category.toLowerCase().replace(" ", ""))
              scrollHandler(category)
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