import dotenv from 'dotenv';
dotenv.config();

import express from 'express';

import cors from 'cors';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import mongoose from 'mongoose';
// import escpos from 'escpos';
// import EscposUSB from 'escpos-usb';
// import Sequence from './models/sequence.js';
import KitchenStatusModel from './models/kitchenStatus.js';
import purchaseOrderModel from './models/purchaseOrder.js';
import rawMaterialModel from './models/rawMaterial.js';
import AdminModel from './models/adminmodel.js';
import {AdminDashboardOrdersModel} from './models/AdminDashboard.js';
import AllOrdersModel from './models/allorders.js';
import Counter from './models/Counter.js';
import {FinalOrdersModel} from'./models/AdminDashboard.js';



const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

// Create a Socket.IO server instance with CORS options
app.use(cors({
    // origin:process.env.REACT_APP_LOCALHOST, // The origin of your client application
    origin:process.env.FE_A,
    methods: ["GET", "POST", "DELETE", "OPTION", "PATCH","PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

//USB Printer
// escpos.USB=EscposUSB;
// const device =new escpos.USB(0x04b8,0x0202);
// const printer =new escpos.Printer(device);

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

mongoose.connect(process.env.MONGO_URL,)
    .then(() => console.log("DB Connected"))
    .catch(err => console.log('MongoDB Connection Error:', err));

app.options('*', cors());
app.use(express.json());

let admin=null;

//signup route
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try{
        let admin=await AdminModel.findOne({username});
        if(!admin){
            admin=await AdminModel.create({username,password});
            return res.status(200).json({message:'Admin created successfully'});
        }
        else{
            return res.status(400).json({message:'Admin already exists'});
        }
    } catch(error){
        console.error('Error creating admin:',error);
        return res.status(500).json({message:'Error creating admin',error:error.message});
    }
});

//login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try{
        admin=await AdminModel.findOne({username,password});
        if(!admin){
            return res.status(400).json({message:'Invalid credentials'});
        }
        else{
        res.status(200).json({message:'Login successful',adminuser:admin.username});
        }
    }catch(error){
        console.error('Error logging in:',error);
        return res.status(500).json({message:'Error logging in',error:error.message});
    }
});

//redirection of admins
app.get('/login', async (req, res) => {
    
    try{
        const username=req.query.username;
        

        if(!username){
            return res.status(400).json({message:'Admin not found'});
        }

        admin=await AdminModel.findOne({username});

        if(admin.username=="ambika"){
            return res.status(200).json({message:'Admin is ambika'});
        }
        if(admin.username=="jaysable"){
            return res.status(200).json({message:'Admin is jay'});
        }
        else{
            return res.status(400).json({message:'Admin is not ambika'});
        }
        
    }catch(error){
        console.error('Error logging in:',error);
        return res.status(500).json({message:'Error logging in',error:error.message});
    }
});

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

// Route for placing orders from users
app.post('/admin/cart', async (req, res) => {
    console.log("Cart: ", req.body);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { cart, total, tableNo, blockNo } = req.body;

        if (!cart || cart.length === 0) {
            return res.status(400).json({ message: 'Cart is empty or undefined' });
        }

        // Get the token number from Counter
        const counter = await Counter.findByIdAndUpdate(
            'orderCounter',
            { $inc: { seq: 1 } },
            { new: true, upsert: true, session }
        );

        const tokenNum = counter.seq;

        // Map cart items to match schema
        const items = cart.map((item) => ({
            id: item.id,
            marathi: item.marathi,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            parcel: item.parcel || false,
            bottle: item.bottle || 0
        }));

        // Create new order
        const order = new AdminDashboardOrdersModel({
            tableNo,
            blockNo,
            orders: {
                items,
                total,
                token: tokenNum
            }
        });

        await order.save({ session });

        await session.commitTransaction();
        session.endSession();

        io.emit('orderUpdate', {
            ...order.toObject(),
            status: 'current'
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

app.get('/admin/bill', async (req, res) => {
    const { tableNo, blockNo } = req.query;

    try {
        const orders = await AdminDashboardOrdersModel.find({ tableNo: tableNo, blockNo: blockNo });
        console.log(orders);
        res.json({ orders });
    } catch (err) {
        console.error("Error in finding the order", err);
        res.status(500).send("Error in finding the order");
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

            // device.open(()=>{
            //     printer
            //     .text("Order No: "+acceptedOrder.token)
            //     .text("-----------------------")
            //     .text("Items")
            //     .text("-----------------------")
            //     .cut()
            //     .close();

            // res.status(200).send({message:'printed'});
            // });

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
        const {newItem} = req.body;  // No need to destructure { newItem }
        console.log("newItem: ", newItem);

        const sanitizednewItem = {
            item: newItem.item || "",
            vendor: newItem.vendor || "",
            invoice_no: newItem.invoice_no || "",
            quantity: newItem.quantity ? Number(newItem.quantity) : 0,
            unit_price: newItem.unit_price ? Number(newItem.unit_price) : 0,
            total_price: newItem.total_price ? Number(newItem.total_price) : 0,
        };

        await purchaseOrderModel.create(sanitizednewItem);
        res.json({ message: "Added into the backend" });
    } catch (err) {
        console.log("Error in adding the newItem data to the database", err);
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

app.post("/raw-material/upload", async (req, res) => {
    try {
        const {newItem} = req.body;  // No need to destructure { newItem }
        console.log("newItem: ", newItem);

        const sanitizednewItem = {
            name: newItem.name || "",
            unit: newItem.unit || "",
            quantity: newItem.quantity ? Number(newItem.quantity) : 0,
            threshold: newItem.threshold ? Number(newItem.threshold) : 0
        };

        await rawMaterialModel.create(sanitizednewItem);
        res.json({ message: "Added into the backend" });
    } catch (err) {
        console.log("Error in adding the newItem data to the database", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/raw-material",async (req,res)=>{
    try{
        const response=await rawMaterialModel.find({});
        res.json(response);
    }catch(err){
        console.log("Error in fetching the purchase orders");
    }
});

app.put("/raw-material/update", async (req, res) => {
    try {
      const updatedOrders = req.body.items;
    //   console.log(updatedOrders);
      
      for (let order of updatedOrders) {
        await rawMaterialModel.findByIdAndUpdate(order._id, order, { new: true });
      }
  
      res.json({ message: "Purchase orders updated successfully!" });
    } catch (err) {
      res.status(500).json({ error: "Error updating purchase orders" });
    }
});

app.delete('/bedekar/bill', async (req, res) => {
    const { tableNo, blockNo } = req.query;
    const { itemId } = req.query;

    try {
        const result = await AdminDashboardOrdersModel.deleteMany({ tableNo: tableNo, blockNo: blockNo,itemId:itemId });

        if (result.deletedCount > 0) {
            console.log(`Orders for Table: ${tableNo}, Block: ${blockNo} deleted successfully`);
            res.status(200).json({ message: "Order deleted successfully" });
        } else {
            console.log("No matching orders found");
            res.status(404).json({ message: "No matching orders found" });
        }
    } catch (err) {
        console.error("Error in deleting the order", err);
        res.status(500).send("Error in deleting the order");
    }
});

app.get('/admin/orders',async (req,res)=>{
    try{
        const response=await AdminDashboardOrdersModel.find();
        res.json(response);
        console.log("Orders fetched successfully");
    }catch(err){
        console.error("Error in fetching the orders",err);
    }
})



//Bedekar Routes
app.post('/bedekar/cart', async (req, res) => {
    console.log("Cart: ", req.body);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { cart, total, tableNo, blockNo } = req.body;

        if (!cart || cart.length === 0) {
            return res.status(400).json({ message: 'Cart is empty or undefined' });
        }

        // Get the token number from Counter
        const counter = await Counter.findByIdAndUpdate(
            'orderCounter',
            { $inc: { seq: 1 } },
            { new: true, upsert: true, session }
        );

        const tokenNum = counter.seq;

        // Map cart items to match schema
        const items = cart.map((item) => ({
            id: item.id,
            marathi: item.marathi,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            parcel: item.parcel || false,
            bottle: item.bottle || 0
        }));

        // Create new order
        const order = new AdminDashboardOrdersModel({
            tableNo,
            blockNo,
            orders: {
                items,
                total,
                token: tokenNum
            }
        });

        await order.save({ session });

        await session.commitTransaction();
        session.endSession();

        io.emit('orderUpdate', {
            ...order.toObject(),
            status: 'current'
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


// New API route: update order for a table-block (delete old, insert new)
app.post('/admin/cart', async (req, res) => {
    try {
      const { cart, total, tableNo, blockNo } = req.body;
  
      // Validate request
      if (!cart || cart.length === 0) {
        return res.status(400).json({ message: 'Cart is empty or undefined' });
      }
      if (!tableNo || !blockNo) {
        return res.status(400).json({ message: 'Missing tableNo or blockNo' });
      }
  
      // Check if an order already exists for this table/block
      const existingOrder = await AdminDashboardOrdersModel.findOne({ tableNo, blockNo });
      if (existingOrder) {
        // Delete the old order (you could also consider archiving it first)
        await AdminDashboardOrdersModel.deleteOne({ _id: existingOrder._id });
        console.log(`Deleted old order for table: ${tableNo} block: ${blockNo}`);
      }
  
      // Update the order counter (token) using the Counter model
      const counter = await Counter.findByIdAndUpdate(
        'orderCounter',
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      const tokenNum = counter.seq;
  
      // Map the cart items according to your schema
      const items = cart.map((item) => ({
        id: item.id,
        marathi: item.marathi,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        parcel: item.parcel || false,
        bottle: item.bottle || 0
      }));
  
      // Create a new order document
      const newOrder = new AdminDashboardOrdersModel({
        tableNo,
        blockNo,
        orders: {
          items,
          total,
          token: tokenNum
        }
      });
  
      await newOrder.save();
  
      // Optionally, you can emit an update via socket.io if needed.
      io.emit('orderUpdate', { ...newOrder.toObject(), status: 'current' });
  
      res.status(200).json({
        message: 'Order updated successfully',
        token: tokenNum
      });
    } catch (error) {
      console.error('Error updating order:', error);
      res.status(500).json({
        message: 'Error updating order',
        error: error.message
      });
    }
  });
  
  app.post('/admin/final/cart', async (req, res) => {
    try {
      const { cart, total, tableNo, blockNo } = req.body;
  
      // Validate request
      if (!cart || cart.length === 0) {
        return res.status(400).json({ message: 'Cart is empty or undefined' });
      }
      if (!tableNo || !blockNo) {
        return res.status(400).json({ message: 'Missing tableNo or blockNo' });
      }
  
      // Check if an order already exists for this table/block
      const existingOrder = await FinalOrdersModel.findOne({ tableNo, blockNo });
      if (existingOrder) {
        // Delete the old order (you could also consider archiving it first)
        await FinalOrdersModel.deleteOne({ _id: existingOrder._id });
        console.log(`Deleted old order for table: ${tableNo} block: ${blockNo}`);
      }
  
      // Update the order counter (token) using the Counter model
      const counter = await Counter.findByIdAndUpdate(
        'orderCounter',
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      const tokenNum = counter.seq;
  
      // Map the cart items according to your schema
      const items = cart.map((item) => ({
        id: item.id,
        marathi: item.marathi,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        parcel: item.parcel || false,
        bottle: item.bottle || 0
      }));
  
      // Create a new order document
      const newOrder = new FinalOrdersModel({
        tableNo,
        blockNo,
        orders: {
          items,
          total,
          token: tokenNum
        }
      });
  
      await newOrder.save();
  
      // Optionally, you can emit an update via socket.io if needed.
      io.emit('orderUpdate', { ...newOrder.toObject(), status: 'current' });
  
      res.status(200).json({
        message: 'Order updated successfully',
        token: tokenNum
      });
    } catch (error) {
      console.error('Error updating order:', error);
      res.status(500).json({
        message: 'Error updating order',
        error: error.message
      });
    }
  });




app.get('/bedekar/bill', async (req, res) => {
    const { tableNo, blockNo } = req.query;

    try {
        const orders = await AdminDashboardOrdersModel.find({ tableNo: tableNo, blockNo: blockNo });
        console.log(orders);
        res.json({ orders });
    } catch (err) {
        console.error("Error in finding the order", err);
        res.status(500).send("Error in finding the order");
    }
});

app.delete('/bedekar/bill', async (req, res) => {
    const { tableNo, blockNo } = req.query;
    const { itemId } = req.query;

    try {
        const result = await AdminDashboardOrdersModel.deleteMany({ tableNo: tableNo, blockNo: blockNo,itemId: itemId });

        if (result.deletedCount > 0) {
            console.log(`Orders for Table: ${tableNo}, Block: ${blockNo} deleted successfully`);
            res.status(200).json({ message: "Order deleted successfully" });
        } else {
            console.log("No matching orders found");
            res.status(404).json({ message: "No matching orders found" });
        }
    } catch (err) {
        console.error("Error in deleting the order", err);
        res.status(500).send("Error in deleting the order");
    }
});

// app.get('/bedekar/dashboard',async (req,res)=>{
//     try{
//         const response=await AdminDashboardOrdersModel.find();
//         res.json(response);
//         console.log("Orders fetched successfully");
//     }catch(err){
//         console.error("Error in fetching the orders",err);
//     }
// })

// app.post('/bedekar/dashboard', async (req, res) => {
//     const { tableNo, blockNo } = req.body;
  
//     try {
//       // 1) Find the existing orders in AdminDashboard
//       const existingOrders = await AdminDashboardOrdersModel.find({ tableNo, blockNo });
//       if (!existingOrders.length) {
//         return res.status(404).json({ message: "No orders found to clear" });
//       }
  
//       // 2) For each found order, store them in AllOrders
//       for (const order of existingOrders) {
//         await AllOrdersModel.create({
//           tableNo: order.tableNo,
//           blockNo: order.blockNo,
//           orders: order.orders,
//           clearedAt: new Date()
//         });
//       }
  
//       // 3) Delete them from AdminDashboard
//       await AdminDashboardOrdersModel.deleteMany({ tableNo, blockNo });
  
//       res.status(200).json({ message: "Orders archived & cleared from DB" });
//     } catch (err) {
//       console.error("Error clearing/archiving orders:", err);
//       res.status(500).json({ error: "Failed to clear & archive" });
//     }
//   });

app.post('/bedekar/dashboard', async (req, res) => {
    const { tableNo, blockNo } = req.body;
    
    // Validate input
    if (!tableNo || !blockNo) {
        return res.status(400).json({ message: "Missing tableNo or blockNo" });
    }
    
    try {
      // Find the existing orders in AdminDashboardOrdersModel for this table and block.
      const existingOrders = await AdminDashboardOrdersModel.find({ tableNo, blockNo });
    
      // If no orders exist, create a new empty order and return it.
      if (!existingOrders.length) {
        const newOrder = new AdminDashboardOrdersModel({
          tableNo,
          blockNo,
          orders: { items: [], total: 0, token: 0 } // or assign a default token as needed
        });
        await newOrder.save();
        console.log(`No existing orders found for Table: ${tableNo}, Block: ${blockNo}. New empty order created.`);
        return res.status(201).json({ message: "No orders to clear. New empty order created.", order: newOrder });
      }
    
      // If orders are found, archive each one in AllOrdersModel.
      for (const order of existingOrders) {
        await AllOrdersModel.create({
          tableNo: order.tableNo,
          blockNo: order.blockNo,
          orders: order.orders,
          clearedAt: new Date()
        });
      }
    
      // Delete them from AdminDashboardOrdersModel.
      await AdminDashboardOrdersModel.deleteMany({ tableNo, blockNo });
    
      console.log(`Orders for Table: ${tableNo}, Block: ${blockNo} archived and cleared.`);
      res.status(200).json({ message: "Orders archived & cleared from DB" });
    } catch (err) {
      console.error("Error clearing/archiving orders:", err);
      res.status(500).json({ error: "Failed to clear & archive orders", details: err.message });
    }
  });
  
  app.delete('/admin/bill', async (req, res) => {
    const { tableNo, blockNo } = req.body;
  
    if (!tableNo || !blockNo) {
      return res.status(400).json({ message: "Missing tableNo or blockNo" });
    }
  
    try {
      // Find existing orders
      const existingOrders = await AdminDashboardOrdersModel.find({ tableNo, blockNo });
  
      if (!existingOrders.length) {
        return res.status(404).json({ message: "No active orders found for this table and block" });
      }
  
      // Archive each order to AllOrdersModel
      await AllOrdersModel.insertMany(existingOrders);
  
      // Delete from AdminDashboardOrdersModel
      await AdminDashboardOrdersModel.deleteMany({ tableNo, blockNo });
  
      console.log(`Orders for Table: ${tableNo}, Block: ${blockNo} archived and cleared.`);
      return res.status(200).json({ message: "Orders archived and cleared successfully" });
  
    } catch (err) {
      console.error("Error clearing/archiving orders:", err);
      return res.status(500).json({ error: "Failed to clear & archive orders", details: err.message });
    }
  });
  

  app.get('/bedekar/dashboard', async (req, res) => {
    try {
      // Retrieve all orders and sort by tableNo in ascending order
      const orders = await AdminDashboardOrdersModel.find().sort({ tableNo: 1 });
      console.log("Sorted orders fetched successfully");
      res.status(200).json(orders);
    } catch (error) {
      console.error("Error fetching sorted orders for bedekar dashboard", error);
      res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
  });

  // GET all orders (bills) for a table across any block
app.get('/admin/bills', async (req, res) => {

    console.log('GET /admin/bills → tableNo=', req.query.tableNo);
    const { tableNo } = req.query;
  
    if (!tableNo) {
      return res.status(400).json({ message: 'Missing tableNo parameter' });
    }
  
    try {
      // Find all orders for this table, across any block
      const bills = await AdminDashboardOrdersModel.find({ tableNo });
  
      // Optionally sort by blockNo or createdAt:
      // .sort({ blockNo: 1, 'orders.token': 1 })
  
      res.status(200).json(bills);
    } catch (err) {
      console.error('Error fetching bills for table', tableNo, err);
      res.status(500).json({ message: 'Server error fetching bills' });
    }
  });
  app.get('/admin/tbbills', async (req, res) => {
    const { tableNo, blockNo } = req.query;
  
    console.log('GET /admin/bills → tableNo =', tableNo, ', blockNo =', blockNo);
  
    // Check if either tableNo or blockNo is missing
    if (!tableNo || !blockNo) {
      return res.status(400).json({ message: 'Missing tableNo or blockNo parameter' });
    }
  
    try {
      // Find all orders matching both tableNo and blockNo
      const bills = await AdminDashboardOrdersModel.find({ tableNo, blockNo });
  
      // Optional: sort by token or createdAt
      // .sort({ 'orders.token': 1 })
  
      res.status(200).json(bills);
    } catch (err) {
      console.error('Error fetching bills for table', tableNo, 'block', blockNo, err);
      res.status(500).json({ message: 'Server error fetching bills' });
    }
  });
  app.get('/admin/bills/all', async (req, res) => {
    console.log('GET /admin/bills/all');
  
    try {
      // Get all bills, regardless of table number
      const allBills = await AdminDashboardOrdersModel.find();
  
      res.status(200).json(allBills);
    } catch (err) {
      console.error('Error fetching all bills:', err);
      res.status(500).json({ message: 'Server error fetching all bills' });
    }
  });
  


const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
