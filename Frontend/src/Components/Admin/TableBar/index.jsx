import React, { useState } from "react";
import SideSection from "../Reservation";

function TableBar({ onTableSelect, onBlockSelect, blockStatus }) {
  const tableCount = 12;
  const [isOpen, setIsOpen] = useState(false);
  const [localSelectedTable, setLocalSelectedTable] = useState(null);

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

  const getTableButtonStyle = (isSelected) => ({
    padding: "10px",
    cursor: "pointer",
    background: isSelected ? "#31B254" : "#f0f0f0",
    color: isSelected ? "#ffffff" : "#000000",
    border: isSelected ? "none" : "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "70px",
    height: "70px",
    justifyContent: "center",
  });

  const tableLabelStyle = {
    fontSize: "10px",
    marginBottom: 5,
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
          const isSelected = localSelectedTable === tableNo;
          return (
            <button
              key={tableNo}
              onClick={() => handleTableClick(tableNo)}
              style={getTableButtonStyle(isSelected)}
            >
              <p style={tableLabelStyle}>Table no.</p>
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
      />
    </div>
  );
}

export default TableBar;
