import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import pedidoService from '../services/pedidoService';
import HeaderCliente from '../components/HeaderCliente';
import ModalAvaliacao from '../components/ModalAvaliacao';
import { Link } from 'react-router-dom';
import './style/PedidosClientePage.css'; 

const statusStyles = {
  pendente: { bg: 'secondary', text: 'Pendente' },
  'em preparo': { bg: 'primary', text: 'Em Preparo' },
  'a caminho': { bg: 'info', text: 'A Caminho' },
  entregue: { bg: 'success', text: 'Entregue' },
  cancelado: { bg: 'danger', text: 'Cancelado' },
};

export default function PedidosClientePage() {
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPedidoId, setSelectedPedidoId] = useState(null);
  const [openAccordion, setOpenAccordion] = useState(null);

  const backendUrl = import.meta.env.VITE_API_URL;

  const buscarPedidos = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const response = await pedidoService.listar();
      setPedidos(response.data);
    } catch {
      setErro('Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      buscarPedidos();
    }
  }, [user]);

  const handleShowModal = (pedidoId) => {
    setSelectedPedidoId(pedidoId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPedidoId(null);
  };
  
  const handleAvaliacaoSuccess = () => {
    buscarPedidos(); 
  };

  const toggleAccordion = (pedidoId) => {
    setOpenAccordion(openAccordion === pedidoId ? null : pedidoId);
  };

  const handleCancelarPedido = async (pedidoId) => {
    if (window.confirm("Tem certeza que deseja cancelar este pedido? Esta ação não pode ser desfeita.")) {
      try {
        await pedidoService.remover(pedidoId);
        buscarPedidos();
      } catch (err) {
        setErro(err.response?.data?.erro || 'Erro ao cancelar o pedido.');
      }
    }
  };

  if (loading) {
    return (
        <>
            <HeaderCliente />
            <div className="container vh-100 d-flex justify-content-center align-items-center">
                <div className="spinner-border text-danger" role="status"></div>
            </div>
        </>
    );
  }

  return (
    <div className="page-container">
      <HeaderCliente />
      <main className="content-wrap bg-light">
        <div className="container py-5">
          <h2 className="mb-4">Meus Pedidos</h2>
          {erro && <div className="alert alert-danger">{erro}</div>}
          
          {!loading && pedidos.length === 0 ? (
            <div className="empty-orders-container">
              <i className="bi bi-receipt"></i>
              <h3>Você ainda não fez nenhum pedido</h3>
              <p className="text-muted">Que tal encontrar seu próximo restaurante favorito?</p>
              <Link to="/" className="btn btn-danger mt-2">Ver restaurantes</Link>
            </div>
          ) : (
            pedidos.map(pedido => {
              const style = statusStyles[pedido.status] || statusStyles.pendente;
              const restauranteLogo = pedido.restaurantePedido.imagemUrl?.startsWith('/')
                ? `${backendUrl}${pedido.restaurantePedido.imagemUrl}`
                : pedido.restaurantePedido.imagemUrl;
              
              return (
              <div className="order-card" key={pedido.id}>
                <div className="order-card-header">
                  <div className="order-restaurant-info">
                    <img src={restauranteLogo} alt={pedido.restaurantePedido.nome} className="order-restaurant-logo" />
                    <div>
                      <h5>{pedido.restaurantePedido.nome}</h5>
                      <span>{new Date(pedido.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>
                  <div className="order-status">
                    <span className={`badge text-bg-${style.bg}`}>{style.text}</span>
                  </div>
                </div>

                <div className="order-card-body">
                  <div className="accordion" id={`accordion-${pedido.id}`}>
                    <div className="accordion-item border-0">
                      <h2 className="accordion-header">
                        <button 
                          className="accordion-button collapsed bg-white shadow-none p-0" 
                          type="button" 
                          onClick={() => toggleAccordion(pedido.id)}
                        >
                          Ver detalhes e itens do pedido
                        </button>
                      </h2>
                      <div className={`accordion-collapse collapse ${openAccordion === pedido.id ? 'show' : ''}`}>
                        <div className="accordion-body px-0 pt-3">
                          {pedido.itensDoPedido.map(item => (
                            <div className="order-item" key={item.id}>
                              <span className="order-item-quantity">{item.quantidade}x</span>
                              <div className="flex-grow-1">{item.produtoItem?.nome}</div>
                              <div className="text-end">R$ {parseFloat(item.precoTotal).toFixed(2)}</div>
                            </div>
                          ))}
                          <hr/>
                           <div className='mt-3'>
                              <div className="d-flex justify-content-between"><span>Subtotal:</span><span>R$ {parseFloat(pedido.subtotal).toFixed(2)}</span></div>
                              <div className="d-flex justify-content-between"><span>Taxa de Entrega:</span><span>R$ {parseFloat(pedido.taxaFrete).toFixed(2)}</span></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="order-card-footer">
                  <span className="order-total-price">Total: R$ {parseFloat(pedido.valorTotal).toFixed(2)}</span>
                  <div className="d-flex gap-2">
                    {pedido.status === 'pendente' && (
                      <button className="btn btn-outline-danger" onClick={() => handleCancelarPedido(pedido.id)}>
                        Cancelar Pedido
                      </button>
                    )}
                    {pedido.status === 'entregue' && (
                      !pedido.avaliacaoFeita ? (
                        <button className="btn btn-danger" onClick={() => handleShowModal(pedido.id)}>Avaliar Pedido</button>
                      ) : (
                        <button className="btn btn-success" disabled>Pedido Avaliado</button>
                      )
                    )}
                  </div>
                </div>
              </div>
            )})
          )}
        </div>
      </main>

      {selectedPedidoId && (
        <ModalAvaliacao
          show={showModal}
          handleClose={handleCloseModal}
          pedidoId={selectedPedidoId}
          onAvaliacaoSuccess={handleAvaliacaoSuccess}
        />
      )}
    </div>
  );
}