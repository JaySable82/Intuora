import React, { useState, useEffect } from "react";
import SideSection from "../Reservation";

function TableBar({ onTableSelect, onBlockSelect, blockStatus, currentSelectedBlock }) {
  const tableCount = 12;
  const [isOpen, setIsOpen] = useState(false);
  const [localSelectedTable, setLocalSelectedTable] = useState(null);
  const [tableOccupancy, setTableOccupancy] = useState({});

  // Calculate table occupancy based on blockStatus
  useEffect(() => {
    const occupancy = {};
    
    for (const tableBlock in blockStatus) {
      if (blockStatus[tableBlock] === "ordered" || blockStatus[tableBlock] === "editing") {
        const tableNo = tableBlock.replace(/[^0-9]/g, '');
        const block = tableBlock.replace(/[0-9]/g, '');
        
        if (!occupancy[tableNo]) {
          occupancy[tableNo] = 0;
        }
        
        // Add occupancy based on block type
        switch (block) {
          case "Full":
            occupancy[tableNo] += 4;
            break;
          case "A":
          case "B":
            occupancy[tableNo] += 2;
            break;
          case "AI":
          case "BI":
          case "AO":
          case "BO":
            occupancy[tableNo] += 1;
            break;
          default:
            break;
        }
      }
    }
    
    setTableOccupancy(occupancy);
  }, [blockStatus]);

  const handleTableClick = (tableNo) => {
    setLocalSelectedTable(tableNo);
    setIsOpen(true);
    if (onTableSelect) onTableSelect(tableNo);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  };

  const tableRowStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    margin: "10px 0",
  };

  const getTableButtonStyle = (tableNo) => {
    const isSelected = localSelectedTable === tableNo;
    const occupancy = tableOccupancy[tableNo] || 0;
    
    let style = {
      padding: "10px",
      cursor: "pointer",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "70px",
      height: "70px",
      justifyContent: "center",
    };

    if (isSelected) {
      style.backgroundColor = "#31B254"; // Green for selected
      style.color = "#ffffff";
      style.border = "none";
    } else if (occupancy > 0 && occupancy <= 2) {
      style.backgroundColor = "#FFD580"; // Light orange for 1-2 persons
      style.color = "#000000";
      style.border = "1px solid #ccc";
    } else if (occupancy > 2) {
      style.backgroundColor = "#D3D3D3"; // Light grey for more than 2 persons
      style.color = "#000000";
      style.border = "1px solid #ccc";
    } else {
      style.backgroundColor = "#ffffff"; // White for unoccupied
      style.color = "#31B254"; // Green number
      style.border = "2px solid #31B254"; // Green border
    }
    
    return style;
  };

  const tableNumberStyle = {
    fontSize: "20px",
    fontWeight: "bold",
    margin: 0,
  };

  return (
    <div style={containerStyle}>
      <div style={tableRowStyle}>
        {[...Array(tableCount)].map((_, index) => {
          const tableNo = index + 1;
          return (
            <button
              key={tableNo}
              onClick={() => handleTableClick(tableNo)}
              style={getTableButtonStyle(tableNo)}
            >
              <p style={tableNumberStyle}>
                {tableNo < 10 ? `0${tableNo}` : tableNo}
              </p>
            </button>
          );
        })}
      </div>

      {/* SideSection for block selection */}
      <SideSection
        isOpen={isOpen}
        onClose={handleClose}
        selectedTable={localSelectedTable}
        onBlockSelect={onBlockSelect}
        blockStatus={blockStatus}
        currentSelectedBlock={currentSelectedBlock}
      />
    </div>
  );
}

export default TableBar;