import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import HeaderCliente from '../components/HeaderCliente';

export default function PedidosClientePage() {
  const { token, user } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function buscarPedidos() {
      try {
        const response = await axios.get('http://localhost:3000/pedidos', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const meusPedidos = response.data.filter(p => p.cliente?.id === user.id);
        setPedidos(meusPedidos);
      } catch {
        setErro('Erro ao carregar pedidos');
      }
    }
    buscarPedidos();
  }, [token, user.id]);

  return (
    <>
      <HeaderCliente />
      <div className="container py-5">
        <h2 className="mb-4">Meus Pedidos</h2>
        {erro && <div className="alert alert-danger">{erro}</div>}
        {pedidos.length === 0 ? (
          <p>Você ainda não fez nenhum pedido.</p>
        ) : (
          pedidos.map(pedido => (
            <div className="card mb-4" key={pedido.id}>
              <div className="card-header d-flex justify-content-between">
                <strong>Pedido #{pedido.id}</strong>
                <span className="badge bg-secondary">{pedido.status}</span>
              </div>
              <div className="card-body">
                <p><strong>Restaurante:</strong> {pedido.Restaurante?.nome}</p>
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