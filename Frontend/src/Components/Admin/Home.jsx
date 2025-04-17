// Home.jsx
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import TableBar from './TableBar';
import AdminOrdering from './AdminOrdering';
import Bill from './Bill';
import Orders from './Order';
import YourComponent from './AdminOrdering';
import SideSection from './Reservation';
import User from './AdminOrdering/index2';
import NavBar from '../MenuManagement/Navbar';
import { OrderContext } from './OrdersContext';
import axios from 'axios';

const url = import.meta.env.VITE_LOCAL;
const socketEndpoint = 'http://localhost:5173'; // Replace with your socket server URL

const Home = () => {
  const [newselectedTable, setnewselectedTable] = useState(null);
  const [occupancy, setOccupancy] = useState(0);
  const [selectedTable, setSelectedTable] = useState(0);
  const [selectedBlock, setSelectedBlock] = useState(0);
  const [orders, setOrders] = useState([]);
  const [blockStatus, setBlockStatus] = useState({});
  const [cart, setCart] = useState([]);
  const [billData, setBillData] = useState([]);
  const [billTotal, setBillTotal] = useState(0);
  const [selectedMain, setSelectedMain] = useState("");
  const [bills, setbills] = useState({});
  const [placedorder, setPlacedOrder] = useState(false);
  const [orderedTableNo, setOrderedTableNo] = useState(null);
  const [billsByTable, setBillsByTable] = useState([]);
  const [isOpen, setIsOpen] = useState(true);
  const [clearOrder, setClearOrder] = useState(false);
  // Build a unique key for the current table-block (for when table and block are both selected)
  const key = selectedTable && selectedBlock ? `${selectedTable}-${selectedBlock}` : null;

  // 1. Retrieve the current bill array for the selected table-block (local state)
  const getCurrentBill = () => {
    if (!key) return [];
    return bills[key] || [];
  };

  // 2. Overwrite the current bill array in the dictionary
  const updateCurrentBill = (newItems) => {
    if (!key) return;
    setbills((prev) => ({
      ...prev,
      [key]: newItems,
    }));
  };

  // Update bill items locally
  const updateBillItems = (item, change) => {
    if (!selectedTable || !selectedBlock) {
      alert("Please select table and seat first!");
      return;
    }
    const currentBill = getCurrentBill();
    const existingItem = currentBill.find((it) => it.id === item.id);
    let newBill;
    if (!existingItem && change > 0) {
      newBill = [
        ...currentBill,
        {
          ...item,
          quantity: change,
          updateQuantity: (finalQty) => {
            const diff = finalQty - change;
            updateBillItems(item, diff);
          },
        },
      ];
    } else if (existingItem) {
      const newQuantity = existingItem.quantity + change;
      if (newQuantity <= 0) {
        newBill = currentBill.filter((it) => it.id !== item.id);
      } else {
        newBill = currentBill.map((it) =>
          it.id === item.id
            ? {
                ...it,
                quantity: newQuantity,
                updateQuantity: (finalQty) => {
                  const diff = finalQty - newQuantity;
                  updateBillItems(item, diff);
                },
              }
            : it
        );
      }
    } else {
      return;
    }
    updateCurrentBill(newBill);
  };

  const fetchBillData = async () => {
    try {
      const response = await axios.get(`${url}/bedekar/bill`, {
        params: { tableNo: selectedTable, blockNo: selectedBlock },
      });
      const processedBillData = response.data.orders
        ? response.data.orders.map(order => {
            const updatedItems = order.orders.items.map(item => ({
              ...item,
              updateQuantity: (newQuantity) =>
                updateBillItemQuantity(order.id, item.id, newQuantity),
            }));
            return {
              ...order,
              orders: {
                ...order.orders,
                items: updatedItems,
              },
            };
          })
        : [];
      setBillData(processedBillData);
      let calculatedTotal = processedBillData.reduce(
        (acc, order) => acc + order.orders.total,
        0
      );
      setBillTotal(calculatedTotal);
      console.log("Bill data fetched: ", processedBillData);
    } catch (err) {
      console.log("Error in fetching the bill data.", err);
      setBillData([]);
      setBillTotal(0);
    }
  };

  const updateBillItemQuantity = async (orderId, itemId, newQuantity) => {
    // When updating quantity from fetched data, simply refresh the data
    try {
      fetchBillData();
    } catch (err) {
      console.log("Error updating item quantity:", err);
    }
  };

  const updateCart = (item, change) => {
    console.log("Update cart called!");
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        const newQuantity = Math.max(0, existingItem.quantity + change);
        if (newQuantity === 0) {
          return prevCart.filter((cartItem) => cartItem.id !== item.id);
        }
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? {
                ...cartItem,
                quantity: newQuantity,
                marathi: item.marathi,
                updateQuantity: (newQty) =>
                  updateCartItemQuantity(cartItem.id, newQty),
              }
            : cartItem
        );
      } else if (change > 0) {
        return [
          ...prevCart,
          {
            ...item,
            quantity: change,
            marathi: item.marathi,
            updateQuantity: (newQty) => updateCartItemQuantity(item.id, newQty),
          },
        ];
      }
      return prevCart;
    });
  };

  const updateCartItemQuantity = (itemId, newQuantity) => {
    setCart((prevCart) => {
      if (newQuantity <= 0) {
        return prevCart.filter((item) => item.id !== itemId);
      }
      return prevCart.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  // Socket setup for real-time bill updates
  useEffect(() => {
    const socket = io(socketEndpoint);
    socket.on('billUpdate', (data) => {
      console.log("Received bill update:", data);
      if (selectedTable && data.tableNo === selectedTable) {
        // Refresh bills for the current table
        fetchTableBills(selectedTable);
      }
    });
    return () => {
      socket.disconnect();
    };
  }, [selectedTable]);

  // Fetch bills for the current table (across any block)
  const fetchTableBills = (tableNo) => {
    axios
      .get(`${url}/admin/bills`, { params: { tableNo } })
      .then((res) => {
        setBillsByTable(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch bills:", err);
        setBillsByTable([]);
      });
  };

  const handleTableSelect = (tableNo) => {
    setSelectedTable(tableNo);
    setSelectedBlock(null);
    setIsOpen(true);
    fetchTableBills(tableNo);
  };

  const handleBlockSelect = (block) => {
    setSelectedBlock(block);
  };

  const [selectedMulti, setSelectedMulti] = useState({
    AI: false,
    BI: false,
    AO: false,
    BO: false,
  });
  const selectedMultiList = Object.keys(selectedMulti).filter(
    (key) => selectedMulti[key]
  );
  const currentCart = getCurrentBill();
  const handleUpdateCart = (item, change) => updateBillItems(item, change);

  useEffect(() => {
    if (selectedBlock != null) {
      setBillsByTable([]);
    }
  }, [selectedBlock]);

  // For rendering bills across the table (when block is not selected),
  // filter out duplicate bills (i.e. same tableNo-blockNo)
  const getUniqueBills = () => {
    const billsMap = {};
    billsByTable.forEach((bill) => {
      const uniqueKey = `${bill.tableNo}-${bill.blockNo}`;
      // Optionally choose to keep the latest or first bill; here we simply overwrite so the last wins.
      billsMap[uniqueKey] = bill;
    });
    return Object.values(billsMap);
  };
  const fetchBillsForTableOnly = async () => {
    try {
      const res = await axios.get(`${url}/bedekar/bills?tableNo=${selectedTable}`);
      setbills(res.data); // or setBills, based on your state
    } catch (err) {
      console.error("Failed to fetch bills:", err);
    }
  };
  
  return (
    <div style={{ position: "relative", height: 200 }}>
      <NavBar />
      <SideSection
        newselectedTable={newselectedTable}
        onBlockSelect={handleBlockSelect}
        blockStatus={blockStatus}
        cart={cart}
        updateCart={updateCart}
        tableno={selectedTable}
        blockNo={selectedBlock}
        placedorder={placedorder}
        selectedMain={selectedMain}
        onSelectedMainChange={setSelectedMain}
        selectedMulti={selectedMulti}
        onSelectedMultiChange={setSelectedMulti}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        orderedTableNo={orderedTableNo}
        setOrderedTableNo={setOrderedTableNo}
        setOccupancy={setOccupancy}
      />
      <TableBar
        selectedTable={selectedTable}
        onTableSelect={handleTableSelect}
        onBlockSelect={handleBlockSelect}
        blockStatus={blockStatus}
        blockNo={selectedBlock}
        cart={cart}
        updateCart={updateCart}
        setIsOpen={setIsOpen}
        placedorder={placedorder}
        setPlacedOrder={setPlacedOrder}
        orderedTableNo={orderedTableNo}
        clearOrder={clearOrder}
        setClearOrder={setClearOrder}
      />
      <div>
        <YourComponent
          cart={currentCart}
          updateCart={handleUpdateCart}
          tableno={selectedTable}
          blockNo={selectedBlock}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      </div>
      {selectedTable != null && selectedBlock == null && (
        <div style={{ padding: 16 }}>
          {billsByTable.length === 0 ? (
            <p style={{ color: "#666" }}>No orders yet.</p>
          ) : (
            // Render unique bills only
            getUniqueBills().map((bill) => (
              <Bill
                key={bill._id}
                cart={[]}
                billData={[bill]}
                billTotal={bill.orders.total}
                tableNo={selectedTable}
                blockNo={bill.blockNo}
                onClearLocalCart={() => fetchTableBills(selectedTable)}
                placedorder={false}
                setPlacedOrder={() => {}}
                setOrderedTableNo={() => {}}
                bills={bills}
                setbills={setbills}
                setBillData={setBillData}
                setBillTotal={setBillTotal}
                clearOrder={clearOrder}
                setClearOrder={setClearOrder}
              />
            ))
          )}
        </div>
      )}
      {selectedTable != null && selectedBlock != null && (
        <div style={{ padding: 16 }}>
          <Bill
            cart={currentCart}
            onClearLocalCart={() => updateCurrentBill([])}
            setcart={setCart}
            billData={billData}
            billTotal={billTotal}
            tableNo={selectedTable}
            blockNo={selectedBlock}
            multiblock={selectedMultiList}
            fetchBillData={fetchBillData}
            selectedMain={selectedMain}
            selectedMulti={selectedMulti}
            placedorder={placedorder}
            setPlacedOrder={setPlacedOrder}
            setOrderedTableNo={setOrderedTableNo}
            bills={bills}
            setbills={setbills}
            setBillData={setBillData}
            setBillTotal={setBillTotal}
            clearOrder={clearOrder}
            setClearOrder={setClearOrder}
          />
        </div>
      )}
    </div>
  );
};

export default Home;
