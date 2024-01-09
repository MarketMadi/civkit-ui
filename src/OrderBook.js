import React from 'react';
import './OrderBook.css'; // Import the CSS file

const OrderBook = ({ orders }) => {
  return (
    <div className="OrderBook">
      <h2>Order Book</h2>
      {/* Buy Orders Table */}
      <div className="BuyOrders">
        <h3>Buy Orders</h3>
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Amount</th>
              <th>Currency</th>
              <th>Payment Method</th>
              <th>Expiry Date</th>
              <th>Timer</th>
              <th>Price</th>
              <th>Bond</th>
              <th>Premium</th>
              <th>Reputation Score</th> {/* New Column */}
            </tr>
          </thead>
          <tbody>
            {orders.filter(order => order.orderType === 'Buy').map((order, index) => (
              <tr key={index}>
                <td>{order.username}</td>
                <td>{order.amount}</td>
                <td>{order.currency}</td>
                <td>{order.paymentMethod}</td>
                <td>{order.expiryDate}</td>
                <td>{order.timer}</td>
                <td>{order.price}</td>
                <td>{order.bond}</td>
                <td>{order.premium}</td>
                <td>{order.reputationScore}</td> {/* New Data Field */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sell Orders Table */}
      <div className="SellOrders">
        <h3>Sell Orders</h3>
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Amount</th>
              <th>Currency</th>
              <th>Payment Method</th>
              <th>Expiry Date</th>
              <th>Timer</th>
              <th>Price</th>
              <th>Bond</th>
              <th>Premium</th>
              <th>Reputation Score</th> {/* New Column */}
            </tr>
          </thead>
          <tbody>
            {orders.filter(order => order.orderType === 'Sell').map((order, index) => (
              <tr key={index}>
                <td>{order.username}</td>
                <td>{order.amount}</td>
                <td>{order.currency}</td>
                <td>{order.paymentMethod}</td>
                <td>{order.expiryDate}</td>
                <td>{order.timer}</td>
                <td>{order.price}</td>
                <td>{order.bond}</td>
                <td>{order.premium}</td>
                <td>{order.reputationScore}</td> {/* New Data Field */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderBook;
