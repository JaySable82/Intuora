import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { Order, sequence } from './models/Order_model.js';
import { AcceptedOrder } from './models/Order_model.js';
import { DoneOrder } from './models/Order_model.js';
import Counter from './models/Counter.js';
import cors from 'cors';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import mongoose from 'mongoose';
import Sequence from './models/sequence.js';
import KitchenStatusModel from './models/kitchenStatus.js';
import purchaseOrderModel from './models/purchaseOrder.js';



const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

const localhost = process.env.VITE_LOCALHOST
const localmongo = process.env.MONGO_URL
const awsurl=process.env.AWS_MAIN

// Create a Socket.IO server instance with CORS options
app.use(cors({
    // origin:process.env.REACT_APP_LOCALHOST, // The origin of your client application
    origin:`${awsurl}`,
    methods: ["GET", "POST", "DELETE", "OPTION", "PATCH","PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

mongoose.connect(`${localmongo}`)
    .then(() => console.log("DB Connected"))
    .catch(err => console.log('MongoDB Connection Error:', err));

app.options('*', cors());
app.use(express.json());

// Route for placing orders from users
app.post('/user/cart', async (req, res) => {
    console.log("Received Cart:", req.body.cart); // Log cart data received
    console.log("Total:", req.body.total);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { cart, total, bottle } = req.body;

        if (!cart || cart.length === 0) {
            return res.status(400).json({ message: 'Cart is empty or undefined' });
        }

        const counter = await Counter.findByIdAndUpdate(
            'orderCounter',
            { $inc: { seq: 1 } },
            { new: true, upsert: true, session }
        );

        const tokenNum = counter.seq;

        const itemsWithBottle = cart.map(item => ({
            ...item,
            bottle: item.bottle || 0
        }));

        const order = new Order({
            items: itemsWithBottle,
            total,
            token: tokenNum,
            parcel: cart.some(item => item.parcel)
        });

        await order.save({ session });

        await session.commitTransaction();
        session.endSession();

        // Emit the new order to all connected clients
        io.emit('orderUpdate', {
            ...order.toObject(),
            status: 'current' // Set the initial status as 'current'
        });

        res.status(200).json({
            message: 'Order placed successfully',
            token: tokenNum
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Error placing order', error: error.message });
    }
});

// Fetch orders for the admin dashboard
app.get('/ambika-admin/dashboard', async (req, res) => {
    try {
        const currentOrders = await Order.find();
        const acceptedOrders = await AcceptedOrder.find();
        const doneOrders = await DoneOrder.find().sort({ createdAt: -1 });

        const orders = [
            ...currentOrders.map(order => ({ ...order.toObject(), status: 'current', parcel: order.parcel })),
            ...acceptedOrders.map(order => ({ ...order.toObject(), status: 'accepted', parcel: order.parcel })),
            ...doneOrders.map(order => ({ ...order.toObject(), status: 'done', parcel: order.parcel }))
        ];

        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
});

// Delete an order
app.delete('/ambika-admin/dashboard', async (req, res) => {
    const { id } = req.body; // Get ID from the request body
    try {
        const result = await Order.findByIdAndDelete(id) || await AcceptedOrder.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Emit order deletion to connected clients
        io.emit('orderUpdate', { id, status: 'deleted' });

        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ error: 'Failed to delete order' });
    }
});

// Handle order status updates (current -> accepted -> done)
app.post('/ambika-admin/dashboard', async (req, res) => {
    const { status, id: _id, createNewOrder } = req.body;

    try {
        if (createNewOrder) {
            // Use the shared counter for token generation
            const session = await mongoose.startSession();
            session.startTransaction();

            try {
                const counter = await Counter.findByIdAndUpdate(
                    'orderCounter',
                    { $inc: { seq: 1 } },
                    { new: true, upsert: true, session }
                );

                const seqNum = counter.seq;

                const newOrder = new Order({
                    items: [], // Empty order items for admin-created order
                    total: 0,
                    token: seqNum,
                    parcel: false
                });

                await newOrder.save({ session });

                await session.commitTransaction();
                session.endSession();

                io.emit('orderUpdate', { ...newOrder.toObject(), status: 'current' });

                return res.status(200).json({
                    message: 'Empty order created successfully',
                    token: seqNum
                });
            } catch (error) {
                await session.abortTransaction();
                session.endSession();

                console.error('Error creating new order:', error);
                return res.status(500).json({ message: 'Error creating new order', error: error.message });
            }
        } else if (status === 'accepted') {
            const order = await Order.findById(_id);

            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            const acceptedOrder = new AcceptedOrder(order.toObject());
            await acceptedOrder.save();
            await Order.findByIdAndDelete(_id);

            io.emit('orderUpdate', { ...acceptedOrder.toObject(), status: 'accepted' });

            return res.status(200).json({ message: 'Order moved to acceptedOrders', acceptedOrder });

        } else if (status === 'done') {
            const order = await AcceptedOrder.findById(_id);

            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            const doneOrder = new DoneOrder(order.toObject());
            await doneOrder.save();
            await AcceptedOrder.findByIdAndDelete(_id);

            io.emit('orderUpdate', { ...doneOrder.toObject(), status: 'done' });

            return res.status(200).json({ message: 'Order moved to doneOrders', doneOrder });

        } else {
            return res.status(400).json({ error: 'Invalid status' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error updating order status', details: error.message });
    }
});

app.get('/kitchen-status', async (req, res) => {
    try {
        const document = await KitchenStatusModel.findOne({});
        if (document) {
            console.log("Kitchen Status fetched!");
            res.json(document); // Send a single object instead of an array
        } else {
            console.log("No kitchen status found.");
            res.json({ kitchenActive: false }); // Default value
        }
    } catch (err) {
        console.error("Error fetching the kitchen status", err);
        res.status(500).json({ error: "Error fetching kitchen status" });
    }
});

app.post('/kitchen-status/update', async (req, res) => {
    const { kitchenActive } = req.body;
    try {
        const updatedStatus = await KitchenStatusModel.findOneAndUpdate(
            {},
            { kitchenActive: kitchenActive },
            { new: true }
        );

        if (updatedStatus) {
            console.log("Kitchen Status updated:", kitchenActive);
            res.json({ message: "Updated kitchen status", kitchenActive });
        } else {
            console.log("No matching document, creating a new one.");
            const newStatus = await KitchenStatusModel.create({ kitchenActive });
            res.json({ message: "Created new kitchen status", kitchenActive: newStatus.kitchenActive });
        }
    } catch (err) {
        console.error("Error in updating kitchen status", err);
        res.status(500).json({ error: "Error updating kitchen status" });
    }
});

app.post("/purchase-orders/upload", async (req, res) => {
    try {
        const {temporary} = req.body;  // No need to destructure { temporary }
        console.log("Temporary: ", temporary);

        const sanitizedTemporary = {
            item: temporary.item || "",
            vendor: temporary.vendor || "",
            invoice_no: temporary.invoice_no || "",
            quantity: temporary.quantity ? Number(temporary.quantity) : 0,
            unit_price: temporary.unit_price ? Number(temporary.unit_price) : 0,
            total_price: temporary.total_price ? Number(temporary.total_price) : 0,
        };

        await purchaseOrderModel.create(sanitizedTemporary);
        res.json({ message: "Added into the backend" });
    } catch (err) {
        console.log("Error in adding the temporary data to the database", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.get("/purchase-orders",async (req,res)=>{
    try{
        const response=await purchaseOrderModel.find({});
        res.json(response);
    }catch(err){
        console.log("Error in fetching the purchase orders");
    }
});

app.put("/purchase-orders/update", async (req, res) => {
    try {
      const updatedOrders = req.body.purchaseOrdersList;
    //   console.log(updatedOrders);
      
      for (let order of updatedOrders) {
        await purchaseOrderModel.findByIdAndUpdate(order._id, order, { new: true });
      }
  
      res.json({ message: "Purchase orders updated successfully!" });
    } catch (err) {
      res.status(500).json({ error: "Error updating purchase orders" });
    }
  });


const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
