import React, { useState, useEffect } from "react";
import axios from 'axios';
function TableBar({ onTableSelect, placedorder, orderedTableNo,setPlacedOrder,clearOrder, setClearOrder,selectedTable }) {
  const tableCount = 12;
  const [newselectedTable, setNewSelectedTable] = useState(null);
  const [tableOccupancy, setTableOccupancy] = useState({});
  const [allTableBills, setAllTableBills] = useState([]);

  const url = import.meta.env.VITE_AWS;
  // Define occupancy mappings for Main and Multi blocks
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
  const fetchAllTableBills = async () => {
    const allBills = [];
    for (let tableNo = 1; tableNo <= tableCount; tableNo++) {
      try {
        const res = await axios.get(`${url}/admin/bills`, { params: { tableNo } });
        if (res.data.length > 0) {
          allBills.push(...res.data);
        }
      } catch (err) {
        console.error(`Error fetching bills for table ${tableNo}:`, err);
      }
    }
    setAllTableBills(allBills);
  };
  // Update occupancy whenever orderedTableNo changes
  useEffect(() => {
    if (placedorder) {
      fetchAllTableBills();
      setPlacedOrder(false); // 🔁 Refresh data when a new order is placed
    }
  }, [placedorder]);
  useEffect(() => {
    fetchAllTableBills();
    if(selectedTable!=null)
    {
      if(onTableSelect)
      {
        onTableSelect(selectedTable);
      }
      
    }
  }, [selectedTable]);
  
  const fetchOrdersForTable = async (tableNo) => {
    try {
      const res = await axios.get(`${url}/admin/bills`, { params: { tableNo } });
      setTableOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };
  useEffect(() => {
    if (clearOrder) {
      fetchAllTableBills();
      setClearOrder(false); // 🔁 Refresh data when a new order is placed
    }
  }, [clearOrder]);
  // Function to determine the style of each table button based on occupancy
  const getTableButtonStyle = (tableNo) => {
    const isSelected = newselectedTable === tableNo;
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

    // Apply different colors for the table button based on occupancy and table selection
    if (isSelected) {
      style.backgroundColor = "#31B254"; // Green when selected
      style.color = "#fff";
      style.border = "none";
    } else {
      // Find bill for the current table
      const tableBills = allTableBills.filter(bill => bill.tableNo === tableNo);

let occupancy = 0;
const seenBlocks = new Set();

tableBills.forEach(bill => {
  const block = bill.blockNo;
  if (!seenBlocks.has(block)) {
    if (occupancyMappingMain[block] !== undefined) {
      occupancy += occupancyMappingMain[block];
    } else if (occupancyMappingMulti[block] !== undefined) {
      occupancy += occupancyMappingMulti[block];
    }
    seenBlocks.add(block); // mark block as seen
  }
});
  
        // Color based on occupancy
        if (occupancy === 4) {
          style.backgroundColor = "#D3D3D3"; // Fully occupied
          style.color = "#000";
          style.border = "1px solid #ccc";
        } else if (occupancy >= 1) {
          style.backgroundColor = "#FFD580"; // Partially occupied
          style.color = "#000";
          style.border = "1px solid #ccc";
        }
      else {
        style.backgroundColor = "#fff"; // Free
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
              style={getTableButtonStyle(tableNo)} // Apply dynamic styles
            >
              {tableNo < 10 ? `0${tableNo}` : tableNo} {/* Show table number with leading zero */}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default TableBar;
