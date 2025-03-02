import React from "react";

const sideSectionStyle = {
  position: "fixed",
  top: "12rem",
  left: 0,
  height: "calc(100% - 12rem)",
  width: "250px",
  backgroundColor: "#fff",
  boxShadow: "2px 0 5px rgba(0, 0, 0, 0.2)",
  transform: "translateX(-100%)",
  transition: "transform 0.3s ease-in-out",
  zIndex: 9999,
};

const sideSectionOpenStyle = {
  transform: "translateX(0)",
};

const closeButtonStyle = {
  display: "block",
  marginLeft: "auto",
  marginRight: "10px",
  marginTop: "10px",
  padding: "6px 12px",
  backgroundColor: "#ddd",
  border: "none",
  cursor: "pointer",
};

const titleStyle = {
  margin: "20px",
};

const buttonContainerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  margin: "20px",
};

function getBlockStyle(tableNo, blockLetter, blockStatus) {
  if (!tableNo) {
    return {
      width: "80px",
      height: "80px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "1.5rem",
      backgroundColor: "#f2f2f2",
      border: "1px solid #ccc",
      cursor: "pointer",
      borderRadius: "4px",
    };
  }

  const key = `${tableNo}${blockLetter}`;
  const status = blockStatus[key] || null;

  let style = {
    width: "80px",
    height: "80px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5rem",
    backgroundColor: "#f2f2f2",
    border: "1px solid #ccc",
    cursor: "pointer",
    borderRadius: "4px",
  };

  switch (status) {
    case "selected":
      style.backgroundColor = "#fff";
      style.color = "#31B254";
      style.border = "2px solid #31B254";
      break;
    case "ordered":
      style.backgroundColor = "#C0C0C0";
      style.color = "#000";
      style.border = "none";
      break;
    case "editing":
      style.backgroundColor = "#fff";
      style.color = "#000";
      style.border = "2px solid #000";
      break;
    default:
      break;
  }

  return style;
}

function SideSection({ isOpen, onClose, selectedTable, onBlockSelect, blockStatus }) {
  const handleBlockClick = (block) => {
    if (onBlockSelect) {
      onBlockSelect(block);
    }
  };

  return (
    <div
      style={{
        ...sideSectionStyle,
        ...(isOpen ? sideSectionOpenStyle : {}),
      }}
    >
      <button style={closeButtonStyle} onClick={onClose}>
        Close
      </button>

      {selectedTable && (
        <div style={titleStyle}>
          <h2>Selected Table: {selectedTable}</h2>
        </div>
      )}

      <div style={buttonContainerStyle}>
        <button
          style={getBlockStyle(selectedTable, "A", blockStatus)}
          onClick={() => handleBlockClick("A")}
        >
          A
        </button>
        <button
          style={getBlockStyle(selectedTable, "B", blockStatus)}
          onClick={() => handleBlockClick("B")}
        >
          B
        </button>
        <button
          style={getBlockStyle(selectedTable, "C", blockStatus)}
          onClick={() => handleBlockClick("C")}
        >
          C
        </button>
        <button
          style={getBlockStyle(selectedTable, "D", blockStatus)}
          onClick={() => handleBlockClick("D")}
        >
          D
        </button>
      </div>
    </div>
  );
}

export default SideSection;
