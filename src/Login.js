import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from './LoginContext';

const Login = () => {
  const [npub, setNpub] = useState('');
  const [nsec, setNsec] = useState('');
  const { setCredentials } = useContext(LoginContext);
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    setCredentials({ npub, nsec });
    navigate('/'); // Redirect to home page
  };

  return (
    <form onSubmit={handleLogin}>
      <div>
        <label htmlFor="npub">Public Key (npub):</label>
        <input
          type="text"
          id="npub"
          value={npub}
          onChange={(e) => setNpub(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="nsec">Secret Key (nsec):</label>
        <input
          type="password" // Use password type for security
          id="nsec"
          value={nsec}
          onChange={(e) => setNsec(e.target.value)}
          required
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
