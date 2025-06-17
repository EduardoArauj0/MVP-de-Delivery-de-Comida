import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useHasPermission } from '../hooks/useHasPermission';
import enderecoService from '../services/enderecoService';

export default function HeaderPublico({ busca, setBusca }) {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const [endereco, setEndereco] = useState(null);
  const [mobileSearchVisible, setMobileSearchVisible] = useState(false);

  const canPlaceOrder = useHasPermission(['PLACE_ORDER']);
  const showCart = !user || canPlaceOrder;

  useEffect(() => {
    const fetchEndereco = async () => {
      if (user) {
        try {
          const response = await enderecoService.listarMeus();
          if (response.data && response.data.length > 0) {
            setEndereco(response.data[0]);
          }
        } catch (error) {
          console.error("Não foi possível buscar o endereço para o header:", error);
        }
      }
    };
    fetchEndereco();
  }, [user]);


  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileSearch = () => {
    setMobileSearchVisible(!mobileSearchVisible);
  };

  return (
    <header className="bg-white border-bottom shadow-sm sticky-top">
      <div className="container-fluid">
        <div className="container d-flex align-items-center justify-content-between py-2">

          <div className="d-flex align-items-center gap-4">
            <Link to="/" className="navbar-brand fw-bold text-danger fs-4">DeliveryApp</Link>
          </div>

          <div className="flex-grow-1 mx-4 d-none d-md-block">
            {setBusca && (
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                  </svg>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Buscar item ou loja"
                  value={busca}
                  onChange={e => setBusca(e.target.value)}
                  aria-label="Buscar"
                />
              </div>
            )}
          </div>
          
          <div className="d-flex align-items-center justify-content-end gap-3">
            <button className="btn btn-light d-md-none" onClick={toggleMobileSearch}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
              </svg>
            </button>

            <div className="d-none d-md-flex align-items-center me-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-geo-alt-fill text-danger me-2" viewBox="0 0 16 16">
                <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
              </svg>
              <div>
                <small className="text-muted d-block" style={{lineHeight: 1}}>Entregar em:</small>
                <Link to={user ? "/perfil" : "/login"} className="fw-bold text-dark text-decoration-none d-block text-truncate" style={{maxWidth: '150px'}}>
                  {endereco ? `${endereco.logradouro}, ${endereco.numero}` : 'Adicionar Endereço'}
                </Link>
              </div>
            </div>
            
            {user ? (
              <div className="d-flex align-items-center">
                <button className="btn btn-sm btn-outline-danger" onClick={handleLogout}>Sair</button>
              </div>
            ) : (
              <Link to="/login" className="btn btn-danger">Entrar</Link>
            )}

            {showCart && (
              <Link to="/carrinho" className="position-relative text-decoration-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-cart4 text-dark" viewBox="0 0 16 16">
                  <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l.5 2H5V5H3.14zM6 5v2h2V5H6zm3 0v2h2V5H9zm3 0v2h1.36l.5-2H12zm1.11 3H12v2h.61l.5-2zM11 8H9v2h2V8zM8 8H6v2h2V8zM5 8H3.89l.5 2H5V8zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"/>
                </svg>
                {itemCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{fontSize: '0.65rem'}}>
                    {itemCount}
                  </span>
                )}
              </Link>
            )}
          </div>
        </div>
      </div>
    
      <div className={`search-container-mobile d-md-none ${mobileSearchVisible ? 'active' : ''}`}>
        {setBusca && (
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
              </svg>
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Buscar item ou loja"
              value={busca}
              onChange={e => setBusca(e.target.value)}
            />
          </div>
        )}
      </div>
    </header>
  );
}