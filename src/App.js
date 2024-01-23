import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import OrderBook from './OrderBook';
import Home from './Home';
import CreateOrderForm from './CreateOrderForm';
import LockBondPage from './LockBondPage';
import InvoiceSubmissionPage from './InvoiceSubmissionPage';
import ChatPage from './ChatPage';
import ConfirmOrderPage from './ConfirmOrderPage';
import OrderCompletePage from './OrderCompletePage';
import SendTestEvent from './SendTestEvent';
import NostrDump from './NostrDump'; // Import the NostrDump component
import Login from './Login';
import { LoginContext } from './LoginContext';

function App() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // New state for selected order
  const [userRole, setUserRole] = useState(null); // 'user' or 'orderbookRunner'
  const [credentials, setCredentials] = useState(null);

  const handleCreateOrder = (newOrder) => {
    setOrders([...orders, { ...newOrder, id: orders.length + 1 }]);
  };

  const handleInvoiceSubmit = (invoice) => {
    // Handle the submitted invoice here
    console.log('Invoice submitted:', invoice);
    // Additional logic for processing the invoice
  };

  const handleConfirmOrder = () => {
    console.log('Order confirmed');
    // Logic to release the hold invoice and complete the order
  };

  return (
    <LoginContext.Provider value={{ credentials, setCredentials }}>
    <Router>
      <div>
        <nav>
          <Link to="/">Home</Link> | 
          <Link to="/orderbook">OrderBook</Link> | 
          <Link to="/createorder">Create Order</Link> |
          <Link to="/sendtestevent">Send Test Event</Link> | 
          <Link to="/nostr-dump">Nostr Dump</Link> {/* Link to NostrDump */} | 
          <Link to="/orderbook-runner-login">Orderbook Runner Login</Link> | 
          <Link to="/login">User Login</Link>
          {userRole === 'orderbookRunner' && <Link to="/nostr-dump">Nostr Dump</Link>}


        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/orderbook" element={<OrderBook orders={orders} onSelectOrder={setSelectedOrder} />} />
          <Route path="/createorder" element={<CreateOrderForm onCreateOrder={handleCreateOrder} />} />
          <Route path="/submitinvoice" element={<InvoiceSubmissionPage onInvoiceSubmit={handleInvoiceSubmit} />} />
          <Route path="/lockbond" element={<LockBondPage />} />        
          <Route path="/chat" element={<ChatPage onConfirmOrder={handleConfirmOrder} />} />
          <Route path="/confirmorder" element={<ConfirmOrderPage />} />
          <Route path="/ordercomplete" element={<OrderCompletePage orderDetails={selectedOrder} />} />
          <Route path="/sendtestevent" element={<SendTestEvent />} />
          <Route path="/nostr-dump" element={<NostrDump />} /> {/* Route for NostrDump */}
          <Route path="/login" element={<Login setUserRole={setUserRole} />} />

        </Routes>
      </div>
    </Router>
    </LoginContext.Provider>
  );
}

export default App;
