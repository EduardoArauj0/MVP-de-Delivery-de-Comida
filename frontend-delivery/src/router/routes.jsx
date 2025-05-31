import { Navigate, createBrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import DashboardCliente from '../pages/DashboardCliente';
import DashboardEmpresa from '../pages/DashboardEmpresa';
import DashboardAdmin from '../pages/DashboardAdmin';
import { useAuth } from '../context/AuthContext';
import RestaurantePage from '../pages/RestaurantePage';
import CarrinhoPage from '../pages/CarrinhoPage';

const PrivateRoute = ({ children, tipo }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (tipo && user.tipo !== tipo) return <Navigate to="/login" />;
  return children;
};

export const routes = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  {
    path: '/dashboard-cliente',
    element: (
      <PrivateRoute tipo="cliente">
        <DashboardCliente />
      </PrivateRoute>
    )
  },
  {
    path: '/dashboard-empresa',
    element: (
      <PrivateRoute tipo="empresa">
        <DashboardEmpresa />
      </PrivateRoute>
    )
  },
  {
    path: '/dashboard-admin',
    element: (
      <PrivateRoute tipo="admin">
        <DashboardAdmin />
      </PrivateRoute>
    )
  },
  {
    path: '/restaurante/:id',
    element: (
      <PrivateRoute tipo="cliente">
        <RestaurantePage />
      </PrivateRoute>
    )
  },
  {
    path: '/carrinho',
    element: (
      <PrivateRoute tipo="cliente">
        <CarrinhoPage />
      </PrivateRoute>
    )
  },
]);