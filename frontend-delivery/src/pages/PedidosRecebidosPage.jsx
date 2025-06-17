import { useEffect, useState, useCallback } from 'react';
import pedidoService from '../services/pedidoService';

const statusStyles = {
  pendente: { bg: 'secondary', text: 'Pendente' },
  'em preparo': { bg: 'primary', text: 'Em Preparo' },
  'a caminho': { bg: 'info', text: 'A Caminho' },
  entregue: { bg: 'success', text: 'Entregue' },
  cancelado: { bg: 'danger', text: 'Cancelado' },
};

export default function PedidosRecebidosContent() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  const buscarPedidos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await pedidoService.listar();
      const pedidosDaEmpresa = response.data.filter(p => p.restaurantePedido);
      setPedidos(pedidosDaEmpresa);
    } catch (err) {
      setErro('Erro ao carregar pedidos recebidos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    buscarPedidos();
  }, [buscarPedidos]);

  async function atualizarStatus(pedidoId, novoStatus) {
    if (!window.confirm(`Tem certeza que deseja alterar o status para "${novoStatus}"?`)) return;
    try {
      await pedidoService.atualizarStatus(pedidoId, { status: novoStatus });
      buscarPedidos();
    } catch(err) {
      console.error(err);
      alert(err.response?.data?.erro || 'Erro ao atualizar status');
    }
  }

  const RenderAction = ({ pedido }) => {
    switch (pedido.status) {
      case 'pendente': return <button className="btn btn-sm btn-success" onClick={() => atualizarStatus(pedido.id, 'em preparo')}>Iniciar Preparo</button>;
      case 'em preparo': return <button className="btn btn-sm btn-info text-white" onClick={() => atualizarStatus(pedido.id, 'a caminho')}>Enviar Pedido</button>;
      case 'a caminho': return <button className="btn btn-sm btn-primary" onClick={() => atualizarStatus(pedido.id, 'entregue')}>Finalizar Entrega</button>;
      default: return null;
    }
  };

  if (loading) return <div className="text-center"><div className="spinner-border"></div></div>;

  return (
    <div>
      <h4 className="mb-3">Pedidos Recebidos</h4>
      {erro && <div className="alert alert-danger">{erro}</div>}
      {pedidos.length === 0 ? (
        <p>Não há pedidos recebidos no momento.</p>
      ) : (
        pedidos.map(pedido => {
          const style = statusStyles[pedido.status] || statusStyles.pendente;
          return (
            <div className="card mb-3" key={pedido.id}>
              <div className="card-header d-flex justify-content-between align-items-center">
                <div>
                  <strong>Pedido #{pedido.codigo}</strong>
                  <small className="ms-3 text-muted">
                    Cliente: {pedido.usuarioCliente?.nome || 'Não identificado'}
                  </small>
                </div>
                <span className={`badge text-bg-${style.bg}`}>{style.text}</span>
              </div>
              <div className="card-body">
                {pedido.observacao && (
                  <div className="alert alert-info">
                    <strong>Observação do Cliente:</strong> {pedido.observacao}
                  </div>
                )}
                <p><strong>Forma de Pagamento:</strong> {pedido.metodoPagamento?.nome || 'Não identificada'}</p>
                <ul className="list-group list-group-flush">
                  {pedido.itensDoPedido?.map(item => (
                    <li className="list-group-item px-0" key={item.id}>
                      {item.produtoItem?.nome || 'Produto Indisponível'} — {item.quantidade}x — R$ {item.produtoItem?.preco ? (item.produtoItem.preco * item.quantidade).toFixed(2) : 'N/A'}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card-footer d-flex justify-content-between align-items-center bg-light">
                <strong className="fs-5">Total: R$ {parseFloat(pedido.valorTotal).toFixed(2)}</strong>
                <div className="d-flex gap-2">
                  <RenderAction pedido={pedido} />
                  {pedido.status !== 'cancelado' && pedido.status !== 'entregue' && (
                    <button className="btn btn-sm btn-outline-danger" onClick={() => atualizarStatus(pedido.id, 'cancelado')}>Cancelar</button>
                  )}
                </div>
              </div>
            </div>
          )
        })
      )}
    </div>
  );
}