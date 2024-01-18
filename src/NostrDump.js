import React, { useState, useEffect, useRef } from 'react';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const SendOrderEvent = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [receivedEvents, setReceivedEvents] = useState([]);
  const wsRef = useRef(null);

  const subscriptionId = 'subscription_' + Math.random().toString(36).substring(7);

  useEffect(() => {
    wsRef.current = new WebSocket('ws://localhost:7000');

    wsRef.current.onopen = () => {
      setIsConnected(true);
      subscribeToAllEvents();
    };

    wsRef.current.onmessage = (event) => {
      try {
        const [type, subscriptionId, eventData] = JSON.parse(event.data);
        if (type === 'EVENT') {
          setReceivedEvents(prevEvents => [...prevEvents, eventData]);
        }
      } catch (error) {
        console.error('Error processing event:', error);
      }
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const subscribeToAllEvents = () => {
    const subscriptionMessage = JSON.stringify([
      "REQ",
      subscriptionId,
      {} // An empty filter object to receive all types of events
    ]);
    wsRef.current.send(subscriptionMessage);
  };

  const renderReceivedEvents = () => {
    return receivedEvents.map((event, index) => (
      <div key={index}>
        <p>Received Event: {JSON.stringify(event)}</p>
      </div>
    ));
  };

  return (
    <div>
      <h2>Received Events</h2>
      {isConnected ? <div>{renderReceivedEvents()}</div> : <p>Connecting to the relay...</p>}
    </div>
  );
};

export default SendOrderEvent;