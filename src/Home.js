import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import './Home.css';

const Home = () => {
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
      </header>
    </div>
  );
};

export default Home;
