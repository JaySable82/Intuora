import React from "react";

const sideSectionStyle = {
  position: "fixed",
  top: "13rem",
  left: 10,
  height: "calc(100% - 12rem)",
  width: "340px",
  backgroundColor: "#ffffff", // SideSection background remains white
  boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
  transform: "translateX(-100%)",
  transition: "transform 0.3s ease-in-out",
  zIndex: 9999,
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

const contentContainerStyle = {
  padding: "5px",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  minHeight: "100%",
};

const blockGroupStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "10px",
};

const blockCapacities = {
  Full: 4,
  A: 2,
  B: 2,
  AI: 1,
  BI: 1,
  AO: 1,
  BO: 1,
};

function SideSection({
  isOpen,
  onClose,
  selectedTable,
  onBlockSelect,
  blockStatus,
  currentSelectedBlock,
}) {
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
      return currentOccupancy === 0;
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

  const handleBlockClick = (block) => {
    if (!onBlockSelect || !isBlockAvailable(block)) return;
    onBlockSelect(block);
  };

  const getButtonStyle = (blockLetter, height, width) => {
    // Set the default background to very light grey for the blocks
    const defaultBackground = "#f2f2f2";
    
    if (!selectedTable) {
      return {
        height,
        width,
        border: "none",
        backgroundColor: defaultBackground,
        fontSize: blockLetter === "Full" ? 30 : 20,
        fontWeight: "bold",
        fontFamily: "inter",
        borderRadius: 8,
      };
    }

    const key = `${selectedTable}${blockLetter}`;
    const status = blockStatus?.[key] || null;
    const isSelected = currentSelectedBlock === blockLetter;
    const isAvailable = isBlockAvailable(blockLetter);

    let style = {
      height,
      width,
      border: "none",
      backgroundColor: defaultBackground, // Use light grey here
      fontSize: blockLetter === "Full" ? 30 : 20,
      fontWeight: "bold",
      fontFamily: "inter",
      borderRadius: 8,
      cursor: isAvailable ? "pointer" : "not-allowed",
    };

    if (isSelected) {
      style.backgroundColor = defaultBackground;
      style.color = "#31B254";
      style.border = "2px solid #31B254";
    } else if (status === "ordered") {
      style.backgroundColor = "#C0C0C0";
      style.color = "#000";
    } else if (status === "editing") {
      style.backgroundColor = defaultBackground;
      style.color = "#000";
      style.border = "2px solid #000";
    } else if (!isAvailable) {
      style.backgroundColor = "#F5F5F5";
      style.color = "#999";
    }

    return style;
  };

  return (
    <div
      style={{
        ...sideSectionStyle,
        ...(isOpen ? sideSectionOpenStyle : {}),
      }}
    >
      <div style={contentContainerStyle}>
        <button style={closeButtonStyle} onClick={onClose}>
          Close
        </button>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <button 
            style={getButtonStyle("Full", 200, 300)} 
            onClick={() => handleBlockClick("Full")}
          >
            Full
          </button>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
          <div style={blockGroupStyle}>
            <button 
              style={getButtonStyle("A", 200, 140)}
              onClick={() => handleBlockClick("A")}
            >
              A
            </button>
            <button 
              style={getButtonStyle("AI", 120, 140)}
              onClick={() => handleBlockClick("AI")}
            >
              AI
            </button>
            <button 
              style={getButtonStyle("AO", 120, 140)}
              onClick={() => handleBlockClick("AO")}
            >
              AO
            </button>
          </div>

          <div style={blockGroupStyle}>
            <button 
              style={getButtonStyle("B", 200, 140)}
              onClick={() => handleBlockClick("B")}
            >
              B
            </button>
            <button 
              style={getButtonStyle("BI", 120, 140)}
              onClick={() => handleBlockClick("BI")}
            >
              BI
            </button>
            <button 
              style={getButtonStyle("BO", 120, 140)}
              onClick={() => handleBlockClick("BO")}
            >
              BO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideSection;
