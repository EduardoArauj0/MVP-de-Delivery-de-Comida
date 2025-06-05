import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { AppDataProvider } from './context/AppDataContext.jsx';
import { RouterProvider } from 'react-router-dom';
import { routes } from './router/routes';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={routes}>
      <AuthProvider>
        <CartProvider>
          <AppDataProvider>
            <App />
          </AppDataProvider>
        </CartProvider>
      </AuthProvider>
    </RouterProvider>
  </React.StrictMode>
);
