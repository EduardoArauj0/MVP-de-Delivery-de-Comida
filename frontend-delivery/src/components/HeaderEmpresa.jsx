import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function HeaderEmpresa() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/dashboard-empresa">DeliveryAdmin</Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <Link className="nav-link" to="/pedidos-recebidos">Pedidos Recebidos</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/dashboard-empresa">Meu Restaurante</Link>
          </li>
        </ul>
        <button className="btn btn-outline-light" onClick={handleLogout}>Sair</button>
      </div>
    </nav>
  );
}