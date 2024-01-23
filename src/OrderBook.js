import React, { useState, useEffect } from 'react';
import { Box, Paper, Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, AppBar, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const OrderBook = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([
    // Sample order
    {
      id: 'sample1',
      username: 'SampleUser',
      amount: '100',
      currency: 'USD',
      paymentMethod: 'Bank Transfer',
      expiryDate: '2024-02-01',
      timer: '48h',
      price: '5000',
      bond: '200',
      premium: '5%',
      reputationScore: '95',
      orderType: 'Buy'
    }
  ]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:7000');

    ws.onopen = () => {
      console.log('Connected to Nostr relay');
    };

    ws.onmessage = (event) => {
      const eventData = JSON.parse(event.data);
      // Assuming eventData is an array of events
      const newOrders = eventData.filter(e => e.kind === 1); // Filter for order submission events
      setOrders(prevOrders => [...prevOrders, ...newOrders]);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setErrorMessage('Connection error:' + error.message);
    };

    return () => {
      ws.close();
    };
  }, []);

  const takeOrder = (order) => {
    // Logic to handle taking an order
    navigate('/lockbond', { state: { orderDetails: order } });
  };
  const renderTableRows = (orderType) => {
    return orders
      .filter(order => order.orderType === orderType)
      .map((order, index) => (
        <TableRow key={index}>
          <TableCell>{order.username}</TableCell>
          <TableCell>{order.amount}</TableCell>
          <TableCell>{order.currency}</TableCell>
          <TableCell>{order.paymentMethod}</TableCell>
          <TableCell>{order.expiryDate}</TableCell>
          <TableCell>{order.timer}</TableCell>
          <TableCell>{order.price}</TableCell>
          <TableCell>{order.bond}</TableCell>
          <TableCell>{order.premium}</TableCell>
          <TableCell>{order.reputationScore}</TableCell>
          <TableCell align="right">
            <Button variant="contained" color="primary" onClick={() => takeOrder(order.id)}>
              Take Order
            </Button>
          </TableCell>
        </TableRow>
      ));
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            OrderBook
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2 }}>
        <Grid container spacing={2}>
          {/* Buy Orders Table */}
          <Grid item xs={12}>
            <Typography variant="h4" align="center" gutterBottom>
              Buy Orders
            </Typography>
            <TableContainer component={Paper} elevation={12}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Username</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Currency</TableCell>
                    <TableCell>Payment Method</TableCell>
                    <TableCell>Expiry Date</TableCell>
                    <TableCell>Timer</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Bond</TableCell>
                    <TableCell>Premium</TableCell>
                    <TableCell>Reputation Score</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {renderTableRows('Buy')}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* Sell Orders Table */}
          <Grid item xs={12}>
        <Typography variant="h4" align="center" gutterBottom>
          Sell Orders
        </Typography>
        <TableContainer component={Paper} elevation={12}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Currency</TableCell>
                <TableCell>Payment Method</TableCell>
                <TableCell>Expiry Date</TableCell>
                <TableCell>Timer</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Bond</TableCell>
                <TableCell>Premium</TableCell>
                <TableCell>Reputation Score</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {renderTableRows('Sell')}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  </Box>
</Box>
);
};

export default OrderBook;

