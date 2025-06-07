import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function HeaderCliente() {
  const { logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-danger px-4">
      <Link className="navbar-brand" to="/dashboard-cliente">DeliveryApp</Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <Link className="nav-link" to="/dashboard-cliente">Restaurantes</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/carrinho">Carrinho</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/meus-pedidos">Meus Pedidos</Link>
          </li>
        </ul>
        <button className="btn btn-outline-light" onClick={logout}>Sair</button>
      </div>
    </nav>
  );
}