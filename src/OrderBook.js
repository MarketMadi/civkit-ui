import React from 'react';
import { Box, Paper, Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, AppBar, Toolbar } from '@mui/material';

const OrderBook = ({ orders }) => {
  const takeOrder = (orderId) => {
    console.log("Taking order with ID:", orderId);
    // Implement the logic for taking an order
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
php
Copy code
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

