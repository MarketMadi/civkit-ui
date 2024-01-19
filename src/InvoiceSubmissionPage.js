import React, { useState, useEffect, useRef } from 'react';
import { Container, Paper, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { schnorr, utils } from 'noble-secp256k1';

const InvoiceSubmissionPage = ({ onInvoiceSubmit, orderDetails }) => {
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState('');
  const [error, setError] = useState('');
  const wsRef = useRef(null);

  // Replace these with actual public and private keys
  const publicKey = process.env.REACT_APP_NPUB_KEY;
  const privateKey = process.env.REACT_APP_PRIVATE_KEY;

  useEffect(() => {
    wsRef.current = new WebSocket('ws://localhost:7000');
    wsRef.current.onopen = () => console.log('Connected to Nostr relay');
    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('WebSocket connection error');
    };
    return () => wsRef.current?.close();
  }, []);

  const byteArrayToHex = (byteArray) => {
    return Array.from(byteArray, byte => {
      return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
  };

  const createNostrEvent = async (invoice) => {
    try {
      const eventContent = {
        pubkey: publicKey,
        created_at: Math.floor(Date.now() / 1000),
        kind: 1, // Custom kind for invoice submission
        tags: [],
        content: JSON.stringify({ invoice, orderDetails }),
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
      console.error('Error in createNostrEvent:', error);
      throw new Error('Failed to create Nostr event: ' + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!invoice) {
      setError('Please enter an invoice.');
      return;
    }

    try {
      const nostrEvent = await createNostrEvent(invoice);
      const message = JSON.stringify(['EVENT', nostrEvent]);
      wsRef.current.send(message);
      navigate('/chat'); // Redirect to the chat page after sending the invoice
    } catch (error) {
      console.error('Error submitting invoice:', error);
      setError('Error submitting invoice: ' + error.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h5" style={{ marginBottom: '20px' }}>Submit Invoice</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Lightning Invoice"
            variant="outlined"
            fullWidth
            value={invoice}
            onChange={(e) => setInvoice(e.target.value)}
            error={!!error}
            helperText={error}
            style={{ marginBottom: '20px' }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Submit
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default InvoiceSubmissionPage;
