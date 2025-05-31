import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import HeaderEmpresa from '../components/HeaderEmpresa';

export default function PedidosRecebidosPage() {
  const { token, user } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    buscarPedidos();
  }, [token, user.id]);

  async function buscarPedidos() {
    try {
      const response = await axios.get('http://localhost:3000/pedidos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const meusPedidos = response.data.filter(p => p.Restaurante && p.Restaurante.usuarioId === user.id);
      setPedidos(meusPedidos);
    } catch {
      setErro('Erro ao carregar pedidos recebidos');
    }
  }

  async function atualizarStatus(pedidoId, novoStatus) {
    try {
      await axios.put(`http://localhost:3000/pedidos/${pedidoId}/status`, {
        status: novoStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      buscarPedidos();
    } catch {
      alert('Erro ao atualizar status');
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
                </select>
              </div>
              <div className="card-body">
                <p><strong>Cliente:</strong> {pedido.cliente?.nome}</p>
                <p><strong>Forma de Pagamento:</strong> {pedido.formaPagamento?.nome}</p>
                <ul className="list-group list-group-flush">
                  {pedido.ItemPedidos.map(item => (
                    <li className="list-group-item" key={item.id}>
                      {item.Produto?.nome} — {item.quantidade}x — R$ {(item.Produto?.preco * item.quantidade).toFixed(2)}
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