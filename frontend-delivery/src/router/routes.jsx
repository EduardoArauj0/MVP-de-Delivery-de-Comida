import { Navigate, createBrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import DashboardCliente from '../pages/DashboardCliente';
import DashboardEmpresa from '../pages/DashboardEmpresa';
import DashboardAdmin from '../pages/DashboardAdmin';
import RestaurantePage from '../pages/RestaurantePage';
import CarrinhoPage from '../pages/CarrinhoPage';
import PedidosClientePage from '../pages/PedidosClientePage';
import PedidosRecebidosPage from '../pages/PedidosRecebidosPage';
import HomePage from '../pages/HomePage';
import { AuthProvider, useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, tipo }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (tipo && user.tipo !== tipo) return <Navigate to="/login" />;
  return children;
};

const withAuth = (element) => <AuthProvider>{element}</AuthProvider>;

export const routes = createBrowserRouter([
  { path: '/', element: withAuth(<HomePage />) },
  { path: '/login', element: withAuth(<Login />) },
  { path: '/register', element: withAuth(<Register />) },
  {
    path: '/dashboard-cliente',
    element: withAuth(
      <PrivateRoute tipo="cliente">
        <DashboardCliente />
      </PrivateRoute>
    )
  },
  {
    path: '/dashboard-empresa',
    element: withAuth(
      <PrivateRoute tipo="empresa">
        <DashboardEmpresa />
      </PrivateRoute>
    )
  },
  {
    path: '/dashboard-admin',
    element: withAuth(
      <PrivateRoute tipo="admin">
        <DashboardAdmin />
      </PrivateRoute>
    )
  },
  {
    path: '/restaurante/:id',
    element: withAuth(
      <PrivateRoute tipo="cliente">
        <RestaurantePage />
      </PrivateRoute>
    )
  },
  {
    path: '/carrinho',
    element: withAuth(
      <PrivateRoute tipo="cliente">
        <CarrinhoPage />
      </PrivateRoute>
    )
  },
  {
    path: '/meus-pedidos',
    element: withAuth(
      <PrivateRoute tipo="cliente">
        <PedidosClientePage />
      </PrivateRoute>
    )
  },
  {
    path: '/pedidos-recebidos',
    element: withAuth(
      <PrivateRoute tipo="empresa">
        <PedidosRecebidosPage />
      </PrivateRoute>
    )
  },
]);