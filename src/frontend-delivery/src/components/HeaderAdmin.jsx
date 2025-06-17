import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function HeaderAdmin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/dashboard-admin">
          <i className="bi bi-shield-lock-fill me-2"></i>
          SuperAdmin Panel
        </Link>
        <div className="d-flex align-items-center">
          <span className="navbar-text me-3">
            Admin: {user?.nome}
          </span>
          <button className="btn btn-outline-light" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </div>
    </nav>
  );
}