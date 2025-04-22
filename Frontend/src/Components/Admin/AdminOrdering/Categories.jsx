import React from "react";
import "./CommonFonts.css";

function Categories({ sectionRefs }) {
  const scrollHandler = (refKey) => {
    // if (sectionRefs[refKey]?.current) {
    //   sectionRefs[refKey].current.scrollIntoView({ behavior: "smooth" });
    // } else {
    //   console.error(`Ref for ${refKey} is not defined.`);
    // }

    if (sectionRefs[refKey] && sectionRefs[refKey].current) {
      sectionRefs[refKey].current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      console.error(`Ref for ${refKey} is not defined.`);
    }
  
  };

  const categories = ["Veg Unlimited", "Veg Limited", "Non-Veg Unlimited","Non-Veg Limited","Limited","Rice","Paratha"];

  return (
    <div style={{ marginTop: 20  }}>
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
        Categories
      </h2>
      <div
        style={{
          position:"relative",
          display: "flex",
          justifyContent: "flex-start",
          gap: 5,
          left:5
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
              borderRadius: 10,
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