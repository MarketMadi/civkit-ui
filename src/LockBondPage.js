import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Button } from '@mui/material';
import { schnorr, utils } from 'noble-secp256k1';

const LockBondPage = ({ orderDetails }) => {
  const navigate = useNavigate();
  const wsRef = useRef(null);
  const [error, setError] = useState('');

  // Replace these with actual public and private keys
  const publicKey = process.env.REACT_APP_NPUB_KEY;
  const privateKey = process.env.REACT_APP_PRIVATE_KEY;

  useEffect(() => {
    wsRef.current = new WebSocket('ws://localhost:7000');
    wsRef.current.onopen = () => console.log('Connected to Nostr relay');
    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('WebSocket connection error: ' + error.message);
    };
    return () => wsRef.current?.close();
  }, []);

  const byteArrayToHex = (byteArray) => {
    return Array.from(byteArray, byte => {
      return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
  };

  const createNostrEvent = async () => {
    try {
      const eventContent = {
        pubkey: publicKey,
        created_at: Math.floor(Date.now() / 1000),
        kind: 1002, // Custom kind for bond locking
        tags: [],
        content: JSON.stringify({ message: 'Bond is locked', orderDetails }),
      };

      const serializedEvent = JSON.stringify([
        0,
        eventContent.pubkey,
        eventContent.created_at,
        eventContent.kind,
        eventContent.tags,
        eventContent.content,
      ]);

      const messageHash = await utils.sha256(new TextEncoder().encode(serializedEvent));
      const signature = await schnorr.sign(messageHash, privateKey);

      return {
        ...eventContent,
        id: byteArrayToHex(await utils.sha256(new TextEncoder().encode(serializedEvent))),
        sig: byteArrayToHex(signature),
      };
    } catch (error) {
      console.error('Error creating Nostr event:', error);
      throw new Error('Failed to create Nostr event: ' + error.message);
    }
  };

  const handleLockBond = async () => {
    try {
      const nostrEvent = await createNostrEvent();
      const message = JSON.stringify(['EVENT', nostrEvent]);
      wsRef.current.send(message);
      navigate('/submitinvoice'); // Redirect to the invoice submission page after locking the bond
    } catch (error) {
      console.error('Error locking bond:', error);
      setError('Error locking bond: ' + error.message);
    }
  };

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Paper sx={{ padding: 2 }}>
        <Typography variant="h5">Lock Bond</Typography>
        {/* Display QR Code here */}
        <Typography sx={{ mt: 2 }}>Your bond amount is locked in your wallet.</Typography>
        <Button variant="contained" color="primary" onClick={handleLockBond} sx={{ mt: 2 }}>
          Proceed to Invoice Submission
        </Button>
        {error && <Typography color="error">{error}</Typography>}
      </Paper>
    </Box>
  );
};

export default LockBondPage;
