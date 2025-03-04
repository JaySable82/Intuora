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
import KitchenStatusModel from './models/kitchenStatus.js';
import purchaseOrderModel from './models/purchaseOrder.js';
import rawMaterialModel from './models/rawMaterial.js';
import escpos from 'escpos';
import EscposBT from 'escpos-bluetooth';



const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

escpos.Bluetooth = EscposBT;

const address = 'XX:XX:XX:XX:XX:XX'; // Replace with your printer's Bluetooth MAC Address

// Create Bluetooth device connection
const device = new escpos.Bluetooth(address, 1); // Channel 1 (default)
const printer = new escpos.Printer(device);

// Create a Socket.IO server instance with CORS options
app.use(cors({
    // origin:process.env.REACT_APP_LOCALHOST, // The origin of your client application
    origin:process.env.FE_L,
    methods: ["GET", "POST", "DELETE", "OPTION", "PATCH","PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.post('/print', async (req, res) => {
    const { items, total, token } = req.body;
  
    device.open(async (err) => {
      if (err) {
        console.error('Printer Connection Error:', err);
        return res.status(500).send({ message: 'Printer connection failed' });
      }
  
      // Print Header
      printer
        .align('ct')
        .style('b')
        .text(`Token No.${token}`)
        .newLine()
        .text('--------------------------------')
        .align('lt')
        .text('Item            Qty   Price')
        .text('--------------------------------');
  
      // Print Items
      items.forEach((item) => {
        const itemName = item.name.padEnd(15);
        const qty = String(item.quantity).padStart(3);
        const price = String(item.price).padStart(6);
        printer.text(`${itemName} ${qty} ${price}`);
      });
  
      // Print Total
      printer
        .text('--------------------------------')
        .text(`Total:        ${items.length}  ${total}`)
        .text('--------------------------------')
        .cut()
        .close(() => {
          console.log('KOT Printed Successfully');
          res.status(200).send({ message: 'KOT printed successfully' });
        });
    });
});