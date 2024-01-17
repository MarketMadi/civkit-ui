// CreateOrderForm.js
import React, { useState } from 'react';
import { Container, Paper, Table, TableBody, TableCell, TableRow, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
const CreateOrderForm = ({ onCreateOrder }) => {
  const [newOrder, setNewOrder] = useState({
    amount: '',
    currency: '',
    paymentMethod: '',
    timer: '',
    price: '',
    bond: '',
    premium: '',
    orderType: 'Buy',
  });

  const handleChange = (e) => {
    setNewOrder({ ...newOrder, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateOrder(newOrder);
    setNewOrder({
      amount: '',
      currency: '',
      paymentMethod: '',
      timer: '',
      price: '',
      bond: '',
      premium: '',
      orderType: 'Buy',
    }); // Reset form
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2 }}>
        <Table component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TableBody>
            {/* Amount */}
            <TableRow>
              <TableCell>
                <TextField
                  required
                  fullWidth
                  label="Amount"
                  name="amount"
                  value={newOrder.amount}
                  onChange={handleChange}
                />
              </TableCell>
            </TableRow>

            {/* Currency */}
            <TableRow>
              <TableCell>
                <TextField
                  required
                  fullWidth
                  label="Currency"
                  name="currency"
                  value={newOrder.currency}
                  onChange={handleChange}
                />
              </TableCell>
            </TableRow>

            {/* Payment Method */}
            <TableRow>
              <TableCell>
                <TextField
                  required
                  fullWidth
                  label="Payment Method"
                  name="paymentMethod"
                  value={newOrder.paymentMethod}
                  onChange={handleChange}
                />
              </TableCell>
            </TableRow>

            {/* Timer */}
            <TableRow>
              <TableCell>
                <TextField
                  required
                  fullWidth
                  label="Timer"
                  name="timer"
                  value={newOrder.timer}
                  onChange={handleChange}
                />
              </TableCell>
            </TableRow>

            {/* Price */}
            <TableRow>
              <TableCell>
                <TextField
                  required
                  fullWidth
                  label="Price"
                  name="price"
                  value={newOrder.price}
                  onChange={handleChange}
                />
              </TableCell>
            </TableRow>

            {/* Bond */}
            <TableRow>
              <TableCell>
                <TextField
                  required
                  fullWidth
                  label="Bond"
                  name="bond"
                  value={newOrder.bond}
                  onChange={handleChange}
                />
              </TableCell>
            </TableRow>

            {/* Premium */}
            <TableRow>
              <TableCell>
                <TextField
                  required
                  fullWidth
                  label="Premium"
                  name="premium"
                  value={newOrder.premium}
                  onChange={handleChange}
                />
              </TableCell>
            </TableRow>

            {/* Order Type */}
            <TableRow>
              <TableCell>
                <FormControl fullWidth>
                  <InputLabel>Order Type</InputLabel>
                  <Select
                    name="orderType"
                    value={newOrder.orderType}
                    label="Order Type"
                    onChange={handleChange}
                  >
                    <MenuItem value="Buy">Buy</MenuItem>
                    <MenuItem value="Sell">Sell</MenuItem>
                  </Select>
                </FormControl>
              </TableCell>
            </TableRow>

            {/* Submit Button */}
            <TableRow>
              <TableCell>
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                  Create Order
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default CreateOrderForm;
