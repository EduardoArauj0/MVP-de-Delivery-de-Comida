import { Navigate, createBrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import DashboardEmpresa from '../pages/DashboardEmpresa';
import DashboardAdmin from '../pages/DashboardAdmin';
import RestaurantePage from '../pages/RestaurantePage';
import CarrinhoPage from '../pages/CarrinhoPage';
import PedidosClientePage from '../pages/PedidosClientePage';
import PedidosRecebidosPage from '../pages/PedidosRecebidosPage';
import HomePage from '../pages/HomePage';
import { useAuth } from '../hooks/useAuth';

const PrivateRoute = ({ children, tipo }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to={`/login?redirect=${window.location.pathname}`} />;
  if (tipo && user.tipo !== tipo) {
    let redirectTo = '/';
    if (user.tipo === 'empresa') redirectTo = '/dashboard-empresa';
    if (user.tipo === 'admin') redirectTo = '/dashboard-admin';
    if (window.location.pathname === redirectTo) {
        return children;
    }
    return <Navigate to={redirectTo} />;
  }
  return children;
};

export const routes = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
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
    element: <RestaurantePage />
  },
  {
    path: '/carrinho',
    element: <CarrinhoPage />
  },
  {
    path: '/meus-pedidos',
    element: (
      <PrivateRoute tipo="cliente">
        <PedidosClientePage />
      </PrivateRoute>
    )
  },
  {
    path: '/pedidos-recebidos',
    element: (
      <PrivateRoute tipo="empresa">
        <PedidosRecebidosPage />
      </PrivateRoute>
    )
  },
]);