import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import HeaderCliente from '../components/HeaderCliente';
import HeaderPublico from '../components/HeaderPublico';
import restauranteService from '../services/restauranteService';
import produtoService from '../services/produtoService';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function RestaurantePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addItemToCart } = useCart(); 
  const [restaurante, setRestaurante] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [feedbackError, setFeedbackError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const resRest = await restauranteService.buscarPorId(id);
        setRestaurante(resRest.data);
        
        const resProd = await produtoService.listar({ RestauranteId: id, ativoOnly: true });
        setProdutos(resProd.data);

      } catch (err) {
        console.error(err);
        setFeedbackError('Erro ao carregar restaurante ou produtos');
      }
    }
    fetchData();
  }, [id]);

  async function handleAdicionarAoCarrinho(produto) {
    setFeedback('');
    setFeedbackError('');
    
    const sucesso = await addItemToCart(produto, 1);

    if (sucesso) {
      setFeedback(`${produto.nome} adicionado ao carrinho!`);
    } else {
      setFeedbackError(`Não foi possível adicionar ${produto.nome}. Verifique se já existem itens de outro restaurante no seu carrinho.`);
    }

    setTimeout(() => {
        setFeedback('');
        setFeedbackError('');
    }, 3000);
  }

  if (!restaurante) return <div className="text-center mt-5">Carregando...</div>;

  return (
    <>
      { user ? <HeaderCliente /> : <HeaderPublico busca="" setBusca={() => {}} /> }
      <div className="container py-4">
        <div className="mb-4">
          <img
            src={restaurante.imagemUrl || "https://source.unsplash.com/1200x300/?restaurant"}
            alt="Capa do restaurante"
            className="img-fluid rounded shadow-sm"
            style={{ width: '100%', height: '300px', objectFit: 'cover' }}
          />
          <h2 className="mt-3">{restaurante.nome}</h2>
          <p className="mb-1"><strong>Endereço:</strong> {restaurante.endereco}</p>
          <p className="mb-1"><strong>Telefone:</strong> {restaurante.telefone}</p>
          <p className="text-muted">Bem-vindo ao {restaurante.nome}, explore nosso cardápio e faça seu pedido com conforto e praticidade!</p>
        </div>

        {feedback && <div className="alert alert-success">{feedback}</div>}
        {feedbackError && <div className="alert alert-danger">{feedbackError}</div>}

        <h4 className="mb-3">Produtos</h4>
        <div className="row">
          {produtos.map(prod => (
            <div className="col-md-4 mb-4" key={prod.id}>
              <div className="card h-100">
                <img src={prod.imagem || `https://source.unsplash.com/400x300/?food,${prod.categoria.toLowerCase()}`} className="card-img-top" alt={prod.nome} style={{ height: '200px', objectFit: 'cover' }} />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{prod.nome}</h5>
                  <p className="card-text">{prod.descricao}</p>
                  <p className="card-text fw-bold">R$ {parseFloat(prod.preco).toFixed(2)}</p>
                  <button className="btn btn-success w-100 mt-auto" onClick={() => handleAdicionarAoCarrinho(prod)}>
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