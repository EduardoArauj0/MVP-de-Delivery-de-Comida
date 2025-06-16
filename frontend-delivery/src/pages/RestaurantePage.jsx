import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import restauranteService from '../services/restauranteService';
import produtoService from '../services/produtoService';
import avaliacaoService from '../services/avaliacaoService';
import { useCart } from '../hooks/useCart';
import HeaderPublico from '../components/HeaderPublico';
import './style/RestaurantePage.css';

// Card de Produto no Carrossel
const ProdutoCard = ({ produto, onAddToCart, backendUrl, isRestauranteAberto }) => {
  const imageUrl = produto.imagem?.startsWith('/') 
    ? `${backendUrl}${produto.imagem}` 
    : (produto.imagem);

  return (
    <div className="produto-card">
      <img src={imageUrl} alt={produto.nome} />
      <div className="produto-card-body">
        <h5>{produto.nome}</h5>
        <p>{produto.descricao}</p>
      </div>
      <div className="produto-card-footer">
        <span className="price">R$ {parseFloat(produto.preco).toFixed(2)}</span>
        <button className="btn btn-sm btn-danger" onClick={() => onAddToCart(produto)} disabled={!isRestauranteAberto}>
          {isRestauranteAberto ? 'Adicionar' : 'Fechado'}
        </button>
      </div>
    </div>
  );
};

// Carrossel de Produtos
const ProdutoCarrossel = ({ title, produtos, onAddToCart, backendUrl, isRestauranteAberto }) => {
  const carrosselRef = useRef(null);

  const scroll = (scrollOffset) => {
    if (carrosselRef.current) {
      carrosselRef.current.scrollLeft += scrollOffset;
    }
  };

  return (
    <div className="produto-carrossel-section">
      <div className="carrossel-header">
        <h3>{title}</h3>
        <div className="d-flex gap-2">
          <button className="carrossel-arrow arrow-left" onClick={() => scroll(-300)} aria-label="Rolar para esquerda">
            <i className="bi bi-chevron-left"></i>
          </button>
          <button className="carrossel-arrow arrow-right" onClick={() => scroll(300)} aria-label="Rolar para direita">
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
      <div className="carrossel-container" ref={carrosselRef}>
        {produtos.map(prod => (
          <ProdutoCard key={prod.id} produto={prod} onAddToCart={onAddToCart} backendUrl={backendUrl} isRestauranteAberto={isRestauranteAberto} />
        ))}
      </div>
    </div>
  );
};

// Componente Principal da Página
export default function RestaurantePage() {
  const { id } = useParams();
  const { addItemToCart } = useCart();
  const [restaurante, setRestaurante] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState(null);
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [showDetalhes, setShowDetalhes] = useState(false);
  const [termoBusca, setTermoBusca] = useState('');

  const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const handleCloseDetalhes = () => setShowDetalhes(false);
  const handleShowDetalhes = () => setShowDetalhes(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const resRest = await restauranteService.buscarPorId(id);
        setRestaurante(resRest.data);
        
        const resProd = await produtoService.listar({ RestauranteId: id, ativoOnly: true });
        setProdutos(resProd.data);

        const resAval = await avaliacaoService.listarPorRestaurante(id);
        setAvaliacoes(resAval.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, [id]);

  async function handleAdicionarAoCarrinho(produto) {
    setFeedback({ message: '', type: '' });
    const sucesso = await addItemToCart(produto, 1);
    if (sucesso) {
      setFeedback({ message: `${produto.nome} adicionado ao carrinho!`, type: 'success' });
    } else {
      setFeedback({ message: `Não foi possível adicionar ${produto.nome}. Verifique seu carrinho.`, type: 'danger' });
    }
    setTimeout(() => setFeedback({ message: '', type: '' }), 3000);
  }

  const produtosFiltrados = produtos.filter(p => 
    p.nome.toLowerCase().includes(termoBusca.toLowerCase())
  );

  const produtosAgrupados = produtosFiltrados.reduce((acc, produto) => {
    const categoria = produto.categoria || 'Outros';
    if (!acc[categoria]) {
      acc[categoria] = [];
    }
    acc[categoria].push(produto);
    return acc;
  }, {});

  if (!restaurante) return <div className="text-center mt-5">Carregando...</div>;

  const logoImageUrl = restaurante.imagemUrl?.startsWith('/') 
    ? `${backendUrl}${restaurante.imagemUrl}` 
    : restaurante.imagemUrl;

  return (
    <>
      <HeaderPublico />
      <div className="container py-5">
        
        <header className="restaurante-header">
          <img src={logoImageUrl} alt={`Logo do ${restaurante.nome}`} className="restaurante-header-logo" />
          <div className="restaurante-header-info">
            <h1>{restaurante.nome}</h1>
            <div className="rating">
              <span className="star">★</span> {avaliacoes?.mediaNotas > 0 ? avaliacoes.mediaNotas.toFixed(1) : 'Sem avaliações'}
            </div>
          </div>
          <button className="btn btn-outline-secondary ms-auto" onClick={handleShowDetalhes}>Ver mais</button>
        </header>

        {!restaurante.aberto && (
            <div className="alert alert-warning text-center my-4" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                Este restaurante está fechado no momento e não aceita novos pedidos.
            </div>
        )}

        <section className="restaurante-actions">
          <div className="input-group w-50">
            <span className="input-group-text bg-light border-end-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>
            </span>
            <input 
              type="text" 
              className="form-control border-start-0" 
              placeholder="Buscar item no cardápio"
              value={termoBusca}
              onChange={e => setTermoBusca(e.target.value)}
            />
          </div>
          <div className="delivery-info">
            <strong>Entrega</strong>
            {parseFloat(restaurante.taxaFrete) === 0 ? (
              <span className="text-success fw-bold">Grátis</span>
            ) : (
              <span>Hoje • R$ {parseFloat(restaurante.taxaFrete).toFixed(2)}</span>
            )}
          </div>
        </section>

        {feedback.message && <div className={`alert alert-${feedback.type}`}>{feedback.message}</div>}

        <section>
          {Object.keys(produtosAgrupados).length > 0 ? (
            Object.keys(produtosAgrupados).map(categoria => (
              <ProdutoCarrossel 
                key={categoria}
                title={categoria} 
                produtos={produtosAgrupados[categoria]}
                onAddToCart={handleAdicionarAoCarrinho}
                backendUrl={backendUrl}
                isRestauranteAberto={restaurante.aberto}
              />
            ))
          ) : (
            <div className="text-center text-muted mt-5">
              <p>Nenhum item encontrado com o termo "{termoBusca}".</p>
            </div>
          )}
        </section>

      </div>

      <div className={`offcanvas offcanvas-end ${showDetalhes ? 'show' : ''}`} tabIndex="-1" style={{ visibility: showDetalhes ? 'visible' : 'hidden' }}>
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Sobre o Restaurante</h5>
          <button type="button" className="btn-close" onClick={handleCloseDetalhes}></button>
        </div>
        <div className="offcanvas-body">
          <h4>{restaurante.nome}</h4>
          <p><strong>CNPJ:</strong> {restaurante.cnpj}</p>
          <p><strong>Telefone:</strong> {restaurante.telefone}</p>
          <p><strong>Endereço:</strong> {restaurante.endereco}</p>
          <hr />
          <p><em>{restaurante.nome} é um estabelecimento parceiro do DeliveryApp, pronto para atender o seu pedido!</em></p>
        </div>
      </div>
      {showDetalhes && <div className="offcanvas-backdrop fade show" onClick={handleCloseDetalhes}></div>}
    </>
  );
}