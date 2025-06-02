import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function HeaderPublico({ busca, setBusca }) {
  const { user, token, logout } = useAuth();
  const [endereco, setEndereco] = useState('Selecionar endereço');
  const [total, setTotal] = useState(0);
  const [quantidade, setQuantidade] = useState(0);

  useEffect(() => {
    async function carregarCarrinho() {
      if (user?.tipo === 'cliente') {
        try {
          const res = await axios.get(`http://localhost:3000/carrinho/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const itens = res.data.CarrinhoItems || [];
          setQuantidade(itens.reduce((acc, item) => acc + item.quantidade, 0));
          setTotal(itens.reduce((acc, item) => acc + item.quantidade * item.Produto.preco, 0));
        } catch (err) {
          console.error(err);
          setQuantidade(0);
          setTotal(0);
        }
      }
    }
    carregarCarrinho();
  }, [user, token]);

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
          <button className="btn btn-outline-secondary" onClick={(
          setEndereco('Rua Exemplo, 123'),
          alert('Implementar Google Maps')
          )}>
            {endereco}
          </button>
          {user ? (
            <button className="btn btn-outline-dark" onClick={logout}>Sair</button>
          ) : (
            <Link to="/login" className="btn btn-outline-danger">Entrar</Link>
          )}

          {user?.tipo === 'cliente' && (
            <Link to="/carrinho" className="position-relative">
              <i className="bi bi-cart4 fs-4"></i>
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {quantidade} • R$ {total.toFixed(2)}
              </span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}