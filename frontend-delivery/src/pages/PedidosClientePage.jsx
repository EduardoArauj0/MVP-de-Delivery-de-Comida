import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import HeaderCliente from '../components/HeaderCliente';
import pedidoService from '../services/pedidoService';
import ModalAvaliacao from '../components/ModalAvaliacao';

export default function PedidosClientePage() {
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedPedidoId, setSelectedPedidoId] = useState(null);

  const buscarPedidos = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const response = await pedidoService.listar();
      setPedidos(response.data);
    } catch(err) {
      console.error(err);
      setErro('Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarPedidos();
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

  if (loading) {
    return (
        <>
            <HeaderCliente />
            <div className="container vh-100 d-flex justify-content-center align-items-center">
                <div className="spinner-border text-danger" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
            </div>
        </>
    );
  }

  return (
    <>
      <HeaderCliente />
      <div className="container py-5">
        <h2 className="mb-4">Meus Pedidos</h2>
        {erro && <div className="alert alert-danger">{erro}</div>}
        
        {!loading && pedidos.length === 0 ? (
          <p className="text-center text-muted mt-5">Você ainda não fez nenhum pedido.</p>
        ) : (
          pedidos.map(pedido => (
            <div className="card shadow-sm mb-4" key={pedido.id}>
              <div className="card-header d-flex justify-content-between align-items-center bg-light">
                <div>
                    <strong className="me-2">Pedido #{pedido.id}</strong>
                    <small className="text-muted">
                        Realizado em: {new Date(pedido.createdAt).toLocaleDateString('pt-BR')}
                    </small>
                </div>
                <span className="badge bg-primary text-capitalize">{pedido.status}</span>
              </div>
              <div className="card-body">
                <p><strong>Restaurante:</strong> {pedido.restaurantePedido?.nome}</p>
                <p><strong>Endereço de Entrega:</strong> {pedido.enderecoEntrega}</p>
                <p><strong>Forma de Pagamento:</strong> {pedido.metodoPagamento?.nome}</p>
                
                <h6 className="mt-4">Itens do Pedido:</h6>
                <ul className="list-group list-group-flush mb-3">
                  {pedido.itensDoPedido && pedido.itensDoPedido.map(item => (
                    <li className="list-group-item d-flex justify-content-between" key={item.id}>
                      <span>{item.quantidade}x {item.produtoItem?.nome}</span>
                      <span>R$ {(item.precoUnitario * item.quantidade).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>

                <hr/>

                <div className='mt-3'>
                    <div className="d-flex justify-content-between">
                        <span>Subtotal:</span>
                        <span>R$ {parseFloat(pedido.subtotal).toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                        <span>Taxa de Entrega:</span>
                        <span>R$ {parseFloat(pedido.taxaFrete).toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between fw-bold fs-5 mt-2">
                        <span>Total:</span>
                        <span>R$ {parseFloat(pedido.valorTotal).toFixed(2)}</span>
                    </div>
                </div>

              </div>
              <div className="card-footer bg-white text-end">
                {pedido.status === 'entregue' && !pedido.avaliacaoFeita && (
                  <button className="btn btn-outline-primary" onClick={() => handleShowModal(pedido.id)}>
                    Avaliar Pedido
                  </button>
                )}
                {pedido.status === 'entregue' && pedido.avaliacaoFeita && (
                  <button className="btn btn-outline-success" disabled>Pedido Avaliado</button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {selectedPedidoId && (
        <ModalAvaliacao
          show={showModal}
          handleClose={handleCloseModal}
          pedidoId={selectedPedidoId}
          onAvaliacaoSuccess={handleAvaliacaoSuccess}
        />
      )}
    </>
  );
}