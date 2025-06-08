import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function HeaderEmpresa() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/dashboard-empresa">
          DeliveryAdmin
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavEmpresa"
          aria-controls="navbarNavEmpresa"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavEmpresa">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard-empresa">
                Meu Restaurante
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/pedidos-recebidos">
                Pedidos Recebidos
              </Link>
            </li>
          </ul>
          <div className="d-flex align-items-center">
            <span className="navbar-text me-3">
              Olá, {user?.nome?.split(' ')[0]}
            </span>
            <button className="btn btn-outline-light" onClick={handleLogout}>
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}