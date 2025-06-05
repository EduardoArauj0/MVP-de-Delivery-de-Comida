import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext'; 

export default function HeaderPublico({ busca, setBusca }) {
  const authContext = useAuth();
  const user = authContext ? authContext.user : null;
  const logoutAuth = authContext ? authContext.logout : () => {};

  const { itemCount, totalAmount } = useCart(); 
  const navigate = useNavigate();
  const [enderecoDisplay] = useState('Selecionar endereço...');


  const handleLogout = () => {
    logoutAuth();
    navigate('/login');
  };
  
  const handleEnderecoClick = () => {
    alert('Implementar seleção de endereço (ex: Google Maps API ou modal com CEP)');
  };

  return (
    <header className="bg-white border-bottom shadow-sm sticky-top py-2 px-md-4 px-2">
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-md-3 col-lg-2 text-center text-md-start mb-2 mb-md-0">
            <Link to="/" className="navbar-brand fw-bold text-danger fs-4">
              DeliveryApp
            </Link>
          </div>

          <div className="col-md-5 col-lg-6 mb-2 mb-md-0">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                &#128269;
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Buscar item ou loja"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                aria-label="Buscar item ou loja"
              />
            </div>
          </div>

          <div className="col-md-4 col-lg-4 d-flex align-items-center justify-content-center justify-content-md-end gap-2">
            <button
              className="btn btn-outline-secondary btn-sm text-truncate"
              style={{ maxWidth: '150px' }}
              onClick={handleEnderecoClick}
            >
              📍 {enderecoDisplay}
            </button>

            {user ? (
              <div className="dropdown">
                <button className="btn btn-outline-dark btn-sm dropdown-toggle" type="button" id="dropdownUser" data-bs-toggle="dropdown" aria-expanded="false">
                  👤 Olá, {user.nome?.split(" ")[0] || 'Usuário'}
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownUser">
                  <li>
                    <Link 
                        className="dropdown-item" 
                        to={user.tipo === 'cliente' ? "/" : (user.tipo === 'empresa' ? "/dashboard-empresa" : "/dashboard-admin")}
                    >
                        Meu Painel
                    </Link>
                  </li>
                  {user.tipo === 'cliente' && (
                    <li><Link className="dropdown-item" to="/meus-pedidos">Meus Pedidos</Link></li>
                  )}
                  <li><hr className="dropdown-divider"/></li>
                  <li><button className="dropdown-item" onClick={handleLogout}>Sair</button></li>
                </ul>
              </div>
            ) : (
              <Link to="/login" className="btn btn-danger btn-sm">
                Entrar
              </Link>
            )}

            {(user?.tipo === 'cliente' || !user) && (
              <Link to="/carrinho" className="btn btn-light position-relative ms-2">
                🛒
                {itemCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {itemCount}
                    <span className="visually-hidden">itens no carrinho</span>
                  </span>
                )}
                <span className="ms-1 d-none d-lg-inline">R$ {totalAmount.toFixed(2)}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}