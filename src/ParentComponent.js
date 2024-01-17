import React, { useState } from 'react';
import OrderBook from './OrderBook';
import CreateOrderForm from './CreateOrderForm';

const ParentComponent = () => {
  const [orders, setOrders] = useState([]);

  const handleAddOrder = (newOrder) => {
    setOrders([...orders, { ...newOrder, id: orders.length + 1 }]);
  };

  return (
    <div>
      <CreateOrderForm onCreateOrder={handleAddOrder} />
      <OrderBook orders={orders} />
    </div>
  );
};

export default ParentComponent;
