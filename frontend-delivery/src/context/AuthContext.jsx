import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    if (token && !user) {
      const savedUser = JSON.parse(localStorage.getItem('user'));
      if (savedUser) setUser(savedUser);
    }
  }, [token, user]);

  const login = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    setToken(data.token);

    const tipo = data.user.tipo;
    if (tipo === 'cliente') {
      navigate('/dashboard-cliente');
    } else if (tipo === 'empresa') {
      navigate('/dashboard-empresa');
    } else if (tipo === 'admin') {
      navigate('/dashboard-admin');
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);