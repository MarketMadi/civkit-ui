// OrderCompletePage.js
import React from 'react';
import { Container, Paper, Typography } from '@mui/material';

const OrderCompletePage = ({ orderDetails }) => {
    if (!orderDetails) {
        // Handle the case where no order details are available
        return <div>No order details available.</div>;
      }
  return (
    <Container component="main" maxWidth="xs">
      <Paper style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h5" style={{ marginBottom: '20px' }}>Order Complete</Typography>
        {/* Display order details here */}
        <Typography>Order ID: {orderDetails.id}</Typography>
        {/* Add more order details as needed */}
      </Paper>
    </Container>
  );
};

export default OrderCompletePage;
