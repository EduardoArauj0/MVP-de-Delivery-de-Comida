import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';

export default function HeaderCliente() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-bottom shadow-sm sticky-top">
      <div className="container-fluid">
        <div className="container d-flex align-items-center justify-content-between py-2">

          {/* Coluna da Esquerda: Logo e Navegação Principal */}
          <div className="d-flex align-items-center gap-4">
            <Link to="/" className="navbar-brand fw-bold text-danger fs-4">DeliveryApp</Link>
            <nav className="d-none d-lg-flex gap-3">
              <Link to="/" className="nav-link text-dark">Restaurantes</Link>
              <Link to="/meus-pedidos" className="nav-link text-dark">Meus Pedidos</Link>
            </nav>
          </div>
          
          {/* Coluna da Direita: Carrinho e Menu do Perfil */}
          <div className="d-flex align-items-center gap-4">
            {/* Ícone do Carrinho */}
            <Link to="/carrinho" className="position-relative text-decoration-none">
              <i className="bi bi-cart4 fs-4 text-dark"></i>
              {itemCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{fontSize: '0.65rem'}}>
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Menu Dropdown do Perfil */}
            <div className="dropdown">
              <button className="btn btn-light" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i className="bi bi-person-fill fs-4"></i>
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li className="dropdown-header">Olá, {user?.nome?.split(' ')[0]}</li>
                <li><Link className="dropdown-item" to="/perfil">Meu Perfil</Link></li>
                <li><Link className="dropdown-item" to="/meus-pedidos">Meus Pedidos</Link></li>
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