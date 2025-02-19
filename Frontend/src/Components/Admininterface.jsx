import React, { useState, useEffect, useMemo } from "react";
import '../Components/admin.css';
import Warning from "./warning";
import Navwarning from "./navwarning";
import AdminCard from "./admincard";
import logo from '../assets/dinein.png';
import io from "socket.io-client";
import axios from "axios";

const local = import.meta.env.VITE_LOCAL;
const awsurl = import.meta.env.VITE_AWS_MAIN;

const socket = io(local, {
    transports: ['websocket', 'polling'],
    withCredentials: true
});

socket.on('connect', () => {
    console.log('Connected to Socket.IO server');
});

console.log("API Base URL:", local);


function Admin() {
    const [currentOrders, setCurrentOrders] = useState([]);
    const [acceptedOrders, setAcceptedOrders] = useState([]);
    const [doneOrders, setDoneOrders] = useState([]);
    const [showWarning, setShowWarning] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${local}/ambika-admin/dashboard`);
                console.log(response.data);
                const data = response.data;

                setCurrentOrders(data.filter(order => order.status === 'current'));
                setAcceptedOrders(data.filter(order => order.status === 'accepted'));
                setDoneOrders(data.filter(order => order.status === 'done'));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchOrders();
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
        setShowWarning(false);
    };

    const handleLogout = () => {
        setShowWarning(true);
    };

    const handleDone = async (Id, currentStatus) => {
        try {
            const nextStatus = currentStatus === 'current' ? 'accepted' : 'done';
            const response = await axios.post(`${local}/ambika-admin/dashboard`, {
                status: nextStatus,
                id: Id,
            });

            const result = response.data;

            if (nextStatus === 'accepted') {
                setCurrentOrders(prev => prev.filter(order => order._id !== Id));
                setAcceptedOrders(prev => {
                    const exists = prev.some(order => order._id === result.acceptedOrder._id);
                    return exists ? prev : [...prev, result.acceptedOrder];
                });
            } else if (nextStatus === 'done') {
                setAcceptedOrders(prev => prev.filter(order => order._id !== Id));
                setDoneOrders(prev => {
                    const exists = prev.some(order => order._id === result.doneOrder._id);
                    return exists ? prev : [...prev, result.doneOrder];
                });
            }
        } catch (error) {
            console.error('Error updating order status:', error.message);
        }
    };

    const handleDecline = async (id) => {
        try {
            await axios.delete(`${local}/ambika-admin/dashboard`, {
                data: { id }
            });

            setCurrentOrders(prev => prev.filter(order => order._id !== id));
            console.log('Order declined:', id);
        } catch (error) {
            console.error('Error deleting order:', error.message);
        }
    };

    const acceptDecline = async (id) => {
        try {
            await axios.delete(`${local}/ambika-admin/dashboard`, {
                data: { id }
            });

            setAcceptedOrders(prev => prev.filter(order => order._id !== id));
            console.log('Order declined:', id);
        } catch (error) {
            console.error('Error deleting order:', error.message);
        }
    };

    const handleIndex = async (index) => {
        try {
            await axios.post(`${local}/ambika-admin/dashboard`, { status: 'accepted' });

            const data = currentOrders.filter((_, i) => i !== index);
            setCurrentOrders(data);

            const acceptedData = currentOrders.find((_, i) => i === index);
            setAcceptedOrders(prev => [...prev, acceptedData]);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleNewOrder = async () => {
        try {
            const response = await axios.post(`${local}/ambika-admin/dashboard`, {
                createNewOrder: true
            });

            console.log('Order placed successfully:', response.data);
        } catch (error) {
            console.error('Error placing order:', error);
        }
    };

    const totalItems = useMemo(() => {
        return currentOrders.reduce((total, order) => total + order.quantity, 0);
    }, [currentOrders]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 30, position: 'relative' }}>
            {showWarning && <Warning rightnow={handleHideWarning} />}
            <div className="Navbar" style={{ width: '100%', height: 80, left: 0, top: 0, position: 'relative', background: '#0D0F11' }}>
                {showWarning && <Navwarning />}
                <div className="ViewOrders" style={{ left: '46%', top: 24, position: 'absolute', textAlign: 'center', color: 'white', fontSize: 26, fontFamily: 'Inter', fontWeight: '600' }}>View Orders</div>
                <button style={{ right: 30, top: 24, position: 'absolute', color: 'white', fontSize: 26, backgroundColor: 'black', border: 'none' }} onClick={handleLogout}>Log Out</button>
                <img src={logo} alt="DineIn" style={{ marginTop: 10, marginLeft: 10, height: 50, width: 110 }} />
            </div>

            <div className="Current_order">
                <div className="grey_box" />
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
            </div>

            <div className="Accepted" style={{ width: 400, height: 'calc(100vh - 110px)', top: 104, position: 'absolute', background: '#EDECE9', borderRadius: 30, overflowY: 'auto', paddingBottom: 20 }}>
                <div className="grey box" style={{ width: '100%', height: 70, position: 'absolute', background: '#DDDBD3', borderTopLeftRadius: 30, borderTopRightRadius: 30 }} />
                <div className="Accepted0" style={{ left: 120, top: 20, position: 'absolute', color: '#0D0F11', fontSize: 30, fontWeight: 'bolder' }}>Accepted</div>
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

            <div className="Done" style={{ width: 400, height: 'calc(100vh - 110px)', right: 30, top: 104, position: 'absolute', background: '#EDECE9', borderRadius: 30, overflowY: 'auto', paddingBottom: 20 }}>
                <div className="grey box" style={{ width: '100%', height: 70, position: 'absolute', background: '#DDDBD3', borderTopLeftRadius: 30, borderTopRightRadius: 30 }} />
                <div className="Accepted0" style={{ left: 170, top: 20, position: 'absolute', color: '#0D0F11', fontSize: 30, fontWeight: 'bolder' }}>Done</div>
                {doneOrders.map((order, index) => (
                    <AdminCard
                        key={index}
                        token={order.token}
                        id={order._id}
                        onIndex={handleIndex}
                        index={index}
                        items={order.items}
                        showDoneButton={false}
                        showDeclineButton={false}
                    />
                ))}
            </div>

            <div className="NewOrder">
                <button onClick={handleNewOrder}>
                    <span>+ New Order</span>
                </button>
            </div>
        </div>
    );
}

export default Admin;