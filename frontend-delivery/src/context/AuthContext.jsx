import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loadingAuth, setLoadingAuth] = useState(true); 

  useEffect(() => {
    console.log("AuthProvider useEffect: Verificando auth inicial...");
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        console.log("AuthProvider: Usuário restaurado do localStorage", parsedUser);
      } catch (error) {
        console.error('Erro ao fazer parse do usuário do localStorage:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoadingAuth(false);
  }, []);

  const login = async (data) => {
    console.log("AuthContext login: ", data);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    console.log("AuthContext logout");
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
  };

  const contextValue = {
    user,
    token,
    loadingAuth,
    login,
    logout,
    setUser, 
    setToken
  };

  console.log("AuthProvider render, loadingAuth:", loadingAuth, "User:", user);
  if (loadingAuth) {
    return null;
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};