export default function ProdutoList({ produtos, onUpdate, onAddProduto, onEditProduto, onConfirmarRemocao }) {

  const handleToggleAtivo = async (produto) => {
    if (!window.confirm(`Deseja ${produto.ativo ? 'desativar' : 'ativar'} o produto "${produto.nome}"?`)) return;
    try {
      const produtoService = (await import('../services/produtoService')).default;
      await produtoService.atualizar(produto.id, { ativo: !produto.ativo });
      onUpdate(); 
    } catch {
      alert('Não foi possível alterar o status do produto.');
    }
  };
  
  return (
    <div>
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-danger" onClick={onAddProduto}>+ Adicionar Novo Produto</button>
      </div>
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>Nome</th><th>Categoria</th><th className="text-end">Preço</th>
              <th className="text-center">Status</th><th className="text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.length > 0 ? produtos.map((produto) => (
              <tr key={produto.id}>
                <td>{produto.nome}</td><td>{produto.categoria}</td>
                <td className="text-end">R$ {parseFloat(produto.preco).toFixed(2)}</td>
                <td className="text-center">
                  <span className={`badge ${produto.ativo ? 'bg-success' : 'bg-secondary'}`} style={{ cursor: 'pointer' }} onClick={() => handleToggleAtivo(produto)}>
                    {produto.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="text-center">
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => onEditProduto(produto)}>Editar</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => onConfirmarRemocao(produto)}>Remover</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="5" className="text-center text-muted">Nenhum produto cadastrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}