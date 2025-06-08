import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import produtoService from '../services/produtoService';

export default function ProdutoList({ produtos, restauranteId, onUpdate }) {
  const navigate = useNavigate();

  const handleToggleAtivo = async (produto) => {
    if (!window.confirm(`Deseja ${produto.ativo ? 'desativar' : 'ativar'} o produto "${produto.nome}"?`)) return;
    try {
      await produtoService.atualizar(produto.id, { ativo: !produto.ativo });
      onUpdate(); 
    } catch (error) {
      console.error("Erro ao alterar status do produto:", error);
      alert('Não foi possível alterar o status do produto.');
    }
  };

  const handleRemover = async (produtoId) => {
    if (!window.confirm('Tem certeza que deseja remover este produto? Esta ação não pode ser desfeita.')) return;
    try {
      await produtoService.remover(produtoId);
      onUpdate();
    } catch (error) {
      console.error("Erro ao remover produto:", error);
      alert('Não foi possível remover o produto.');
    }
  };
  
  return (
    <div>
      <div className="d-flex justify-content-end mb-3">
        <button
          className="btn btn-success"
          onClick={() => navigate('/produto/novo', { state: { restauranteId } })}
        >
          + Adicionar Novo Produto
        </button>
      </div>
      {produtos.length === 0 ? (
        <p className="text-center text-muted">Nenhum produto cadastrado.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Categoria</th>
                <th className="text-end">Preço</th>
                <th className="text-center">Status</th>
                <th className="text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((produto) => (
                <tr key={produto.id}>
                  <td>{produto.nome}</td>
                  <td>{produto.categoria}</td>
                  <td className="text-end">R$ {parseFloat(produto.preco).toFixed(2)}</td>
                  <td className="text-center">
                    <span
                      className={`badge ${produto.ativo ? 'bg-success-subtle text-success-emphasis' : 'bg-secondary-subtle text-secondary-emphasis'}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleToggleAtivo(produto)}
                      title={`Clique para ${produto.ativo ? 'desativar' : 'ativar'}`}
                    >
                      {produto.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="text-center">
                    <Link to={`/produto/${produto.id}/editar`} className="btn btn-sm btn-outline-primary me-2">
                      Editar
                    </Link>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemover(produto.id)}>
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}