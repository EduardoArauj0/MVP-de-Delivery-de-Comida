import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function CarrinhoPage() {
  const { user, token } = useAuth();
  const [carrinho, setCarrinho] = useState(null);
  const [formasPagamento, setFormasPagamento] = useState([]);
  const [restaurantes, setRestaurantes] = useState([]);
  const [formaPagamentoId, setFormaPagamentoId] = useState('');
  const [restauranteId, setRestauranteId] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  useEffect(() => {
    async function carregarDados() {
      try {
        const [carrinhoRes, pagamentoRes, restauranteRes] = await Promise.all([
          axios.get(`http://localhost:3000/carrinho/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`http://localhost:3000/modospagamento`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`http://localhost:3000/restaurantes`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        setCarrinho(carrinhoRes.data);
        setFormasPagamento(pagamentoRes.data);
        setRestaurantes(restauranteRes.data);
      } catch (err) {
        console.error(err);
        setErro('Erro ao carregar dados do carrinho');
      }
    }
    carregarDados();
  }, [user.id, token]);

  const atualizarQuantidade = async (itemId, quantidade) => {
    try {
      await axios.put(`http://localhost:3000/carrinho/${user.id}/itens/${itemId}`, {
        quantidade
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCarrinho(prev => ({
        ...prev,
        CarrinhoItems: prev.CarrinhoItems.map(item =>
          item.id === itemId ? { ...item, quantidade } : item
        )
      }));
    } catch {
      setErro('Erro ao atualizar item');
    }
  };

  const removerItem = async (itemId) => {
    try {
      await axios.delete(`http://localhost:3000/carrinho/${user.id}/itens/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCarrinho(prev => ({
        ...prev,
        CarrinhoItems: prev.CarrinhoItems.filter(item => item.id !== itemId)
      }));
    } catch {
      setErro('Erro ao remover item');
    }
  };

  const finalizarPedido = async () => {
    if (!formaPagamentoId || !restauranteId) {
      setErro('Escolha o restaurante e a forma de pagamento.');
      return;
    }

    const itens = carrinho.CarrinhoItems.map(item => ({
      produtoId: item.Produto.id,
      quantidade: item.quantidade
    }));

    try {
      await axios.post('http://localhost:3000/pedidos', {
        clienteId: user.id,
        restauranteId: parseInt(restauranteId),
        formaPagamentoId: parseInt(formaPagamentoId),
        itens
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCarrinho({ CarrinhoItems: [] });
      setSucesso('Pedido realizado com sucesso!');
      setErro('');
    } catch {
      setErro('Erro ao finalizar pedido');
    }
  };

  const calcularTotal = () => {
    return carrinho?.CarrinhoItems.reduce((total, item) => {
      return total + item.quantidade * item.Produto.preco;
    }, 0).toFixed(2);
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">Seu Carrinho</h2>
      {erro && <div className="alert alert-danger">{erro}</div>}
      {sucesso && <div className="alert alert-success">{sucesso}</div>}

      {!carrinho || carrinho.CarrinhoItems.length === 0 ? (
        <p>Seu carrinho está vazio.</p>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Quantidade</th>
                <th>Preço</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {carrinho.CarrinhoItems.map(item => (
                <tr key={item.id}>
                  <td>{item.Produto.nome}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      className="form-control"
                      value={item.quantidade}
                      onChange={e => atualizarQuantidade(item.id, parseInt(e.target.value))}
                    />
                  </td>
                  <td>R$ {(item.Produto.preco * item.quantidade).toFixed(2)}</td>
                  <td>
                    <button className="btn btn-sm btn-danger" onClick={() => removerItem(item.id)}>
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Restaurante</label>
              <select className="form-select" value={restauranteId} onChange={e => setRestauranteId(e.target.value)}>
                <option value="">Selecione</option>
                {restaurantes.map(r => (
                  <option key={r.id} value={r.id}>{r.nome}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Forma de Pagamento</label>
              <select className="form-select" value={formaPagamentoId} onChange={e => setFormaPagamentoId(e.target.value)}>
                <option value="">Selecione</option>
                {formasPagamento.map(fp => (
                  <option key={fp.id} value={fp.id}>{fp.nome}</option>
                ))}
              </select>
            </div>
          </div>

          <h5 className="mt-3">Total: R$ {calcularTotal()}</h5>
          <button className="btn btn-success mt-3" onClick={finalizarPedido}>Finalizar Pedido</button>
        </>
      )}
    </div>
  );
}