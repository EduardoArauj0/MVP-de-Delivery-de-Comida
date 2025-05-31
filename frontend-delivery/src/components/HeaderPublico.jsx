import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function HeaderPublico({ busca, setBusca }) {
  const [endereco, setEndereco] = useState('Selecionar endereço');

  return (
    <header className="bg-white border-bottom shadow-sm sticky-top">
      <div className="container d-flex align-items-center justify-content-between py-2">
        <div className="d-flex align-items-center gap-4">
          <Link to="/" className="navbar-brand fw-bold text-danger fs-4">DeliveryApp</Link>
          <Link to="/" className="nav-link">Início</Link>
          <Link to="/dashboard-cliente" className="nav-link">Restaurantes</Link>
        </div>
        <input
          type="text"
          className="form-control w-25"
          placeholder="Buscar item ou loja"
          value={busca}
          onChange={e => setBusca(e.target.value)}
        />
        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-outline-secondary" onClick={() => {
            setEndereco('Rua Exemplo, 123');
            alert('Implementar Google Maps')
            }}>{endereco}</button>
          <Link to="/login" className="btn btn-outline-danger">Entrar</Link>
          <Link to="/carrinho" className="position-relative">
            <i className="bi bi-cart4 fs-4"></i>
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              R$ 0,00
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}