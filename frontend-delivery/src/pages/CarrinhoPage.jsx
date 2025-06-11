import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import HeaderCliente from '../components/HeaderCliente';
import HeaderPublico from '../components/HeaderPublico';
import { useNavigate, Link } from 'react-router-dom';
import modoPagamentoService from '../services/modoPagamentoService';
import pedidoService from '../services/pedidoService';
import restauranteService from '../services/restauranteService';
import enderecoService from '../services/enderecoService';
import { useHasPermission } from '../hooks/useHasPermission';
import './style/CarrinhoPage.css';

export default function CarrinhoPage() {
  const { user } = useAuth();
  const {
    cartItems,
    itemCount,
    totalAmount,
    loadingCart,
    cartError,
    updateItemQuantity,
    removeItemFromCart,
    clearClientCart,
    cartRestaurantId,
  } = useCart();

  const navigate = useNavigate();

  const [formasPagamento, setFormasPagamento] = useState([]);
  const [enderecos, setEnderecos] = useState([]);
  const [formaPagamentoId, setFormaPagamentoId] = useState('');
  const [enderecoEntregaId, setEnderecoEntregaId] = useState('');
  const [taxaFrete, setTaxaFrete] = useState(0);
  const [valorTotalPedido, setValorTotalPedido] = useState(0);
  const [erroCheckout, setErroCheckout] = useState('');
  const [sucessoCheckout, setSucessoCheckout] = useState('');
  
  const isCliente = useHasPermission(['PLACE_ORDER']);

  const backendUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    async function buscarTaxaFrete() {
      if (cartRestaurantId) {
        try {
          const res = await restauranteService.buscarPorId(cartRestaurantId);
          setTaxaFrete(parseFloat(res.data.taxaFrete) || 0);
        } catch (error) {
          console.error("Erro ao buscar taxa de frete", error);
          setTaxaFrete(0);
        }
      } else {
        setTaxaFrete(0);
      }
    }
    buscarTaxaFrete();
  }, [cartRestaurantId]);

  useEffect(() => {
    setValorTotalPedido(totalAmount + taxaFrete);
  }, [totalAmount, taxaFrete]);

  useEffect(() => {
    async function carregarDadosCheckout() {
      if (!user || !isCliente) return;
      try {
        const [pagamentoRes, enderecosRes] = await Promise.all([
          modoPagamentoService.listar(),
          enderecoService.listarMeus()
        ]);
        setFormasPagamento(pagamentoRes.data);
        setEnderecos(enderecosRes.data);
        if (enderecosRes.data.length > 0) {
          setEnderecoEntregaId(enderecosRes.data[0].id);
        }
      } catch {
        setErroCheckout('Erro ao carregar dados para checkout.');
      }
    }
    carregarDadosCheckout();
  }, [user, isCliente]);

  const handleFinalizarPedido = async () => {
    if (!user) {
      navigate(`/login?redirect=/carrinho`);
      return;
    }
    if (!cartRestaurantId || !formaPagamentoId || !enderecoEntregaId || !cartItems || cartItems.length === 0) {
      setErroCheckout('Por favor, preencha todos os campos e adicione itens ao carrinho.');
      return;
    }
    
    const enderecoSelecionado = enderecos.find(e => e.id === parseInt(enderecoEntregaId));
    if (!enderecoSelecionado) {
        setErroCheckout('Endereço selecionado não é válido.');
        return;
    }
    const enderecoString = `${enderecoSelecionado.logradouro}, ${enderecoSelecionado.numero} - ${enderecoSelecionado.bairro}, ${enderecoSelecionado.cidade}`;

    try {
      setErroCheckout('');
      setSucessoCheckout('');
      await pedidoService.criar({
        clienteId: user.id,
        restauranteId: parseInt(cartRestaurantId),
        formaPagamentoId: parseInt(formaPagamentoId),
        itens: cartItems.map(item => ({ produtoId: item.Produto.id, quantidade: item.quantidade })),
        enderecoEntrega: enderecoString,
      });

      setSucessoCheckout('Pedido realizado com sucesso! Você será redirecionado...');
      clearClientCart();
      setTimeout(() => navigate('/meus-pedidos'), 3000);

    } catch (err) {
      setErroCheckout(err.response?.data?.erro || 'Erro ao finalizar pedido.');
    }
  };

  const renderEmptyCart = () => (
    <div className="text-center py-5">
      <h3 className="mb-3">Seu carrinho está vazio.</h3>
      <p className="text-muted mb-4">Que tal explorar os melhores restaurantes da sua região?</p>
      <Link to="/" className="btn btn-danger">Começar a comprar</Link>
    </div>
  );

  if (loadingCart && !itemCount) return <div className="text-center mt-5"><div className="spinner-border text-danger" role="status"></div></div>;

  return (
    <>
      {user && isCliente ? <HeaderCliente /> : <HeaderPublico setBusca={() => {}} busca="" />}
      <div className="container py-5">
        <h2 className="mb-4">Seu Carrinho</h2>
        
        {cartError && <div className="alert alert-danger">{cartError}</div>}
        {erroCheckout && <div className="alert alert-danger">{erroCheckout}</div>}
        {sucessoCheckout && <div className="alert alert-success">{sucessoCheckout}</div>}

        {itemCount === 0 && !loadingCart ? renderEmptyCart() : (
          <div className="row g-5">
            {/* Coluna dos Itens */}
            <div className="col-lg-8">
              <h4>Itens</h4>
              <div className="cart-items-list">
                {cartItems?.map(item => (
                  <div key={item.id || item.Produto.id} className="cart-item-row">
                    <div className="cart-item-img">
                      <img 
                        src={item.Produto.imagem?.startsWith('/') ? `${backendUrl}${item.Produto.imagem}` : item.Produto.imagem} 
                        alt={item.Produto.nome} 
                      />
                    </div>
                    <div className="cart-item-details">
                      <h5>{item.Produto.nome}</h5>
                      <p className="text-muted">R$ {parseFloat(item.Produto.preco).toFixed(2)}</p>
                    </div>
                    <div className="quantity-stepper">
                      <button className="btn btn-light" onClick={() => updateItemQuantity(item.Produto.id, item.quantidade - 1)}>-</button>
                      <input type="number" className="form-control" value={item.quantidade} readOnly />
                      <button className="btn btn-light" onClick={() => updateItemQuantity(item.Produto.id, item.quantidade + 1)}>+</button>
                    </div>
                    <div className="cart-item-price text-end ps-4">
                      <strong className="d-block">R$ {(item.Produto.preco * item.quantidade).toFixed(2)}</strong>
                    </div>
                    <div className="cart-item-actions ps-3">
                      <button className="btn-remove" onClick={() => removeItemFromCart(item.id, item.Produto.id)} title="Remover item">
                        <i className="bi bi-x-lg"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn btn-sm btn-outline-warning mt-4" onClick={clearClientCart}>Limpar Carrinho</button>
            </div>

            {/* Coluna do Resumo */}
            <div className="col-lg-4">
              <div className="summary-card p-4">
                <h4 className="mb-3">Resumo do Pedido</h4>
                <hr />
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>R$ {totalAmount.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Taxa de entrega:</span>
                  <span className={taxaFrete === 0 ? 'text-success fw-bold' : ''}>
                    {taxaFrete > 0 ? `R$ ${taxaFrete.toFixed(2)}` : 'Grátis'}
                  </span>
                </div>
                <div className="d-flex justify-content-between fw-bold fs-5">
                  <span>Total:</span>
                  <span>R$ {valorTotalPedido.toFixed(2)}</span>
                </div>
                <hr />
                {user && isCliente && (
                    <>
                      <div className="mb-3">
                        <label htmlFor="enderecoEntrega" className="form-label fw-bold">Endereço de Entrega</label>
                        {enderecos.length > 0 ? (
                            <select id="enderecoEntrega" className="form-select" value={enderecoEntregaId} onChange={e => setEnderecoEntregaId(e.target.value)} required>
                              {enderecos.map(end => <option key={end.id} value={end.id}>{end.logradouro}, {end.numero}</option>)}
                            </select>
                        ) : (
                            <div className='alert alert-warning p-2 fs-sm'>Nenhum endereço. <Link to="/perfil">Cadastre um aqui</Link>.</div>
                        )}
                      </div>
                      <div className="mb-3">
                          <label htmlFor="formaPagamento" className="form-label fw-bold">Forma de Pagamento</label>
                          <select id="formaPagamento" className="form-select" value={formaPagamentoId} onChange={e => setFormaPagamentoId(e.target.value)} required>
                            <option value="">Selecione...</option>
                            {formasPagamento.map(fp => <option key={fp.id} value={fp.id}>{fp.nome}</option>)}
                          </select>
                      </div>
                    </>
                )}
                <button className="btn btn-danger w-100 btn-lg mt-2" onClick={handleFinalizarPedido} disabled={loadingCart || (user && (!formaPagamentoId || !enderecoEntregaId))}>
                  {user ? 'Finalizar Pedido' : 'Fazer Login para Finalizar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}