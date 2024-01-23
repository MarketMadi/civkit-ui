import React, { createContext, useState } from 'react';

export const LoginContext = React.createContext({
    credentials: null,
    setCredentials: () => {}
  });
  
export const LoginProvider = ({ children }) => {
  const [credentials, setCredentials] = useState({ npub: '', nsec: '' });

  return (
    <LoginContext.Provider value={{ credentials, setCredentials }}>
      {children}
    </LoginContext.Provider>
  );
};
