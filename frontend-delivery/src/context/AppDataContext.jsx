import React, { createContext, useState, useContext, useEffect } from 'react';
import cozinhaService from '../services/cozinhaService';
import modoPagamentoService from '../services/modoPagamentoService';
import { useAuth } from './AuthContext';
const AppDataContext = createContext();

export const AppDataProvider = ({ children }) => {
  const { token } = useAuth();
  const [cozinhas, setCozinhas] = useState([]);
  const [modosPagamento, setModosPagamento] = useState([]);
  const [loadingAppData, setLoadingAppData] = useState(false);
  const [appDataError, setAppDataError] = useState(null);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoadingAppData(true);
      setAppDataError(null);
      try {
        const [cozinhasRes, modosPagamentoRes] = await Promise.all([
          cozinhaService.listar(),
          modoPagamentoService.listar()
        ]);
        setCozinhas(cozinhasRes.data);
        setModosPagamento(modosPagamentoRes.data);
      } catch (error) {
        console.error('Erro ao carregar dados da aplicação:', error);
        setAppDataError(error.response?.data?.erro || 'Erro ao carregar dados.');
      } finally {
        setLoadingAppData(false);
      }
    };

    if (token) {
    loadInitialData();
        }
  }, [token]); 

  return (
    <AppDataContext.Provider value={{
      cozinhas,
      modosPagamento,
      loadingAppData,
      appDataError
    }}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => useContext(AppDataContext);