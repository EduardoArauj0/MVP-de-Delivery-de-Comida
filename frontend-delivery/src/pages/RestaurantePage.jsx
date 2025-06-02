import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import HeaderCliente from '../components/HeaderCliente';

export default function RestaurantePage() {
  const { id } = useParams();
  const [restaurante, setRestaurante] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const resRest = await axios.get(`http://localhost:3000/restaurantes/${id}`);
        const resProd = await axios.get('http://localhost:3000/produtos');
        setRestaurante(resRest.data);
        setProdutos(resProd.data.filter(p => p.RestauranteId === parseInt(id)));
      } catch (err) {
        console.error(err)
        setFeedback('Erro ao carregar restaurante ou produtos');
      }
    }
    fetchData();
  }, [id]);

  function adicionarAoCarrinho(produtoId) {
    const produto = produtos.find(p => p.id === produtoId);
    setFeedback(`${produto?.nome || 'Produto'} adicionado ao carrinho!`);
    setTimeout(() => setFeedback(''), 2000);
  }

  if (!restaurante) return <div className="text-center mt-5">Carregando...</div>;

  return (
    <>
      <HeaderCliente />
      <div className="container py-4">
        <div className="mb-4">
          <img
            src="https://source.unsplash.com/1200x300/?restaurant"
            alt="Capa do restaurante"
            className="img-fluid rounded shadow-sm"
          />
          <h2 className="mt-3">{restaurante.nome}</h2>
          <p className="mb-1"><strong>Endereço:</strong> {restaurante.endereco}</p>
          <p className="mb-1"><strong>Telefone:</strong> {restaurante.telefone}</p>
          <p className="text-muted">Bem-vindo ao {restaurante.nome}, explore nosso cardápio e faça seu pedido com conforto e praticidade!</p>
        </div>

        {feedback && <div className="alert alert-success">{feedback}</div>}

        <h4 className="mb-3">Produtos</h4>
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