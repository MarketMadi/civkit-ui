import React, { useState, useEffect, useRef } from 'react';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { schnorr, utils } from 'noble-secp256k1';
import { useNavigate } from 'react-router-dom';

function SendOrderEvent() {
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [receivedEvents, setReceivedEvents] = useState([]);
  const [order, setOrder] = useState({
    amount: '',
    currency: '',
    paymentMethod: '',
    timer: '',
    price: '',
    bond: '',
    premium: '',
    orderType: 'Buy',
  });
  const wsRef = useRef(null);

  useEffect(() => {
    wsRef.current = new WebSocket('ws://localhost:7000');

    wsRef.current.onopen = () => {
      setIsConnected(true);
      setErrorMessage('');
    };

    wsRef.current.onmessage = (event) => {
      console.log('Received message:', event.data);
      const eventData = JSON.parse(event.data);
      setReceivedEvents(prevEvents => [...prevEvents, eventData]);
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setErrorMessage('Connection error:' + error.message);
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const byteArrayToHex = (byteArray) => {
    return Array.from(byteArray, byte => {
      return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
  };

  const signEventData = async (eventData, privateKey) => {
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(eventData);
    const messageHash = await utils.sha256(encodedData);
    const signature = await schnorr.sign(messageHash, privateKey);
    return byteArrayToHex(signature);
  };

  const handleChange = (e) => {
    setOrder({ ...order, [e.target.name]: e.target.value });
  };

  const handleSendEvent = async () => {
    if (!isConnected) {
      throw new Error('Not connected to WebSocket');
    }

    const publicKey = process.env.REACT_APP_NPUB_KEY;
    const privateKey = process.env.REACT_APP_PRIVATE_KEY;

    const eventContent = {
      pubkey: publicKey,
      created_at: Math.floor(Date.now() / 1000),
      kind: 1,
      tags: [],
      content: JSON.stringify(order),
    };

    const serializedEvent = JSON.stringify([
      0,
      eventContent.pubkey,
      eventContent.created_at,
      eventContent.kind,
      eventContent.tags,
      eventContent.content,
    ]);

    const signature = await signEventData(serializedEvent, privateKey);
    const eventId = await utils.sha256(new TextEncoder().encode(serializedEvent));

    const testEvent = {
      ...eventContent,
      id: byteArrayToHex(eventId),
      sig: signature,
    };

    const message = JSON.stringify(['EVENT', testEvent]);
    wsRef.current.send(message);

    // Redirect to the submit invoice page after sending the order
    navigate('/lockbond');
  };

  return (
    <div>
      <TextField label="Amount" name="amount" fullWidth value={order.amount} onChange={handleChange} />
      <TextField label="Currency" name="currency" fullWidth value={order.currency} onChange={handleChange} />
      <TextField label="Payment Method" name="paymentMethod" fullWidth value={order.paymentMethod} onChange={handleChange} />
      <TextField label="Timer" name="timer" fullWidth value={order.timer} onChange={handleChange} />
      <TextField label="Price" name="price" fullWidth value={order.price} onChange={handleChange} />
      <TextField label="Bond" name="bond" fullWidth value={order.bond} onChange={handleChange} />
      <TextField label="Premium" name="premium" fullWidth value={order.premium} onChange={handleChange} />
      <FormControl fullWidth>
        <InputLabel>Order Type</InputLabel>
        <Select name="orderType" value={order.orderType} label="Order Type" onChange={handleChange}>
          <MenuItem value="Buy">Buy</MenuItem>
          <MenuItem value="Sell">Sell</MenuItem>
        </Select>
      </FormControl>
      <Button onClick={handleSendEvent} disabled={!isConnected} variant="contained" sx={{ mt: 3, mb: 2 }}>
        Send Order
      </Button>
      {errorMessage && <p className="error">{errorMessage}</p>}
      {isConnected ? '' : 'Connecting to WebSocket...'}
      
      <div>
        <h2>Received Events</h2>
        {receivedEvents.map((event, index) => (
          <div key={index}>
            <pre>{JSON.stringify(event, null, 2)}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SendOrderEvent;