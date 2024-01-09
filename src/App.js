import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import OrderBook from './OrderBook';
import Home from './Home';
import CreateOrderForm from './CreateOrderForm';

function App() {
  const [orders, setOrders] = useState([]);

  const handleCreateOrder = (newOrder) => {
    console.log('New Order:', newOrder); // Log new order
    const updatedOrders = [...orders, newOrder];
    console.log('Updated Orders:', updatedOrders); // Log updated orders list
    setOrders(updatedOrders);
  };

  return (
    <Router>
      <div>
        <nav>
          <Link to="/">Home</Link> | <Link to="/orderbook">OrderBook</Link> | <Link to="/createorder">Create Order</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/orderbook" element={<OrderBook orders={orders} />} />
          <Route path="/createorder" element={<CreateOrderForm onCreateOrder={handleCreateOrder} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
