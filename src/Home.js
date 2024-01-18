import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import './Home.css';

const Home = () => {
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');

  useEffect(() => {
    // Replace with your Nostr relay URL
    const relayUrl = 'ws://localhost:7000';

    const socket = new WebSocket(relayUrl);

    socket.onopen = () => {
      setConnectionStatus('Connected to Relay');
    };

    socket.onerror = (error) => {
      setConnectionStatus(`Error: ${error.message}`);
    };

    socket.onclose = () => {
      setConnectionStatus('Disconnected');
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Civkit</h1>
        <div className="link-container">
          <Link to="/" className="App-link">Home</Link> |
          <Link to="/orderbook" className="App-link">OrderBook</Link> |
          <Link to="/createorder" className="App-link">Create Order</Link> |
          <Link to="/stakingcredentials" className="App-link">Staking Credentials</Link>
        </div>
        <Logo />
        <p>{connectionStatus}</p>
      </header>
    </div>
  );
};

export default Home;
