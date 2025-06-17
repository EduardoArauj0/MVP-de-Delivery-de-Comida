import React from 'react';
import ReactDOM from 'react-dom/client'; 
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

import apiClient from './services/api';

import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { AppDataProvider } from './context/AppDataContext.jsx';
import { RouterProvider } from 'react-router-dom';
import { routes } from './router/routes.jsx';

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <AppDataProvider>
          <RouterProvider router={routes} />
        </AppDataProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);