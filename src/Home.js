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
          <Link to="/orderbook" className="App-link left-link">View the Orderbook</Link>
          <Link to="/createorder" className="App-link right-link">Create an Order</Link>
        </div>
        <Logo />
      </header>
    </div>
  );
};

export default Home;
