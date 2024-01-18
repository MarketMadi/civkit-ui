import React, { useState, useEffect, useRef } from 'react';
import { schnorr, utils } from 'noble-secp256k1';

function SendTestEvent() {
  const [isConnected, setIsConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const wsRef = useRef(null);

  useEffect(() => {
    wsRef.current = new WebSocket('ws://localhost:7000');

    wsRef.current.onopen = () => {
      setIsConnected(true);
      setErrorMessage('');
    };

    wsRef.current.onmessage = (event) => {
      console.log('Received message:', event.data);
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

  const handleSendEvent = async () => {
    try {
      if (!isConnected) {
        throw new Error('Not connected to WebSocket');
      }

      const eventContent = {
        pubkey: 'ad466b6fa66a8509912f6ec2b998f0453c492c49438917a62b35d383d3c58cfc',
        created_at: Math.floor(Date.now() / 1000),
        kind: 1,
        tags: [],
        content: 'Simple test message',
      };

      const serializedEvent = JSON.stringify([
        0,
        eventContent.pubkey,
        eventContent.created_at,
        eventContent.kind,
        eventContent.tags,
        eventContent.content,
      ]);

      const privateKey = '10cd8c5c8a1fbb03120be5afe28cc3d2d37d52bedd8320d94315acafded3c354';
      const signature = await signEventData(serializedEvent, privateKey);
      const eventId = await utils.sha256(new TextEncoder().encode(serializedEvent));

      const testEvent = {
        ...eventContent,
        id: byteArrayToHex(eventId),
        sig: signature,
      };

      const message = JSON.stringify(['EVENT', testEvent]);
      console.log('Sending message:', message);
      wsRef.current.send(message);
    } catch (error) {
      console.error('Error sending event:', error);
      setErrorMessage('Failed to send event:' + error.message);
    }
  };

  return (
    <div>
      {isConnected ? (
        <button onClick={handleSendEvent}>Send Event</button>
      ) : (
        'Connecting to WebSocket...'
      )}
      {errorMessage && <p className="error">{errorMessage}</p>}
    </div>
  );
}

export default SendTestEvent;
