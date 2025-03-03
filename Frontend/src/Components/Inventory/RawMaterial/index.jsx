import React, { useEffect, useRef, useState } from "react";
import SearchBar from "../SearchBar";
import axios from "axios";

function RawMaterial() {
    const [isUpdating, setIsUpdating] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [items, setItems] = useState([]);
    const url = import.meta.env.VITE_LOCAL;
    const [newItem, setNewItem] = useState({ name: "", unit: "", quantity: 0, threshold: 0 });
    const hasFetchedRef=useRef(false);

    useEffect(() => {
        if(hasFetchedRef.current){
            return;
        }
        hasFetchedRef.current=true;
        async function fetchOrders() {
          try {
            const response = await axios.get(`${url}/raw-material`);
            console.log("raw-material: ", response.data);
            setItems(prevList => [...prevList, ...response.data]);
            console.log("Final data: ", response.data);
          } catch (error) {
            console.log("Error in fetching the elements at the frontend");
          }
        }
        fetchOrders();
      }, []);

      async function updateQuantity(index, change) {
        const newItems = [...items];
        newItems[index].quantity = Math.max(0, newItems[index].quantity + change);
        setItems(newItems);
    
        try {
            const response = await axios.put(`${url}/raw-material/update`, { items: newItems });
            console.log("Updated successfully:", response.data);
        } catch (error) {
            console.error("Error updating purchase orders:", error);
        }
    };
    

    async function handleSaveNewItem(){
        newItem.quantity=newItem.threshold;
        console.log(newItem);
        if (newItem.name && newItem.unit) {
            setItems([...items, newItem]);
            try {
                const response = await axios.post(`${url}/raw-material/upload`, { newItem });  // Wrap in an object
                console.log("Data sent successfully: ", response);
            } catch (err) {
                console.log("Error in sending the newItem", err);
            }
            setNewItem({ name: "", unit: "", quantity: 0, threshold: 0 });
            setIsAdding(false);
        }
    };

    return (
        <>
            {/* Main Container with Blur Effect */}
            <div style={{ filter: isAdding ? "blur(3px)" : "none" ,backgroundColor:"rgb(245,245,245)",height:"80vh"}}>
                <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    width: '100%',
                    padding: '1rem',
                    paddingLeft: '4rem',
                    paddingRight: '4rem',
                    paddingTop: '1rem',
                    
                }}>
                    <SearchBar />
                    <div
                        className="right-side-buttons"
                        style={{
                            display: "flex",
                            justifyContent: "space-around",
                            gap: "3rem",
                            marginRight: "0rem"
                        }}
                    >
                        <button
                            style={{ border: "none", backgroundColor: "rgb(49,180,117)", borderRadius: "1rem", height: "3rem", width: "9rem", color: "white", fontWeight: "600" }}
                            onClick={() => setIsAdding(true)}>
                            Add Items
                        </button>
                        <button
                            style={{ border: "none", backgroundColor: "rgb(49,180,117)", borderRadius: "1rem", height: "3rem", width: "9rem", color: "white", fontWeight: "600" }}
                            onClick={() => setIsUpdating(!isUpdating)}
                            disabled={isAdding}>
                            {isUpdating ? "Save" : "Update"}
                        </button>
                    </div>
                </div>

                {/* Table Section */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                    <table style={{
                        width: '80%',
                        overflow: 'hidden', backgroundColor: 'white'
                    }}>
                        <thead>
                            <tr style={{ backgroundColor: '#ddd', textAlign: 'center' }}>
                                <th style={{ padding: '1rem' }}>Raw Material</th>
                                <th style={{ padding: '1rem', textAlign: 'center' }}>Current Stock</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={index}>
                                    <td style={{ padding: '1rem', textAlign: 'center', borderBottomWidth: "1px" ,fontSize:"x-large"}}>{item.name}</td>
                                    <td style={{
                                        padding: '10px', textAlign: 'center',  borderBottomWidth: "1px",
                                        color: item.quantity < item.threshold ? 'red' : 'black',fontSize:"x-large"
                                    }}>
                                        {isUpdating ? (
                                            <>
                                                <button onClick={() => updateQuantity(index, 1)} style={{ marginRight: '5px', backgroundColor: 'black', color: 'white', borderRadius: '5px', border: 'none', width: '25px' }}>+</button>
                                                <span style={{ margin: '0 10px' }}>{item.quantity} {item.unit}</span>
                                                <button onClick={() => updateQuantity(index, -1)} style={{ marginLeft: '5px', backgroundColor: 'black', color: 'white', borderRadius: '5px', border: 'none', width: '25px' }}>-</button>
                                            </>
                                        ) : (
                                            <span>{item.quantity} {item.unit}</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Popup for Adding Items */}
            {isAdding && (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'white',
                    padding: '1rem',
                    boxShadow: '0px 1rem 2rem rgba(0, 0, 0, 0.3)',
                    width: '40rem',
                    borderRadius: "1rem"
                }}>

                    <h2 style={{ textAlign: 'center' }}>New Raw Material</h2>
                    <label style={{ fontSize: "larger" }}>Name of Raw Material:</label>
                    <input
                        type="text"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '5px', textAlign: "left" }}
                    />
                    <label style={{ fontSize: "larger" }}>Unit of Measure:</label>
                    <input
                        type="text"
                        value={newItem.unit}
                        onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                        style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '5px', textAlign: "left" }}
                    />
                    <label style={{ fontSize: "larger" }}>Inventory Threshold:</label>
                    <input
                        type="number"
                        value={newItem.threshold}
                        onChange={(e) => setNewItem({ ...newItem, threshold: parseInt(e.target.value) || 0 })}
                        style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '5px', textAlign: "left" }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                        <button onClick={() => setIsAdding(false)} style={{ backgroundColor: 'gray', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 20px' }}>Cancel</button>
                        <button onClick={handleSaveNewItem} style={{ backgroundColor: 'rgb(49,180,117)', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 20px' }}>Save</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default RawMaterial;
