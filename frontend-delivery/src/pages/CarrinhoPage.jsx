import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function CarrinhoPage() {
  const { user, token } = useAuth();
  const [carrinho, setCarrinho] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function carregarCarrinho() {
      try {
        const response = await axios.get(`http://localhost:3000/carrinho/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCarrinho(response.data);
      } catch (err) {
        console.error(err);
        setErro('Erro ao carregar carrinho');
      }
    }
    carregarCarrinho();
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

  const finalizarPedido = () => {
    alert('Função de finalizar pedido ainda será implementada.');
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
          <h5 className="mt-3">Total: R$ {calcularTotal()}</h5>
          <button className="btn btn-success mt-3" onClick={finalizarPedido}>Finalizar Pedido</button>
        </>
      )}
    </div>
  );
}