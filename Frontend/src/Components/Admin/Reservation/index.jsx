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

}) {
  const { tableNo_c } = useContext(OrderContext);
  const { blockNo_c } = useContext(OrderContext);

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

  console.log("tableno", tableno);
  const handleBlockClick = (block) => {
    //if (!onBlockSelect || !isBlockAvailable(block)) return;
    onBlockSelect(block);

    // console.log("Table No: ",tableNo_c);
    // console.log("Block No: ",blockNo_c);
  };

  // const getButtonStyle = (blockLetter, height, width) => {
  //   // Set the default background to very light grey for the blocks
  //   const defaultBackground = "#f2f2f2";

  //   if (!selectedTable) {
  //     return {
  //       height,
  //       width,
  //       border: "none",
  //       backgroundColor: defaultBackground,
  //       fontSize: blockLetter === "Full" ? 30 : 20,
  //       fontWeight: "bold",
  //       fontFamily: "inter",
  //       borderRadius: 8,
  //     };
  //   }

  //   const key = `${selectedTable}${blockLetter}`;
  //   const status = blockStatus?.[key] || null;
  //   const isSelected = currentSelectedBlock === blockLetter;
  //   const isAvailable = isBlockAvailable(blockLetter);

  //   let style = {
  //     height,
  //     width,
  //     border: "none",
  //     backgroundColor: defaultBackground, // Use light grey here
  //     fontSize: blockLetter === "Full" ? 30 : 20,
  //     fontWeight: "bold",
  //     fontFamily: "inter",
  //     borderRadius: 8,
  //     cursor: isAvailable ? "pointer" : "not-allowed",
  //   };

  //   if (isSelected) {
  //     style.backgroundColor = defaultBackground;
  //     style.color = "#31B254";
  //     style.border = "2px solid #31B254";
  //   } else if (status === "ordered") {
  //     style.backgroundColor = "#C0C0C0";
  //     style.color = "#000";
  //   } else if (status === "editing") {
  //     style.backgroundColor = defaultBackground;
  //     style.color = "#000";
  //     style.border = "2px solid #000";
  //   } else if (!isAvailable) {
  //     style.backgroundColor = "#F5F5F5";
  //     style.color = "#999";
  //   }

  //   return style;
  // };
  // Main group: Full, A, B (single select and toggleable)

  // Multi-select group: AI, BI, AO, BO
  // const [selectedMulti, onSelectedMultiChange] = useState({
  //   AI: false,
  //   BI: false,
  //   AO: false,
  //   BO: false,
  // });

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
      return "#DEE1E4";
    }
    if (selectedMain === "Full") {
      return label === "Full" ? "#159758" : "#DEE1E4";
    }
    if (selectedMain === "A") {
      if (label === "A") return "#159758";
      if (label === "Full") return "#DEE1E4";
      return "black";
    }
    if (selectedMain === "B") {
      if (label === "B") return "#159758";
      if (label === "Full") return "#DEE1E4";
      return "black";
    }
    return "black";
  };

  // Helper: Determine multi-select button font color.
  const getMultiFontColor = (label) => {
    if (selectedMain === "Full") {
      return "#DEE1E4"; // All multi buttons inactive when Full is selected.
    }
    if (selectedMain === "A") {
      // When A is selected, AI and AO are inactive.
      if (label === "AI" || label === "AO") return "#DEE1E4";
    }
    if (selectedMain === "B") {
      // When B is selected, BI and BO are inactive.
      if (label === "BI" || label === "BO") return "#DEE1E4";
    }
    return selectedMulti[label] ? "#159758" : "black";
  };

  // Dynamic styling for main group buttons.
  const getMainButtonStyle = (baseStyle, label) => {
    const isSelected = selectedMain === label;
    return {
      ...baseStyle,
      border: isSelected ? "2px solid #159758" : baseStyle.border,
      color: getMainFontColor(label),
    };
  };

  // Dynamic styling for multi-select buttons.
  const getMultiButtonStyle = (baseStyle, label) => {
    const isSelected = selectedMulti[label];
    return {
      ...baseStyle,
      border: isSelected ? "2px solid #159758" : baseStyle.border,
      color: getMultiFontColor(label),
    };
  };

  // Base styles for main group buttons.
  const baseStyleMain = {
    background: "white",
    borderRadius: 10,
    fontSize: 32,
    border: "2px solid transparent",
  };
  const fullStyle = {
    ...baseStyleMain,
    height: 200,
    width: 300,
  };
  const abStyle = {
    ...baseStyleMain,
    height: 200,
    width: 140,
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
    height: 100,
    width: 145,
  };
  console.log("Selected Main:", selectedMain || selectedMulti);

  return (
    <div
      style={{
        position: "fixed",
        top: 300,
        backgroundColor: "#F8F8FA",
        height: 900,
        width: 400,
        display: "flex",           // Use flex layout
        flexDirection: "column",   // Stack items vertically
        justifyContent: "center",  // Center items vertically
        alignItems: "center",
        borderRadius: 10
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
            gridTemplateColumns: "repeat(2, 150px)",
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
            gridTemplateColumns: "repeat(2, 150px)",
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
  );
}

export default SideSection;