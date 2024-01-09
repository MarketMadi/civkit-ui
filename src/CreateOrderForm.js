import React, { useState } from 'react';
import './CreateOrderForm.css'; // Import the CSS file

const CreateOrderForm = ({ onCreateOrder }) => {
  const [orderType, setOrderType] = useState('Buy');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [premium, setPremium] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const order = {
      orderType,
      amount: parseFloat(amount),
      currency,
      paymentMethod,
      premium: parseFloat(premium),
    };
    onCreateOrder(order);
    // Reset form fields
    setAmount('');
    setCurrency('USD');
    setPaymentMethod('');
    setPremium('');
  };

  return (
    <div className="CreateOrderForm">
      <form onSubmit={handleSubmit}>
        <div className="orderTypeDropdown">
          <label>Order Type:</label>
          <select
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
          >
            <option value="Buy">Buy</option>
            <option value="Sell">Sell</option>
          </select>
        </div>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Currency:</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="USD">USD</option>
            <option value="Naira">Naira</option>
            <option value="LKR">LKR</option>
            <option value="KSH">KSH</option>
          </select>
        </div>
        <div>
          <label>Payment Method:</label>
          <input
            type="text"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Premium (%):</label>
          <input
            type="number"
            value={premium}
            onChange={(e) => setPremium(e.target.value)}
            required
          />
        </div>
        <div>
          <button type="submit">Create Order</button>
        </div>
      </form>
    </div>
  );
};

export default CreateOrderForm;
