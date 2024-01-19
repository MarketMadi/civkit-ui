import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Button } from '@mui/material';
import { schnorr, utils } from 'noble-secp256k1';

const ConfirmOrderPage = () => {
  const navigate = useNavigate();
  const wsRef = useRef(null);

  const npub = process.env.REACT_APP_NPUB_KEY;
  const nsec = process.env.REACT_APP_PRIVATE_KEY;

  useEffect(() => {
    wsRef.current = new WebSocket('ws://localhost:7000');
    wsRef.current.onopen = () => console.log('Connected to Nostr relay');
    wsRef.current.onerror = (error) => console.error('WebSocket error:', error);
    return () => wsRef.current?.close();
  }, []);

  const byteArrayToHex = (byteArray) => {
    return Array.from(byteArray, byte => {
      return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
  };

  const createNostrEvent = async (content, kind = 1) => {
    try {
      const eventContent = {
        pubkey: npub,
        created_at: Math.floor(Date.now() / 1000),
        kind: kind,
        tags: [],
        content: JSON.stringify(content),
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
      const signature = await schnorr.sign(messageHash, nsec);

      return {
        ...eventContent,
        id: byteArrayToHex(await utils.sha256(new TextEncoder().encode(serializedEvent))),
        sig: byteArrayToHex(signature),
      };
    } catch (error) {
      console.error('Error creating Nostr event:', error);
      throw error;
    }
  };

  const handleConfirm = async () => {
    try {
      const confirmMessage = 'Order confirmed';
      const nostrEvent = await createNostrEvent(confirmMessage, 2); // Custom kind for order confirmation
      const nostrMessage = JSON.stringify(['EVENT', nostrEvent]);
      wsRef.current.send(nostrMessage);
      navigate('/ordercomplete');
    } catch (error) {
      console.error('Error sending confirm order message:', error);
    }
  };

  const handleCancel = async () => {
    try {
      const cancelMessage = 'Order cancelled';
      const nostrEvent = await createNostrEvent(cancelMessage, 3); // Custom kind for order cancellation
      const nostrMessage = JSON.stringify(['EVENT', nostrEvent]);
      wsRef.current.send(nostrMessage);
      navigate(-1); // Go back to the previous page
    } catch (error) {
      console.error('Error sending cancel order message:', error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h5" style={{ marginBottom: '20px' }}>Are you sure?</Typography>
        <Button variant="contained" color="primary" onClick={handleConfirm} fullWidth>
          Yes
        </Button>
        <Button variant="contained" color="secondary" onClick={handleCancel} fullWidth style={{ marginTop: '10px' }}>
          No
        </Button>
      </Paper>
    </Container>
  );
};

export default ConfirmOrderPage;
