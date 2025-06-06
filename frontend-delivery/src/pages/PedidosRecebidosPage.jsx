import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import HeaderEmpresa from '../components/HeaderEmpresa';
import pedidoService from '../services/pedidoService';

export default function PedidosRecebidosPage() {
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (user?.id) {
        buscarPedidos();
    }
  }, [user]);

  async function buscarPedidos() {
    try {
      const response = await pedidoService.listar();
      setPedidos(response.data);
    } catch {
      setErro('Erro ao carregar pedidos recebidos');
    }
  }

  async function atualizarStatus(pedidoId, novoStatus) {
    try {
      await pedidoService.atualizarStatus(pedidoId, { status: novoStatus });
      buscarPedidos();
    } catch(err) {
      console.error(err);
      alert(err.response?.data?.erro || 'Erro ao atualizar status');
    }
  }

  return (
    <>
      <HeaderEmpresa />
      <div className="container py-5">
        <h2 className="mb-4">Pedidos Recebidos</h2>
        {erro && <div className="alert alert-danger">{erro}</div>}
        {pedidos.length === 0 ? (
          <p>Não há pedidos recebidos no momento.</p>
        ) : (
          pedidos.map(pedido => (
            <div className="card mb-4" key={pedido.id}>
              <div className="card-header d-flex justify-content-between align-items-center">
                <strong>Pedido #{pedido.id}</strong>
                <select
                  className="form-select w-auto"
                  value={pedido.status}
                  onChange={e => atualizarStatus(pedido.id, e.target.value)}
                >
                  <option value="pendente">Pendente</option>
                  <option value="em preparo">Em preparo</option>
                  <option value="a caminho">A caminho</option>
                  <option value="entregue">Entregue</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
              <div className="card-body">
                <p><strong>Cliente:</strong> {pedido.cliente?.nome || 'Não identificado'}</p>
                <p><strong>Forma de Pagamento:</strong> {pedido.formaPagamento?.nome || 'Não identificada'}</p>
                <ul className="list-group list-group-flush">
                  {pedido.ItemPedidos && pedido.ItemPedidos.map(item => (
                    <li className="list-group-item" key={item.id}>
                      {item.Produto?.nome || 'Produto Indisponível'} — {item.quantidade}x — R$ {item.Produto?.preco ? (item.Produto.preco * item.quantidade).toFixed(2) : 'N/A'}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}