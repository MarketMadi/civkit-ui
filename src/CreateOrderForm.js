import React, { useState, useEffect } from 'react';
import { Container, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { schnorr, utils } from 'noble-secp256k1';

const CreateOrderForm = ({ onCreateOrder }) => {
  const [newOrder, setNewOrder] = useState({
    amount: '',
    currency: '',
    paymentMethod: '',
    timer: '',
    price: '',
    bond: '',
    premium: '',
    orderType: 'Buy',
  });

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const relayUrl = 'ws://localhost:7000';
    const ws = new WebSocket(relayUrl);

    ws.onopen = () => {
      console.log('Connected to Nostr relay');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  const byteArrayToHex = (byteArray) => {
    return Array.from(byteArray, byte => {
      return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
  };

  const signEventData = async (eventData, privateKey) => {
    try {
      const encoder = new TextEncoder();
      const encodedData = encoder.encode(eventData);
      const messageHash = await utils.sha256(encodedData);
      const signature = await schnorr.sign(messageHash, privateKey);
      return byteArrayToHex(signature);
    } catch (error) {
      console.error('Error in signEventData:', error);
      throw error;
    }
  };

  const handleChange = (e) => {
    setNewOrder({ ...newOrder, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket is not connected');
      return;
    }
  
    try {
      const publicKey = ''; // Replace with correct public key
      const eventContent = {
        pubkey: publicKey,
        created_at: Math.floor(Date.now() / 1000),
        kind: 1, // Set kind to 1 for order creation events
        tags: [],
        content: JSON.stringify(newOrder),
      };
  
      const serializedEvent = JSON.stringify([
        0,
        eventContent.pubkey,
        eventContent.created_at,
        eventContent.kind,
        eventContent.tags,
        eventContent.content,
      ]);
  
      const privateKey = ''; // Replace with your private key
      const signature = await signEventData(serializedEvent, privateKey);
      const eventId = await utils.sha256(new TextEncoder().encode(serializedEvent));
  
      const nostrEvent = {
        ...eventContent,
        id: byteArrayToHex(eventId),
        sig: signature,
      };
  
      socket.send(JSON.stringify(['EVENT', nostrEvent]));
      console.log('Order event sent');
  
      onCreateOrder(newOrder);
      setNewOrder({
        amount: '',
        currency: '',
        paymentMethod: '',
        timer: '',
        price: '',
        bond: '',
        premium: '',
        orderType: 'Buy',
      });
  
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <TextField
          required
          fullWidth
          label="Amount"
          name="amount"
          value={newOrder.amount}
          onChange={handleChange}
        />
        <TextField
          required
          fullWidth
          label="Currency"
          name="currency"
          value={newOrder.currency}
          onChange={handleChange}
        />
        <TextField
          required
          fullWidth
          label="Payment Method"
          name="paymentMethod"
          value={newOrder.paymentMethod}
          onChange={handleChange}
        />
        <TextField
          required
          fullWidth
          label="Timer"
          name="timer"
          value={newOrder.timer}
          onChange={handleChange}
        />
        <TextField
          required
          fullWidth
          label="Price"
          name="price"
          value={newOrder.price}
          onChange={handleChange}
        />
        <TextField
          required
          fullWidth
          label="Bond"
          name="bond"
          value={newOrder.bond}
          onChange={handleChange}
        />
        <TextField
          required
          fullWidth
          label="Premium"
          name="premium"
          value={newOrder.premium}
          onChange={handleChange}
        />
        <FormControl fullWidth>
          <InputLabel>Order Type</InputLabel>
          <Select
            name="orderType"
            value={newOrder.orderType}
            label="Order Type"
            onChange={handleChange}
          >
            <MenuItem value="Buy">Buy</MenuItem>
            <MenuItem value="Sell">Sell</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Create Order
        </Button>
      </form>
    </Container>
  );
};

export default CreateOrderForm;
