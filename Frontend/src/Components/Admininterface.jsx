import React, { useState, useEffect,useMemo, useContext} from "react";
import '../Components/admin.css';
import Warning from "./warning";
import Navwarning from "./navwarning";
import AdminCard from "./admincard";
import logo from '../assets/dinein.png';
import io from "socket.io-client";
import NavBar from "./MenuManagement/Navbar";
import { ControlContext } from "./ControlContext";

const AWS_URl=import.meta.env.VITE_AWS;
const socket = io(import.meta.env.VITE_AWS, {
    transports: ['websocket', 'polling'],
    withCredentials: true
});

socket.on('connect', () => {
    console.log('Connected to Socket.IO server');
});

//console.log("API Base URL:", local);


function Admin() {
    const [currentOrders, setCurrentOrders] = useState([]);
    const [acceptedOrders, setAcceptedOrders] = useState([]);
    const [doneOrders, setDoneOrders] = useState([]);
    const[showWarning,setshowWarning]=useState(false);
    const {kitchenActive,setKitchenActive}=useContext(ControlContext);


    useEffect(() => {
            const interval = setInterval(() => {
                console.log(`Kitchen is ${kitchenActive ? "open" : "closed"}`);
            }, 1000); // Log every second
    
            // Cleanup interval on component unmount
            return () => clearInterval(interval);
        }, [kitchenActive]);
        
    // Fetch orders on component mount
    useEffect(() => {
        // Fetch initial orders
        fetch(`${AWS_URl}/ambika-admin/dashboard`)
            .then(response => response.json())
            .then(data => {
                // Separate orders based on status
                const currentOrders = data.filter(order => order.status === 'current');
                setCurrentOrders(currentOrders);
                console.log("current orders:", currentOrders);
    
                const acceptedOrders = data.filter(order => order.status === 'accepted');
                setAcceptedOrders(acceptedOrders);
                console.log("accepted orders:", acceptedOrders);
    
                const doneOrders = data.filter(order => order.status === 'done');
                setDoneOrders(doneOrders);
                console.log("done orders:", doneOrders);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);
    
    useEffect(() => {
        socket.on('orderUpdate', (updatedOrder) => {
            if (updatedOrder.status === 'current') {
                setCurrentOrders(prev => [
                    ...prev.filter(order => order._id !== updatedOrder._id),
                    updatedOrder,
                ]);
            } else if (updatedOrder.status === 'accepted') {
                setAcceptedOrders(prev => {
                    const exists = prev.some(order => order._id === updatedOrder._id);
                    return exists ? prev : [...prev, updatedOrder];
                });
            } else if (updatedOrder.status === 'done') {
                setDoneOrders(prev => [
                    ...prev.filter(order => order._id !== updatedOrder._id),
                    updatedOrder,
                ]);
            }
        });
    
        return () => {
            socket.off('orderUpdate');
        };
    }, []);
    
    

    const handleHideWarning = () => {

        setshowWarning(false); // Function to hide the warning
    };
    const handleLogout= () =>{
        setshowWarning(true);
    } 

    const handleDone = async (Id, currentStatus) => {
        try {
            const nextStatus = currentStatus === 'current' ? 'accepted' : 'done';
    
            const response = await fetch(`${AWS_URl}/ambika-admin/dashboard`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: nextStatus,
                    id: Id,
                }),
            });
    
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Failed to update order status');
            }
    
            if (nextStatus === 'accepted') {
                setCurrentOrders(prevOrders => prevOrders.filter(order => order._id !== Id));
                setAcceptedOrders(prevOrders => {
                    const exists = prevOrders.some(order => order._id === result.acceptedOrder._id);
                    return exists ? prevOrders : [...prevOrders, result.acceptedOrder];
                });
            } else if (nextStatus === 'done') {
                setAcceptedOrders(prevOrders => prevOrders.filter(order => order._id !== Id));
                setDoneOrders(prevOrders => {
                    const exists = prevOrders.some(order => order._id === result.doneOrder._id);
                    return exists ? prevOrders : [...prevOrders, result.doneOrder];
                });
            }
        } catch (error) {
            console.error('Error updating order status:', error.message);
        }
    };
    

    // const fetchOrders = async () => {
    //     try {
    //         const response = await fetch('http://localhost:3001/ambika-admin/dashboard');
    //         const data = await response.json();

    //         // Filter orders based on their status
    //         const currentOrders = data.filter(order => order.status === 'current');
    //         const acceptedOrders = data.filter(order => order.status === 'accepted');
    //         const doneOrders = data.filter(order => order.status === 'done');

    //         setCurrentOrders(currentOrders);
    //         setAcceptedOrders(acceptedOrders);
    //         setDoneOrders(doneOrders);
    //     } catch (error) {
    //         console.error('Error fetching orders:', error.message);
    //     }
    // };


    const handleDecline = async (id) => {
        try {
            // Make a DELETE request to remove the order from the backend
            const response = await fetch(`${AWS_URl}/ambika-admin/dashboard`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: id }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete order');
            }

            // Remove the order from the frontend state
            setCurrentOrders(prevOrders => prevOrders.filter(order => order._id !== id));

            console.log('Order declined:', id);
        } catch (error) {
            console.error('Error deleting order:', error.message);
        }
    };

    const acceptDecline = async (id) => {
        try {
            // Make a DELETE request to remove the order from the backend
            const response = await fetch(`${AWS_URl}/ambika-admin/dashboard`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: id }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete order');
            }

            // Remove the order from the frontend state
            setAcceptedOrders(prevOrders => prevOrders.filter(order => order._id !== id));

            console.log('Order declined:', id);
        } catch (error) {
            console.error('Error deleting order:', error.message);
        }
    };

    const handleIndex = async (index) => {
        // Remove the order from the currentOrders array
        try {
            const response = await fetch(`${AWS_URl}/ambika-admin/dashboard`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'accepted', id: orderId })
            });

            if (response.ok) {
                // refreshOrders();
                const data = currentOrders.filter((_, i) => i !== index);
                setCurrentOrders(data);

                // Find the order that should be moved to acceptedOrders
                const acceptedData = currentOrders.find((_, i) => i === index);

                // Add the found order to the acceptedOrders array
                setAcceptedOrders((prev) => [...prev, acceptedData]);

                console.log("Current Orders:", data);
                console.log("Accepted Order:", acceptedData);
            } else {
                console.error('Failed to move order to acceptedOrders');
            }
        } catch (error) {
            console.error('Error:', error);
        }


    };

    const handleNewOrder = async () => {
        try {
            // Log cart data to ensure marathi field is included

            const response = await fetch(`${AWS_URl}/ambika-admin/dashboard`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ createNewOrder: true }),
            });

            if (!response.ok) {
                throw new Error('Failed to place order');
            }

            const result = await response.json();
            console.log('Order placed successfully:', result);
            setToken(result.token);
        } catch (error) {
            console.error('Error placing order:', error);
        }
    };

    //total sandwiches count
    const totalItems = useMemo(() => {
        return currentOrders.reduce((total, order) => {
            return total + (order.quantity);
        }, 0);
    }, [currentOrders]);


    return (
        <>
            <NavBar />
                <div style={{ display: 'flex', justifyContent: 'center', gap: 30, position: 'relative' }}>
                
                {showWarning && <Warning rightnow={handleHideWarning} />}

                {/* Current Orders */}
                <div className="Current_order">
                    <div className="grey_box"/>
                    <div className="Accepted0">Current Orders</div>
                    {currentOrders.map((order, index) => (
                        <AdminCard
                            key={index}
                            token={order.token}
                            id={order._id}
                            onIndex={handleIndex}
                            index={index}

                            items={order.items}
                            onDone={() => handleDone(order._id, 'current')}
                            onDecline={() => handleDecline(order._id)}
                            showDoneButton={true}
                            showDeclineButton={true}
                        />
                    ))}

                    {/* dummy cards */}

                    <AdminCard
                            key={1}
                            token={1001}
                            id={"123"}
                            onIndex={handleIndex}
                            index={1}

                            items={[{"name":"Sandwich","quantity":2,"price":50,"parcel":true},{"name":"Burger","quantity":1,"price":100,"parcel":false}]}
                            onDone={() => handleDone("123", 'current')}
                            onDecline={() => handleDecline("123")}
                            showDoneButton={true}
                            showDeclineButton={true}
                    />
                    <AdminCard
                            key={1}
                            token={1002}
                            id={"123"}
                            onIndex={handleIndex}
                            index={1}

                            items={[{"name":"Sandwich","quantity":2,"price":50,"parcel":true},{"name":"Burger","quantity":1,"price":100,"parcel":false}]}
                            onDone={() => handleDone("123", 'current')}
                            onDecline={() => handleDecline("123")}
                            showDoneButton={true}
                            showDeclineButton={true}
                    />
                    
                </div>

                {/* Accepted Orders */}
                <div className="Accepted" style={{ width: 400, height: 'calc(100vh - 110px)', top: 20, position: 'absolute', background: '#EDECE9', borderRadius: 30, overflowY: 'auto', paddingBottom: 20 }}>
                    <div className="grey box" style={{ width: '100%', height: 70, position: 'absolute', background: '#DDDBD3', borderTopLeftRadius: 30, borderTopRightRadius: 30 }} />
                    <div className="Accepted0" style={{ left: 120, top: 20, position: 'absolute', textAlign: 'center', color: '#0D0F11', fontSize: 30, fontFamily: 'Inter', fontWeight: 'bolder', wordWrap: 'break-word' }}>Accepted</div>
                    {acceptedOrders.map((order, index) => (
                        <AdminCard
                            key={index}
                            token={order.token}
                            id={order._id}
                            onIndex={handleIndex}
                            index={index}
                            items={order.items}
                            onDone={() => handleDone(order._id, 'accepted')}
                            onDecline={() => acceptDecline(order._id)}
                            showDoneButton={true}
                            showDeclineButton={true}
                        />
                    ))}
                </div>

                {/* Done Orders */}
                <div className="Done" style={{ width: 400, height: 'calc(100vh - 110px)', right: 30, top: 20, position: 'absolute', background: '#EDECE9', borderRadius: 30, overflowY: 'auto', paddingBottom: 20 }}>
                    <div className="grey box" style={{ width: '100%', height: 70, position: 'absolute', background: '#DDDBD3', borderTopLeftRadius: 30, borderTopRightRadius: 30 }} />
                    <div className="Accepted0" style={{ left: 170, top: 20, position: 'absolute', textAlign: 'center', color: '#0D0F11', fontSize: 30, fontFamily: 'Inter', fontWeight: 'bolder', wordWrap: 'break-word' }}>Done</div>
                    {doneOrders.map((order, index) => (
                        <AdminCard

                            key={index}
                            token={order.token}
                            id={order._id}
                            onIndex={handleIndex}
                            index={index}
                            items={order.items}
                            onDone={handleDone}
                            onDecline={handleDecline}
                            showDoneButton={false}
                            showDeclineButton={false}
                        />
                    ))}
                </div>

                {/* Offline Orders */}
                <div className="NewOrder">
                <button onClick={handleNewOrder}>
                    <span>+ New Order</span>
                </button>
                </div>
            </div>
        </>
        
    );
}

export default Admin;
