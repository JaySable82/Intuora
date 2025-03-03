// Home.jsx
import React, { useContext, useState } from 'react';
import TableBar from './TableBar';
import AdminOrdering from './AdminOrdering';
import Bill from './Bill';
import Orders from './Order';
import YourComponent from './AdminOrdering';
import NavBar from '../MenuManagement/Navbar';
import { OrderContext } from './OrdersContext';

const Home = () => {
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const {tableNo_c,setTableNo_c}=useContext(OrderContext);
  const {blockNo_c,setBlockNo_c}=useContext(OrderContext);

  
  const [orders, setOrders] = useState([]);

  const [blockStatus, setBlockStatus] = useState({});

  const [cart, setCart] = useState([]);
  
  const updateCart = (item, change) => {
      setCart((prevCart) => {
          const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
          if (existingItem) {
              const newQuantity = Math.max(0, existingItem.quantity + change);
              if (newQuantity === 0) {
                  return prevCart.filter((cartItem) => cartItem.id !== item.id);
              }
              return prevCart.map((cartItem) =>
                  cartItem.id === item.id ? { ...cartItem, quantity: newQuantity, marathi: item.marathi } : cartItem
              );
          } else if (change > 0) {
              return [...prevCart, { ...item, quantity: change, marathi: item.marathi }];
          }
          return prevCart;
      });
  };

  // PLACE ORDER
  const placeOrder = () => {
    if (!selectedTable || !selectedBlock || cart.length === 0) {
      alert('Please select a table, block, and add items before placing an order.');
      return;
    }

    const newOrder = {
      id: orders.length + 1,
      table: selectedTable,
      block: selectedBlock,
      items: cart,
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    };

    setOrders(prev => [...prev, newOrder]);
    setCart([]);

    const key = `${selectedTable}${selectedBlock}`;
    setBlockStatus(prev => ({
      ...prev,
      [key]: 'ordered',
    }));

    alert(`Order placed for Table ${selectedTable}${selectedBlock}`);
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
  };

  //TABLE SELECTION CALLBACK
  const handleTableSelect = (tableNo) => {
    setSelectedTable(tableNo);
    setTableNo_c(tableNo);
    setSelectedBlock(null);
  };

  //BLOCK SELECTION CALLBACK
  const handleBlockSelect = (block) => {
    setSelectedBlock(block);
    setBlockNo_c(block);
    const key = `${selectedTable}${block}`;
    setBlockStatus(prev => ({
      ...prev,
      [key]: 'selected',
    }));
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
        />
      </div>

      <div style={{ display: 'flex', flex: 1, gap: '10px', padding: '1rem', overflow: 'auto' }}>
        <Orders orders={orders} />
        {/* <AdminOrdering cart={cart} updateCart={updateCart} /> */}

        <YourComponent cart={cart} updateCart={updateCart} />

        <Bill
          cart={cart}
          onPlaceOrder={placeOrder}
          onEditOrder={handleEditOrder}
          tableNo={selectedTable}
          blockNo={selectedBlock}
        />
      </div>
    </div>
  );
};

export default Home;
