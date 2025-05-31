import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import HeaderCliente from '../components/HeaderCliente';

export default function RestaurantePage() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const [restaurante, setRestaurante] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [restRes, prodRes] = await Promise.all([
          axios.get(`http://localhost:3000/restaurantes/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`http://localhost:3000/produtos`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setRestaurante(restRes.data);
        const produtosFiltrados = prodRes.data.filter(p => p.RestauranteId === parseInt(id));
        setProdutos(produtosFiltrados);
      } catch (err) {
        console.error(err);
        console.error('Erro ao carregar restaurante ou produtos');
      }
    }
    fetchData();
  }, [id, token]);

  const adicionarAoCarrinho = async (produtoId) => {
    try {
      await axios.post(`http://localhost:3000/carrinho/${user.id}/itens`, {
        produtoId,
        quantidade: 1
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFeedback('Produto adicionado ao carrinho!');
      setTimeout(() => setFeedback(''), 2000);
    } catch (err) {
      console.error(err);
      setFeedback('Erro ao adicionar ao carrinho');
      setTimeout(() => setFeedback(''), 2000);
    }
  };

  if (!restaurante) return <div className="container py-5">Carregando...</div>;

  return (
    <>
      <HeaderCliente />
      <div className="container py-5">
        <h2 className="mb-3">{restaurante.nome}</h2>
        <p><strong>Endereço:</strong> {restaurante.endereco}</p>
        <hr />
        {feedback && <div className="alert alert-info">{feedback}</div>}
        <h4 className="mt-4">Produtos disponíveis</h4>
        <div className="row">
          {produtos.map(prod => (
            <div className="col-md-4 mb-4" key={prod.id}>
              <div className="card h-100">
                <img src={prod.imagem} className="card-img-top" alt={prod.nome} />
                <div className="card-body">
                  <h5 className="card-title">{prod.nome}</h5>
                  <p className="card-text">{prod.descricao}</p>
                  <p className="card-text fw-bold">R$ {prod.preco.toFixed(2)}</p>
                  <button className="btn btn-success w-100" onClick={() => adicionarAoCarrinho(prod.id)}>
                    Adicionar ao carrinho
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}