import React, { useState, useEffect, useContext } from "react";
import { OrderContext } from "../OrdersContext";
import User from "../AdminOrdering/index2";

const sideSectionStyle = {
  position: "fixed",
  top: "13rem",
  left: 10,
  height: "calc(100% - 12rem)",
  width: "340px",
  backgroundColor: "#fafafa", // SideSection background remains white
  boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
  overflowY: "scroll",
  msOverflowStyle: "none",
  scrollbarWidth: "none",
  "&::-webkit-scrollbar": {
    display: "none",
  },
};

const sideSectionOpenStyle = {
  transform: "translateX(0)",
};

const contentContainerStyle = {
  padding: "5px",
  display: "flex",
  flexDirection: "column",
  gap: "40px",
  minHeight: "100%",
};

const blockGroupStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "40px",
};


function SideSection({
  selectedTable,
  onBlockSelect,
  blockStatus,
  cart,
  updateCart,
  tableno,
  selectedMain,
  onSelectedMainChange,
  selectedMulti,
  onSelectedMultiChange,
  isOpen,
  setIsOpen,
  blockNo,
  placedorder,
  orderedTableNo,

}) {

  // const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    onSelectedMainChange("");
    onSelectedMultiChange({
      AI: false,
      BI: false,
      AO: false,
      BO: false,
    });
    onBlockSelect("");
  }, [tableno]);
  
   // Define our styles
  const placedStyle = { background: "#E5E5E9", color: "#93929C", pointerEvents: "none" };
  const disabledStyle = { background: "#FFFFFF", color: "#DEE1E4", pointerEvents: "none" };

  const toggleSideSection = () => setIsOpen((prev) => !prev);

  const calculateCurrentOccupancy = () => {
    if (!selectedTable || !blockStatus) return 0;

    let occupancy = 0;
    const tableBlocks = Object.keys(blockStatus).filter(key =>
      key.startsWith(selectedTable)
    );

    for (const blockKey of tableBlocks) {
      if (blockStatus[blockKey] === "ordered" || blockStatus[blockKey] === "editing") {
        const blockLetter = blockKey.substring(selectedTable.toString().length);
        occupancy += blockCapacities[blockLetter] || 0;
      }
    }

    return occupancy;
  };

  const isBlockAvailable = (block) => {
    if (!selectedTable || !blockStatus) return true;

    const currentOccupancy = calculateCurrentOccupancy();
    const blockKey = `${selectedTable}${block}`;

    if (blockStatus[blockKey] === "ordered" || blockStatus[blockKey] === "editing") {
      return true;
    }

    if (block === "Full") {
      return currentOccupancy === 0 &&
        !blockStatus[`${selectedTable}A`] &&
        !blockStatus[`${selectedTable}B`] &&
        !blockStatus[`${selectedTable}AI`] &&
        !blockStatus[`${selectedTable}BI`] &&
        !blockStatus[`${selectedTable}AO`] &&
        !blockStatus[`${selectedTable}BO`];
    }

    if (block === "A") {
      return !blockStatus[`${selectedTable}Full`] &&
        !blockStatus[`${selectedTable}AI`] &&
        !blockStatus[`${selectedTable}AO`];
    }

    if (block === "B") {
      return !blockStatus[`${selectedTable}Full`] &&
        !blockStatus[`${selectedTable}BI`] &&
        !blockStatus[`${selectedTable}BO`];
    }

    if (block === "AI" || block === "AO") {
      return !blockStatus[`${selectedTable}Full`] &&
        !blockStatus[`${selectedTable}A`];
    }

    if (block === "BI" || block === "BO") {
      return !blockStatus[`${selectedTable}Full`] &&
        !blockStatus[`${selectedTable}B`];
    }

    return true;
  };

  // Occupancy state
  const [occupancy, setOccupancy] = useState(0);

  // Occupancy mappings
  const occupancyMappingMain = {
    Full: 4,
    A: 2,
    B: 2,
  };
  const occupancyMappingMulti = {
    AI: 1,
    BI: 1,
    AO: 1,
    BO: 1,
  };

  // Recalculate occupancy whenever selection changes.
  useEffect(() => {
    const mainOccupancy = selectedMain ? occupancyMappingMain[selectedMain] : 0;
    const multiOccupancy = Object.keys(selectedMulti).reduce(
      (sum, key) => sum + (selectedMulti[key] ? occupancyMappingMulti[key] : 0),
      0
    );
    setOccupancy(mainOccupancy + multiOccupancy);
  }, [selectedMain, selectedMulti]);

  // Handler for main group (Full, A, B)
  const handleMainClick = (label) => {
    if (!tableno) {
      alert("Please select a table number first!");
      return;
    }
    // If already selected, toggle off.
    if (selectedMain === label) {
      onSelectedMainChange("");
      onBlockSelect("");
      return;
    }
    // Calculate potential occupancy if selecting this main button.
    const currentMultiCount = Object.values(selectedMulti).filter(Boolean).length;
    const potential = occupancyMappingMain[label] + currentMultiCount;
    if (potential > 4) {
      return; // Do not allow if occupancy exceeds 4.
    }
    onSelectedMainChange(label);
    onBlockSelect(label);
    setIsOpen(false); // Close the side section when a main button is selected.
  };

  function buildBlockString(selectedMain, selectedMulti) {
    // Convert the selectedMulti object into an array of active keys
    const multiKeys = Object.entries(selectedMulti)
      .filter(([_, isActive]) => isActive)
      .map(([key]) => key);

    if (selectedMain && multiKeys.length > 0) {
      // e.g. "A-AI" or "B-BO"
      return `${selectedMain}-${multiKeys.join("-")}`;
    } else if (selectedMain) {
      // e.g. "A" or "Full"
      return selectedMain;
    } else if (multiKeys.length > 0) {
      // e.g. "AI-AO" if no main seat is selected
      return multiKeys.join("-");
    }
    // If nothing is selected, return empty string
    return "";
  }

  // Handler for multi-select group (AI, BI, AO, BO)
  const handleMultiClick = (label) => {
    if (!tableno) {
      alert("Please select a table number first!");
      return;
    }

    // If already selected, toggle off.
    if (selectedMulti[label]) {
      onSelectedMultiChange((prev) => {
        const updated = { ...prev, [label]: false };
        // Build the new block string
        const newBlockString = buildBlockString(selectedMain, updated);
        onBlockSelect(newBlockString);
        return updated;
      });
    } else {
      // Deselect main seat if needed
      if (selectedMain === "A" && (label === "AI" || label === "AO")) {
        onSelectedMainChange("");
      }
      if (selectedMain === "B" && (label === "BI" || label === "BO")) {
        onSelectedMainChange("");
      }

      // Recalculate potential occupancy
      const mainOccupancy =
        selectedMain === "A" && (label === "AI" || label === "AO")
          ? 0
          : selectedMain === "B" && (label === "BI" || label === "BO")
            ? 0
            : selectedMain
              ? occupancyMappingMain[selectedMain]
              : 0;

      const currentMultiCount = Object.values(selectedMulti).filter(Boolean).length;
      const potential = mainOccupancy + currentMultiCount + 1;
      if (potential > 4) {
        return; // Do not allow if occupancy exceeds 4.
      }

      onSelectedMultiChange((prev) => {
        const updated = { ...prev, [label]: true };
        // Build the new block string
        const newBlockString = buildBlockString(selectedMain, updated);
        onBlockSelect(newBlockString);
        return updated;
      });
    }
  };



  // Helper: Determine main group button font color.
  // If all multi-select buttons are selected, main group becomes inactive.
  const getMainFontColor = (label) => {
    const allMultiSelected = Object.values(selectedMulti).every((val) => val === true);
    if (allMultiSelected) {
      return "black"; // All multi buttons selected, main group inactive.
    }
    if (selectedMain === "Full") {
      return label === "Full" ? "#159758" : "black";
    }
    if (selectedMain === "A") {
      if (label === "A") return "#159758";
      return "black";
    }
    if (selectedMain === "B") {
      if (label === "B") return "#159758";
      return "black";
    }
    return "black";
  };

  // Helper: Determine multi-select button font color.
  const getMultiFontColor = (label) => {
    if (selectedMain === "Full") {
      return "black"; // All multi buttons inactive when Full is selected.
    }
    if (selectedMain === "A") {
      // When A is selected, AI and AO are inactive.
      if (label === "AI" || label === "AO") return "black";
    }
    if (selectedMain === "B") {
      // When B is selected, BI and BO are inactive.
      if (label === "BI" || label === "BO") return "black";
    }
    return selectedMulti[label] ? "#159758" : "black";
  };

  // Dynamic styling for main group buttons.
// In SideSection.jsx (only showing modified helpers)
const getMainButtonStyle = (baseStyle, label) => {
  // Build the identifier for the current table in this component.
  const currentTableBlock = tableno && blockNo ? `${tableno}-${blockNo}` : "";

  // If no order is placed OR the order placed is for a different table,
  // then use your normal styling logic.
  if (!placedorder || (placedorder && orderedTableNo !== currentTableBlock)) {
    const isSelected = selectedMain === label;
    return {
      ...baseStyle,
      border: isSelected ? "2px solid #159758" : baseStyle.border,
      color: getMainFontColor(label)
    };
  }
  
  // Otherwise, order is placed for this table so apply disabled/placed styling.
  // Ensure we safely work with blockNo (using a fallback if needed)
  const bn = blockNo || "";
  // Split the combined orderedTableNo to get its parts (if you built it as "A-AI" for example)
  const orderParts = (orderedTableNo || "").split("-");
  
  if (orderParts.includes(label)) {
    return { ...baseStyle, ...placedStyle };
  }
  
  if (orderedTableNo === "Full" && label !== "Full") {
    return { ...baseStyle, ...disabledStyle };
  }
  
  if ((orderedTableNo === "A" || orderedTableNo.startsWith("A-")) && (label === "Full" || label === "A")) {
    return { ...baseStyle, ...disabledStyle };
  }
  
  if ((orderedTableNo === "B" || orderedTableNo.startsWith("B-")) && (label === "Full" || label === "B")) {
    return { ...baseStyle, ...disabledStyle };
  }
  
  if (orderParts.length >= 3 && ["Full", "A", "B"].includes(label)) {
    return { ...baseStyle, ...disabledStyle };
  }
  
  return { ...baseStyle, ...disabledStyle };
};

const getMultiButtonStyle = (baseStyle, label) => {
  const currentTableBlock = tableno && blockNo ? `${tableno}-${blockNo}` : "";
  if (!placedorder || (placedorder && orderedTableNo !== currentTableBlock)) {
    const isSelected = selectedMulti[label];
    return {
      ...baseStyle,
      border: isSelected ? "2px solid #159758" : baseStyle.border,
      color: getMultiFontColor(label)
    };
  }
  
  const bn = blockNo || "";
  const orderParts = (orderedTableNo || "").split("-");
  if (orderParts.includes(label)) {
    return { ...baseStyle, ...placedStyle };
  }
  
  if ((orderedTableNo === "A" || orderedTableNo.startsWith("A-")) && (label === "AI" || label === "AO")) {
    return { ...baseStyle, ...disabledStyle };
  }
  
  if ((orderedTableNo === "B" || orderedTableNo.startsWith("B-")) && (label === "BI" || label === "BO")) {
    return { ...baseStyle, ...disabledStyle };
  }
  
  if (orderParts.length >= 3) {
    return { ...baseStyle, ...disabledStyle };
  }
  
  return { ...baseStyle, ...disabledStyle };
};

  // Base styles for main group buttons.
  const baseStyleMain = {

    background: "white",
    borderRadius: 10,
    fontSize: 32,
    border: "2px solid transparent",
    // transition: "transform 0.3s ease",
    // transform: isOpen ? "translateX(0)" : "translateX(-360px)",
  };
  const fullStyle = {
    ...baseStyleMain,
    position:"relative",
    bottom:130,
    left: 5,
    height: 120,
    width: 200,
  };
  const abStyle = {
    ...baseStyleMain,
    position:"relative",
    bottom:130,
    left: 1,
    height: 100,
    width: 80,
  };

  // Base styles for multi-select buttons.
  const baseStyleMulti = {

    background: "white",
    borderRadius: 10,
    fontSize: 32,
    border: "2px solid transparent",
  };
  const aiStyle = {
    ...baseStyleMulti,
    position:"relative",
    bottom:130,
    left: 1,
    height: 50,
    width: 80,
  };
  console.log("Selected Main:", selectedMain || selectedMulti);

  return (
    <div>
      {/* Toggle Arrow Button */}
      <button
        onClick={toggleSideSection}
        style={{
          position: "fixed",
          top: 210,
          left: isOpen ? "220px" : "0px",
          zIndex: 1000,
          borderRadius: isOpen ? "40px 0px 0px 40px" : "0px 40px 40px 0px",
          background: "#fff",
          border: "1px solid #ccc",
          width: "30px",
          height: "40px",
          cursor: "pointer",
          transition: "transform 0.3s ease",
          // transform: isOpen ? "translateX(0)" : "translateX(-360px)",

        }}
      >
        {isOpen ? "<" : ">"}
      </button>

      <div
        style={{
          position: "fixed",
          top: 200,
          backgroundColor: "#F8F8FA",
          height: 900,
          width: 250,
          display: "flex",           // Use flex layout
          flexDirection: "column",   // Stack items vertically
          justifyContent: "center",  // Center items vertically
          alignItems: "center",
          borderRadius: 10,
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease",
        }}
      >


        <div style={{ transform: "translateY(-80px)" }}>
          {/* Full Button */}
          <div style={{ marginBottom: "20px" }}>
            <button
              onClick={() => handleMainClick("Full")}
              style={getMainButtonStyle(fullStyle, "Full")}
            >
              Full
            </button>
          </div>

          {/* A and B Buttons */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 110px)",
              marginBottom: "20px",
              gap: "10px",
            }}
          >
            <button
              onClick={() => handleMainClick("A")}
              style={getMainButtonStyle(abStyle, "A")}
            >
              A
            </button>
            <button
              onClick={() => handleMainClick("B")}
              style={getMainButtonStyle(abStyle, "B")}
            >
              B
            </button>
          </div>

          {/* AI, BI, AO, BO Buttons (Multi-select) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 110px)",
              columnGap: "5px",
              rowGap: "10px",
            }}
          >
            <button
              onClick={() => handleMultiClick("AI")}
              style={getMultiButtonStyle(aiStyle, "AI")}
            >
              AI
            </button>
            <button
              onClick={() => handleMultiClick("BI")}
              style={getMultiButtonStyle(aiStyle, "BI")}
            >
              BI
            </button>
            <button
              onClick={() => handleMultiClick("AO")}
              style={getMultiButtonStyle(aiStyle, "AO")}
            >
              AO
            </button>
            <button
              onClick={() => handleMultiClick("BO")}
              style={getMultiButtonStyle(aiStyle, "BO")}
            >
              BO
            </button>
          </div>

        </div>
        <User block={selectedMain} />

      </div>
    </div>
  );
}

export default SideSection;