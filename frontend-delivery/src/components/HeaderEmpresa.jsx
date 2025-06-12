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
    <header className="bg-white border-bottom shadow-sm sticky-top">
      <div className="container-fluid">
        <div className="container d-flex align-items-center justify-content-between py-2">
          
          <div className="d-flex align-items-center gap-4">
            <Link to="/dashboard-empresa" className="navbar-brand fw-bold text-danger fs-4">DeliveryApp</Link>
            <span className="badge bg-primary-subtle text-primary-emphasis rounded-pill">Painel da Empresa</span>
          </div>
          
          <div className="d-flex align-items-center gap-4">
            <div className="dropdown">
              <button className="btn btn-light" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i className="bi bi-person-fill fs-4"></i>
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li className="dropdown-header">Olá, {user?.nome?.split(' ')[0]}</li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item text-danger" onClick={handleLogout}>Sair</button>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}