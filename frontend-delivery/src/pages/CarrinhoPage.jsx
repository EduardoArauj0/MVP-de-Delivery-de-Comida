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
      if (!user) return;
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
      } catch (err) {
        console.error(err);
        setErroCheckout('Erro ao carregar dados para checkout.');
      }
    }
    carregarDadosCheckout();
  }, [user]);

  const handleFinalizarPedido = async () => {
    if (!user) {
      navigate(`/login?redirect=/carrinho`);
      return;
    }

    if (!cartRestaurantId) {
      setErroCheckout('Não foi possível identificar o restaurante do seu pedido. Adicione itens ao carrinho primeiro.');
      return;
    }
    if (!formaPagamentoId) {
      setErroCheckout('Escolha uma forma de pagamento.');
      return;
    }
    if (!enderecoEntregaId) {
      setErroCheckout('Por favor, selecione ou cadastre um endereço de entrega no seu perfil.');
      return;
    }
    if (!cartItems || cartItems.length === 0) {
      setErroCheckout('Seu carrinho está vazio.');
      return;
    }
    
    const enderecoSelecionado = enderecos.find(e => e.id === parseInt(enderecoEntregaId));
    if (!enderecoSelecionado) {
        setErroCheckout('Endereço selecionado não é válido.');
        return;
    }
    const enderecoString = `${enderecoSelecionado.logradouro}, ${enderecoSelecionado.numero} - ${enderecoSelecionado.bairro}, ${enderecoSelecionado.cidade}`;

    const itensPedido = cartItems.map(item => ({
      produtoId: item.Produto.id,
      quantidade: item.quantidade,
    }));

    try {
      setErroCheckout('');
      setSucessoCheckout('');
      await pedidoService.criar({
        clienteId: user.id,
        restauranteId: parseInt(cartRestaurantId),
        formaPagamentoId: parseInt(formaPagamentoId),
        itens: itensPedido,
        enderecoEntrega: enderecoString,
      });

      setSucessoCheckout('Pedido realizado com sucesso! Você será redirecionado para Meus Pedidos.');
      clearClientCart();
      setTimeout(() => {
        navigate('/meus-pedidos');
      }, 3000);

    } catch (err) {
      console.error("Erro ao finalizar pedido:", err);
      setErroCheckout(err.response?.data?.erro || 'Erro ao finalizar pedido. Tente novamente.');
    }
  };

  if (loadingCart && !itemCount) return <div className="text-center mt-5"><div className="spinner-border text-danger" role="status"><span className="visually-hidden">Carregando carrinho...</span></div></div>;

  return (
    <>
      {user && isCliente ? <HeaderCliente /> : <HeaderPublico setBusca={() => {}} busca="" />}
      <div className="container py-5">
        <h2 className="mb-4">Seu Carrinho</h2>

        {cartError && <div className="alert alert-danger">{cartError}</div>}
        {erroCheckout && <div className="alert alert-danger">{erroCheckout}</div>}
        {sucessoCheckout && <div className="alert alert-success">{sucessoCheckout}</div>}

        {itemCount === 0 && !loadingCart ? (
          <div className="text-center">
            <p>Seu carrinho está vazio.</p>
            <Link to="/" className="btn btn-primary">Comece a comprar</Link>
          </div>
        ) : (
          <>
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th style={{width: '50%'}}>Produto</th>
                  <th className="text-center">Quantidade</th>
                  <th className="text-end">Preço Unit.</th>
                  <th className="text-end">Subtotal</th>
                  <th className="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {cartItems?.map(item => (
                  <tr key={item.id || item.Produto.id}>
                    <td>
                        <div className="d-flex align-items-center">
                            {item.Produto.imagem && (
                                <img src={item.Produto.imagem} alt={item.Produto.nome} style={{width: '60px', height: '60px', objectFit: 'cover', marginRight: '15px', borderRadius: '4px'}}/>
                            )}
                            <div>
                                {item.Produto.nome}
                                <small className="d-block text-muted">{item.Produto.descricao || ''}</small>
                            </div>
                        </div>
                    </td>
                    <td className="text-center">
                      <div className="input-group input-group-sm" style={{maxWidth: '120px', margin: 'auto'}}>
                        <button className="btn btn-outline-secondary" type="button" onClick={() => updateItemQuantity(item.Produto.id, item.quantidade - 1)}>-</button>
                        <input
                          type="number"
                          className="form-control text-center"
                          value={item.quantidade}
                          readOnly
                          aria-label="Quantidade"
                        />
                        <button className="btn btn-outline-secondary" type="button" onClick={() => updateItemQuantity(item.Produto.id, item.quantidade + 1)}>+</button>
                      </div>
                    </td>
                    <td className="text-end">R$ {parseFloat(item.Produto.preco).toFixed(2)}</td>
                    <td className="text-end fw-bold">R$ {(item.Produto.preco * item.quantidade).toFixed(2)}</td>
                    <td className="text-center">
                      <button className="btn btn-sm btn-outline-danger" onClick={() => removeItemFromCart(item.id, item.Produto.id)}>
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="row justify-content-end mt-4">
              <div className="col-md-5">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Resumo do Pedido</h5>
                    <hr />
                    <div className="d-flex justify-content-between mb-2">
                      <span>Subtotal ({itemCount} itens):</span>
                      <span>R$ {totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <span>Taxa de entrega:</span>
                      <span className={taxaFrete === 0 ? 'text-success' : ''}>
                        {taxaFrete > 0 ? `R$ ${taxaFrete.toFixed(2)}` : 'Grátis'}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between fw-bold fs-5">
                      <span>Total:</span>
                      <span>R$ {valorTotalPedido.toFixed(2)}</span>
                    </div>
                    <hr />
                    {user && (
                        <>
                          <div className="mb-3">
                            <label htmlFor="enderecoEntrega" className="form-label">Endereço de Entrega</label>
                            {enderecos.length > 0 ? (
                                <select
                                id="enderecoEntrega"
                                className="form-select"
                                value={enderecoEntregaId}
                                onChange={e => setEnderecoEntregaId(e.target.value)}
                                required
                                >
                                {enderecos.map(end => (
                                    <option key={end.id} value={end.id}>{end.logradouro}, {end.numero} - {end.bairro}</option>
                                ))}
                                </select>
                            ) : (
                                <div className='alert alert-warning p-2'>
                                    Nenhum endereço. <Link to="/perfil">Cadastre um aqui</Link>.
                                </div>
                            )}
                          </div>

                          <div className="mb-3">
                              <label htmlFor="formaPagamento" className="form-label">Forma de Pagamento</label>
                              <select
                              id="formaPagamento"
                              className="form-select"
                              value={formaPagamentoId}
                              onChange={e => setFormaPagamentoId(e.target.value)}
                              required
                              >
                              <option value="">Selecione...</option>
                              {formasPagamento.map(fp => (
                                  <option key={fp.id} value={fp.id}>{fp.nome}</option>
                              ))}
                              </select>
                          </div>
                        </>
                    )}
                    <button
                        className="btn btn-success w-100 btn-lg mt-2"
                        onClick={handleFinalizarPedido}
                        disabled={loadingCart || (user && (!formaPagamentoId || !enderecoEntregaId))}
                    >
                      {user ? 'Finalizar Pedido' : 'Fazer Login para Finalizar'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {user && <button className="btn btn-sm btn-outline-warning mt-3" onClick={clearClientCart}>Limpar Carrinho</button>}
          </>
        )}
      </div>
    </>
  );
}