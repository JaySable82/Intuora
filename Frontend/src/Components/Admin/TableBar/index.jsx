import React, { useState, useEffect } from "react";

function TableBar({ onTableSelect, blockStatus, selectedMain, selectedMulti,blockNo }) {
  const tableCount = 12;
  const [newselectedTable, setNewSelectedTable] = useState(null);
  const [tableOccupancy, setTableOccupancy] = useState({});

  // Define occupancy mappings
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
  console.log("blockNo in table bar: ", blockNo);
  // Calculate table occupancy from the blockStatus and selected blocks
  useEffect(() => {
    const occupancy = {};
  
    Object.keys(blockStatus).forEach((tableBlock) => {
      if (
        blockNo[tableBlock] === "ordered" ||
        blockNo[tableBlock] === "editing"
      ) {
        const tableNo = tableBlock.replace(/[^0-9]/g, '');
        const block = tableBlock.replace(/[0-9]/g, '');
        let value = 0;
        if (occupancyMappingMain[block] !== undefined) {
          value = occupancyMappingMain[block];
        } else if (occupancyMappingMulti[block] !== undefined) {
          value = occupancyMappingMulti[block];
        }
        occupancy[tableNo] = (occupancy[tableNo] || 0) + value;
      }
    });
  
    // ✅ If a block is currently selected, include that in the occupancy
    if (blockNo && newselectedTable) {
      let value = 0;
      if (occupancyMappingMain[blockNo] !== undefined) {
        value = occupancyMappingMain[blockNo];
      } else if (occupancyMappingMulti[blockNo] !== undefined) {
        value = occupancyMappingMulti[blockNo];
      }
      const tableStr = String(newselectedTable);
      occupancy[tableStr] = (occupancy[tableStr] || 0) + value;
    }
  
    setTableOccupancy(occupancy);
  }, [blockStatus, blockNo, newselectedTable]);
  

  // Function to determine the style of each table button based on occupancy
  const getTableButtonStyle = (tableNo) => {
    const isSelected = newselectedTable === tableNo;
    const occupancy = tableOccupancy[tableNo] || 0;

    // Define a base style for the button
    let style = {
      padding: "10px",
      cursor: "pointer",
      borderRadius: "8px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: "70px",
      height: "70px",
      fontSize: "20px",
      fontWeight: "bold",
      transition: "background-color 0.3s ease",
    };

    // Update the style based on occupancy
    if (isSelected) {
      style.backgroundColor = "#31B254"; // Selected: Green
      style.color = "#fff";
      style.border = "none";
    } else {
      if (occupancy === 4) {
        // Fully occupied
        style.backgroundColor = "#D3D3D3"; // Grey
        style.color = "#000";
        style.border = "1px solid #ccc";
      } else if (occupancy >= 1) {
        // Partially occupied (1-3 seats)
        style.backgroundColor = "#FFD580"; // Light yellow
        style.color = "#000";
        style.border = "1px solid #ccc";
      } else {
        // Free
        style.backgroundColor = "#fff";
        style.color = "#31B254";
        style.border = "2px solid #31B254";
      }
    }

    return style;
  };

  const handleTableClick = (tableNo) => {
    setNewSelectedTable(tableNo);
    if (onTableSelect) onTableSelect(tableNo);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {[...Array(tableCount)].map((_, index) => {
          const tableNo = index + 1;
          return (
            <button
              key={tableNo}
              onClick={() => handleTableClick(tableNo)}
              style={getTableButtonStyle(tableNo)}
            >
              {tableNo < 10 ? `0${tableNo}` : tableNo}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default TableBar;
