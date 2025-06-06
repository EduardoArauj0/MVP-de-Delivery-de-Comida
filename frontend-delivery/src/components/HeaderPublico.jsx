import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function HeaderPublico({ busca, setBusca }) {
  const { user, logout } = useAuth();
  const { itemCount, totalAmount } = useCart();
  const [endereco] = useState('Selecionar endereço');

  return (
    <header className="bg-white border-bottom shadow-sm sticky-top">
      <div className="container d-flex align-items-center justify-content-between py-2">
        <div className="d-flex align-items-center gap-4">
          <Link to="/" className="navbar-brand fw-bold text-danger fs-4">DeliveryApp</Link>
          <Link to="/" className="nav-link">Início</Link>
          <Link to="/" className="nav-link">Restaurantes</Link>
        </div>
        
          {setBusca && (
            <input
                type="text"
                className="form-control w-25"
                placeholder="Buscar item ou loja"
                value={busca}
                onChange={e => setBusca(e.target.value)}
            />
        )}

        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-outline-secondary" onClick={() => {
            alert('Funcionalidade de seleção de endereço a ser implementada.');
          }}>
            {endereco}
          </button>
          {user ? (
            <>
              <span className="navbar-text">Olá, {user.nome.split(' ')[0]}</span>
              <button className="btn btn-outline-dark" onClick={logout}>Sair</button>
            </>
          ) : (
            <Link to="/login" className="btn btn-outline-danger">Entrar</Link>
          )}

          {(user?.tipo === 'cliente' || !user) && itemCount > 0 && (
            <Link to="/carrinho" className="position-relative text-decoration-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-cart4" viewBox="0 0 16 16">
                <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l.5 2H5V5H3.14zM6 5v2h2V5H6zm3 0v2h2V5H9zm3 0v2h1.36l.5-2H12zm1.11 3H12v2h.61l.5-2zM11 8H9v2h2V8zM8 8H6v2h2V8zM5 8H3.89l.5 2H5V8zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"/>
              </svg>
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{fontSize: '0.65rem'}}>
                {itemCount} &bull; R$ {totalAmount.toFixed(2)}
              </span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}