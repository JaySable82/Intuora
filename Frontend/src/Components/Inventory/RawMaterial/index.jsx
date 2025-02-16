import React, { useState } from "react";
import SearchBar from "../SearchBar";

function RawMaterial() {
    const [isUpdating, setIsUpdating] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [items, setItems] = useState([ ]);
    
    const [newItem, setNewItem] = useState({ name: "", unit: "", quantity: 0 });

    const updateQuantity = (index, change) => {
        const newItems = [...items];
        newItems[index].quantity = Math.max(0, newItems[index].quantity + change);
        setItems(newItems);
    };

    const handleSaveNewItem = () => {
        if (newItem.name && newItem.unit) {
            setItems([...items, newItem]);
            setNewItem({ name: "", unit: "", quantity: 0 });
            setIsAdding(false);
        }
    };

    return (
        <>
            <div style={{
                display: 'flex', justifyContent: 'space-between', width: '100%',
                padding: '1rem 4rem 1rem 4rem'
            }}>
                <SearchBar />
                <button 
                    style={{ border: "none", backgroundColor: "rgb(49,180,117)", borderRadius: "1rem", height: "3rem", width: "9rem", color: "white", fontWeight: "600" }}
                    onClick={() => setIsAdding(true)}>
                    Add Items
                </button>
                <button 
                    style={{ border: "none", backgroundColor: "rgb(49,180,117)", borderRadius: "1rem", height: "3rem", width: "9rem", color: "white", fontWeight: "600" }}
                    onClick={() => setIsUpdating(!isUpdating)}
                    disabled={isAdding}>
                    {isUpdating ? "Cancel" : "Update"}
                </button>
            </div>

            <div style={{
                display: 'flex', justifyContent: 'center',
                marginTop: '1rem'
            }}>
                <table style={{
                    width: '60%', borderCollapse: 'collapse', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                    borderRadius: '10px', overflow: 'hidden', backgroundColor: 'white'
                }}>
                    <thead>
                        <tr style={{ backgroundColor: '#ddd', textAlign: 'left' }}>
                            <th style={{ padding: '10px' }}>Raw Material</th>
                            <th style={{ padding: '10px', textAlign: 'center' }}>Current Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={index}>
                                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{item.name}</td>
                                <td style={{ 
                                    padding: '10px', textAlign: 'center', borderBottom: '1px solid #ddd',
                                    color: item.quantity < 5 ? 'red' : 'black' 
                                }}>
                                    {isUpdating ? (
                                        <>
                                            <button onClick={() => updateQuantity(index, 1)} style={{ marginRight: '5px', backgroundColor: 'black', color: 'white', borderRadius: '5px', border: 'none', width: '25px', height: '25px' }}>+</button>
                                            <span style={{ margin: '0 10px' }}>{item.quantity} {item.unit}</span>
                                            <button onClick={() => updateQuantity(index, -1)} style={{ marginLeft: '5px', backgroundColor: 'black', color: 'white', borderRadius: '5px', border: 'none', width: '25px', height: '25px' }}>-</button>
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

            {isAdding && (
                <div style={{
                    position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
                }}>
                    <h2 style={{ textAlign: 'center' }}>New Raw Material</h2>
                    <label>Name of Raw Material:</label>
                    <input type="text" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '5px' }} />
                    <label>Unit of Measure:</label>
                    <input type="text" value={newItem.unit} onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })} style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '5px' }} />
                    <label>Inventory Threshold:</label>
                    <input type="number" value={newItem.quantity} onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })} style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '5px' }} />
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
