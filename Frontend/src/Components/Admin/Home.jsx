// Home.jsx
import React, { useContext, useState, useEffect } from 'react';
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

const Home = () => {
  const tableCount = 12;
  const [newselectedTable, setnewselectedTable] = useState(null);
  const [tableOccupancy, setTableOccupancy] = useState({});

  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);

  const { tableNo_c, setTableNo_c } = useContext(OrderContext);
  const { blockNo_c, setBlockNo_c } = useContext(OrderContext);

  const [orders, setOrders] = useState([]);
  const [blockStatus, setBlockStatus] = useState({});
  const [cart, setCart] = useState([]);
  const [billData, setBillData] = useState([]);
  const [billTotal, setBillTotal] = useState(0);

  const [selectedMain, setSelectedMain] = useState("");
  const [bills,setbills] = useState({}); 

  // Build a unique key for the current table-block
  const key = selectedTable && selectedBlock ? `${selectedTable}-${selectedBlock}` : null;

    // 1. Retrieve the current bill array for the selected table-block
    const getCurrentBill = () => {
      if (!key) return [];
      return bills[key] || [];
    };

      // 2. Overwrite the current bill array in the dictionary
  const updateCurrentBill = (newItems) => {
    if (!key) return; // If table or block not selected, do nothing
    setbills((prev) => ({
      ...prev,
      [key]: newItems,
    }));
  };

  const updateBillItems = (item, change) => {
    // If no seat is selected, do nothing
    if (!selectedTable || !selectedBlock) {
      alert("Please select table and seat first!");
      return;
    }
  
    const currentBill = getCurrentBill();
    const existingItem = currentBill.find((it) => it.id === item.id);
  
    let newBill;
    if (!existingItem && change > 0) {
      // 1) Adding a new item
      newBill = [
        ...currentBill,
        {
          ...item,
          quantity: change,
          updateQuantity: (finalQty) => {
            // finalQty is the new quantity from Bill’s +/-
            const diff = finalQty - change;
            // This calls updateBillItems again to adjust the dictionary
            updateBillItems(item, diff);
          },
        },
      ];
    } else if (existingItem) {
      // 2) Updating an existing item
      const newQuantity = existingItem.quantity + change;
      if (newQuantity <= 0) {
        // Remove item
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
      // Negative change for non-existing item -> do nothing
      return;
    }
  
    // Finally, overwrite the dictionary for the current seat
    updateCurrentBill(newBill);
  };
  

      // (Optional) If you still need to fetch DB-based bills, you can do so:
  useEffect(() => {
    if (selectedTable && selectedBlock) {
      fetchBillData();
    } else {
      setBillData([]);
      setBillTotal(0);
    }
  }, [selectedTable, selectedBlock]);
  

  // Calculate table occupancy based on blockStatus
  useEffect(() => {
    const occupancy = {};
    for (const tableBlock in blockStatus) {
      if (blockStatus[tableBlock] === "ordered" || blockStatus[tableBlock] === "editing") {
        const tableNo = tableBlock.replace(/[^0-9]/g, '');
        const block = tableBlock.replace(/[0-9]/g, '');
        occupancy[tableNo] = (occupancy[tableNo] || 0) + (
          block === "Full" ? 4 :
            (block === "A" || block === "B") ? 2 :
              (block === "AI" || block === "BI" || block === "AO" || block === "BO") ? 1 : 0
        );
      }
    }
    setTableOccupancy(occupancy);
  }, [blockStatus]);


  // Fetch bill data when table or block changes
  useEffect(() => {
    if (selectedTable && selectedBlock) {
      fetchBillData();
    } else {
      setBillData([]);
      setBillTotal(0);
    }
  }, [selectedTable, selectedBlock]);

  const fetchBillData = async () => {
    try {
      const response = await axios.get(`${url}/bedekar/bill`, {
        params: { tableNo: selectedTable, blockNo: selectedBlock },
      });

      // Process bill data to add updateQuantity function
      const processedBillData = response.data.orders ?
        response.data.orders.map(order => {
          const updatedItems = order.orders.items.map(item => ({
            ...item,
            updateQuantity: (newQuantity) => updateBillItemQuantity(order.id, item.id, newQuantity)
          }));
          return {
            ...order,
            orders: {
              ...order.orders,
              items: updatedItems
            }
          };
        }) : [];

      setBillData(processedBillData);
      let calculatedTotal = processedBillData.reduce((acc, order) => acc + order.orders.total, 0);
      setBillTotal(calculatedTotal);
      console.log("Bill data fetched: ", processedBillData);
    } catch (err) {
      console.log("Error in fetching the bill data.", err);
      setBillData([]);
      setBillTotal(0);
    }
  };

  // Update quantity for items in the bill
  const updateBillItemQuantity = async (orderId, itemId, newQuantity) => {
    if (newQuantity <= 0) {
      // Remove item if quantity is 0 or negative
      try {
        // await axios.delete(`${url}/bedekar/bill`, {
        //   params: { orderId, itemId }
        // });
        fetchBillData(); // Refresh bill data
      } catch (err) {
        console.log("Error removing item from bill:", err);
      }
    } else {
      // Update item quantity
      try {
        // await axios.put(`${url}/bedekar/bill`, {
        //   orderId,
        //   itemId,
        //   quantity: newQuantity
        // });
        fetchBillData(); // Refresh bill data
      } catch (err) {
        console.log("Error updating item quantity:", err);
      }
    }
  };

  const updateCart = (item, change) => {
    console.log("Update kart called!");
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        const newQuantity = Math.max(0, existingItem.quantity + change);
        if (newQuantity === 0) {
          return prevCart.filter((cartItem) => cartItem.id !== item.id);
        }
        return prevCart.map((cartItem) =>
          cartItem.id === item.id ? {
            ...cartItem,
            quantity: newQuantity,
            marathi: item.marathi,
            updateQuantity: (newQty) => updateCartItemQuantity(cartItem.id, newQty)
          } : cartItem
        );
      } else if (change > 0) {
        return [...prevCart, {
          ...item,
          quantity: change,
          marathi: item.marathi,
          updateQuantity: (newQty) => updateCartItemQuantity(item.id, newQty)
        }];
      }

      return prevCart;
    });
    //  console.log("Current Cart Items: ",cart);
  };

  // Function to directly update cart item quantity
  const updateCartItemQuantity = (itemId, newQuantity) => {
    setCart(prevCart => {
      if (newQuantity <= 0) {
        return prevCart.filter(item => item.id !== itemId);
      }
      return prevCart.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
    });
  };



  ;
  //TABLE SELECTION CALLBACK
  const handleTableSelect = (tableNo) => {
    setSelectedTable(tableNo);
    setSelectedBlock(null);
  };

  //BLOCK SELECTION CALLBACK
  const handleBlockSelect = (block) => {
    setSelectedBlock(block);
  };

  // sidesection states and everything
    const [selectedMulti, setSelectedMulti] = useState({
      AI: false,
      BI: false,
      AO: false,
      BO: false,
    });

    const selectedMultiList = Object.keys(selectedMulti).filter((key) => selectedMulti[key]);

      // We pass the current dictionary-based cart & update function as props
  const currentCart = getCurrentBill();
  const handleUpdateCart = (item, change) => updateBillItems(item, change);

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
        selectedMain={selectedMain}               // Pass current seat selection
        onSelectedMainChange={setSelectedMain}
        selectedMulti={selectedMulti}             // Pass current block selection
        onSelectedMultiChange={setSelectedMulti}
      />

      {/* TableBar below NavBar */}
      {/* <div> */}
      <TableBar
        onTableSelect={handleTableSelect}
        onBlockSelect={handleBlockSelect}
        blockStatus={blockStatus}
        currentSelectedBlock={selectedBlock}
        cart={cart}
        updateCart={updateCart}
      />
      {/* </div> */}

      {/* <Orders orders={orders} /> */}

      {/* <YourComponent cart={cart} updateCart={updateCart} /> */}


      <div style={{

      }}>
        <YourComponent cart={currentCart} updateCart={handleUpdateCart} tableno={selectedTable} blockNo={selectedBlock} />

      </div>
      {/* </div>

          {/* <User /> */}
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
      />


    </div>
  );
};

export default Home;