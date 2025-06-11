import React from 'react';
import ReactDOM from 'react-dom/client'; 
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { AppDataProvider } from './context/AppDataContext.jsx';
import { RouterProvider } from 'react-router-dom';
import { routes } from './router/routes.jsx';

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