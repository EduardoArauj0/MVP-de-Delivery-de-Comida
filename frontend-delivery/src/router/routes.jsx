import { Navigate, createBrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import EsqueciSenhaPage from '../pages/EsqueciSenhaPage';
import DashboardEmpresa from '../pages/DashboardEmpresa';
import DashboardAdmin from '../pages/DashboardAdmin';
import RestaurantePage from '../pages/RestaurantePage';
import CarrinhoPage from '../pages/CarrinhoPage';
import PedidosClientePage from '../pages/PedidosClientePage';
import PedidosRecebidosPage from '../pages/PedidosRecebidosPage';
import HomePage from '../pages/HomePage';
import ProdutoAdminPage from '../pages/admin/ProdutoAdminPage';
import ProfilePage from '../pages/ProfilePage';
import { useAuth } from '../hooks/useAuth';
import { useHasPermission } from '../hooks/useHasPermission';

const PrivateRoute = ({ children, permissoes }) => {
  const { user, loadingAuth } = useAuth();
  
  const temPermissao = useHasPermission(permissoes || []);

  if (loadingAuth) {
    return (
      <div className="container vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={`/login?redirect=${window.location.pathname}`} replace />;
  }
  
  if (permissoes && permissoes.length > 0 && !temPermissao) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export const routes = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/esqueci-senha', element: <EsqueciSenhaPage /> },
  {
    path: '/dashboard-empresa',
    element: (
      <PrivateRoute permissoes={['MANAGE_RESTAURANT']}>
        <DashboardEmpresa />
      </PrivateRoute>
    )
  },
  {
    path: '/dashboard-admin',
    element: (
      <PrivateRoute permissoes={['MANAGE_SYSTEM']}>
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
      <PrivateRoute permissoes={['VIEW_ORDERS_CLIENT']}>
        <PedidosClientePage />
      </PrivateRoute>
    )
  },
  {
    path: '/pedidos-recebidos',
    element: (
      <PrivateRoute permissoes={['MANAGE_ORDERS_COMPANY']}>
        <PedidosRecebidosPage />
      </PrivateRoute>
    )
  },
  {
    path: '/perfil',
    element: (
      <PrivateRoute permissoes={['PLACE_ORDER']}>
        <ProfilePage />
      </PrivateRoute>
    )
  },
  {
    path: '/produto/novo',
    element: (
      <PrivateRoute permissoes={['MANAGE_PRODUCTS']}>
        <ProdutoAdminPage />
      </PrivateRoute>
    )
  },
  {
    path: '/produto/:produtoId/editar',
    element: (
      <PrivateRoute permissoes={['MANAGE_PRODUCTS']}>
        <ProdutoAdminPage />
      </PrivateRoute>
    )
  },
]);