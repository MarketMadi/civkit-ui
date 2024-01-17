import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const InvoiceSubmissionPage = ({ onInvoiceSubmit, orderDetails }) => {
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!invoice) {
      setError('Please enter an invoice.');
      return;
    }
    // Additional validation logic can go here
    onInvoiceSubmit(invoice);
    navigate('/chat'); // Redirect to the chat page

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
