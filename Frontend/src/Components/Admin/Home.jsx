// Home.jsx
import React, { useContext, useState, useEffect } from 'react';
import TableBar from './TableBar';
import AdminOrdering from './AdminOrdering';
import Bill from './Bill';
import Orders from './Order';
import YourComponent from './AdminOrdering';
import NavBar from '../MenuManagement/Navbar';
import { OrderContext } from './OrdersContext';
import axios from 'axios';

const url = import.meta.env.VITE_LOCAL;

const Home = () => {
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const {tableNo_c, setTableNo_c} = useContext(OrderContext);
  const {blockNo_c, setBlockNo_c} = useContext(OrderContext);

  const [orders, setOrders] = useState([]);
  const [blockStatus, setBlockStatus] = useState({});
  const [cart, setCart] = useState([]);
  const [billData, setBillData] = useState([]);
  const [billTotal, setBillTotal] = useState(0);
  
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
      const response = await axios.get(`${url}/admin/bill`, {
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
        await axios.delete(`${url}/admin/bill/item`, {
          params: { orderId, itemId }
        });
        fetchBillData(); // Refresh bill data
      } catch (err) {
        console.log("Error removing item from bill:", err);
      }
    } else {
      // Update item quantity
      try {
        await axios.put(`${url}/admin/bill/item`, {
          orderId,
          itemId,
          quantity: newQuantity
        });
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

  // Clear all other selections when a new block is selected
  const clearOtherSelections = (newTable, newBlock) => {
    // Clear all "selected" statuses
    const updatedBlockStatus = { ...blockStatus };
    
    for (const key in updatedBlockStatus) {
      if (updatedBlockStatus[key] === "selected") {
        delete updatedBlockStatus[key];
      }
    }
    
    // Set the new selection
    if (newTable && newBlock) {
      updatedBlockStatus[`${newTable}${newBlock}`] = "selected";
    }
    
    setBlockStatus(updatedBlockStatus);
  };

  // HANDLE EDIT ORDER
  const handleEditOrder = () => {
    if (!selectedTable || !selectedBlock) {
      alert('No table/block selected to edit.');
      return;
    }
    const key = `${selectedTable}${selectedBlock}`;
    setBlockStatus(prev => ({
      ...prev,
      [key]: 'editing',
    }));
    
    // Refresh bill data after editing order
    fetchBillData();
  };

  //TABLE SELECTION CALLBACK
  const handleTableSelect = (tableNo) => {
    //console.log("Handle table select called ",tableNo);
    setSelectedTable(tableNo);
    setTableNo_c(tableNo);
    setSelectedBlock(null);
    setBlockNo_c(null);
    clearOtherSelections(null, null);
  };

  //BLOCK SELECTION CALLBACK
  const handleBlockSelect = (block) => {
    //console.log("Handle block select called ",block);
    setSelectedBlock(block);
    setBlockNo_c(block);
    clearOtherSelections(selectedTable, block);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavBar />

      {/* TableBar below NavBar */}
      <div style={{ marginTop: '1rem' }}>
        <TableBar
          onTableSelect={handleTableSelect}
          onBlockSelect={handleBlockSelect}
          blockStatus={blockStatus}
          currentSelectedBlock={selectedBlock}
        />
      </div>

      <div style={{ display: 'flex', flex: 1, gap: '10px', padding: '1rem', overflow: 'auto' }}>
        <Orders orders={orders} />
        
        <YourComponent cart={cart} updateCart={updateCart} />

        <Bill
          cart={cart}
          billData={billData}
          billTotal={billTotal}
          tableNo={selectedTable}
          blockNo={selectedBlock}
          fetchBillData={fetchBillData}
        />
      </div>
    </div>
  );
};

export default Home;