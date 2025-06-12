import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import restauranteService from '../services/restauranteService';
import produtoService from '../services/produtoService';
import pedidoService from '../services/pedidoService';
import HeaderEmpresa from '../components/HeaderEmpresa';
import RestauranteForm from '../components/RestauranteForm';
import ProdutoList from '../components/ProdutoList';
import ProdutoForm from '../components/ProdutoForm';
import Modal from '../components/Modal';
import './style/DashboardEmpresa.css';

const statusStyles = { pendente: { bg: 'secondary', text: 'Pendente' }, 'em preparo': { bg: 'primary', text: 'Em Preparo' }, 'a caminho': { bg: 'info', text: 'A Caminho' }, entregue: { bg: 'success', text: 'Entregue' }, cancelado: { bg: 'danger', text: 'Cancelado' },};
function PedidosRecebidosTab() {
  const [pedidos, setPedidos] = useState([]); const [loading, setLoading] = useState(true);
  const buscarPedidos = useCallback(async () => { try { setLoading(true); const response = await pedidoService.listar(); const pedidosDaEmpresa = response.data.filter(p => p.restaurantePedido); setPedidos(pedidosDaEmpresa); } catch (err) { console.error("Erro ao buscar pedidos:", err); } finally { setLoading(false); } }, []);
  useEffect(() => { buscarPedidos(); }, [buscarPedidos]);
  async function atualizarStatus(pedidoId, novoStatus) { await pedidoService.atualizarStatus(pedidoId, { status: novoStatus }); buscarPedidos(); }
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
      {pedidos.length === 0 ? <p>Não há pedidos recebidos no momento.</p> : pedidos.map(pedido => {
        const style = statusStyles[pedido.status] || statusStyles.pendente;
        return (
          <div className="card mb-3" key={pedido.id}><div className="card-header d-flex justify-content-between align-items-center"><div><strong>Pedido #{pedido.codigo}</strong><small className="ms-3 text-muted">Cliente: {pedido.usuarioCliente?.nome || 'Não identificado'}</small></div><span className={`badge text-bg-${style.bg}`}>{style.text}</span></div><div className="card-body"><p><strong>Forma de Pagamento:</strong> {pedido.metodoPagamento?.nome || 'Não identificada'}</p><ul className="list-group list-group-flush">{pedido.itensDoPedido?.map(item => (<li className="list-group-item px-0" key={item.id}>{item.produtoItem?.nome || 'Produto Indisponível'} — {item.quantidade}x — R$ {item.produtoItem?.preco ? (item.produtoItem.preco * item.quantidade).toFixed(2) : 'N/A'}</li>))}</ul></div><div className="card-footer d-flex justify-content-between align-items-center bg-light"><strong className="fs-5">Total: R$ {parseFloat(pedido.valorTotal).toFixed(2)}</strong><div className="d-flex gap-2"><RenderAction pedido={pedido} />{pedido.status !== 'cancelado' && pedido.status !== 'entregue' && (<button className="btn btn-sm btn-outline-danger" onClick={() => atualizarStatus(pedido.id, 'cancelado')}>Cancelar</button>)}</div></div></div>
        )
      })}
    </div>
  );
}

export default function DashboardEmpresa() {
  const { user } = useAuth();
  const [restaurante, setRestaurante] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('pedidos');
  const [editingProduto, setEditingProduto] = useState(null);
  const backendUrl = import.meta.env.VITE_API_URL;

  const [isRestauranteModalOpen, setIsRestauranteModalOpen] = useState(false);
  const [isProdutoModalOpen, setIsProdutoModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemParaRemover, setItemParaRemover] = useState(null);

  const fetchDados = useCallback(async () => {
    if (!user) return; setLoading(true); setError('');
    try {
      const response = await restauranteService.listar({ empresaId: user.id });
      if (response.data && response.data.length > 0) {
        const restData = response.data[0]; setRestaurante(restData);
        const prodResponse = await produtoService.listar({ RestauranteId: restData.id, ativoOnly: false });
        setProdutos(prodResponse.data || []);
      } else { setRestaurante(null); }
    } catch { setError('Falha ao carregar dados do restaurante.'); } 
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { fetchDados(); }, [fetchDados]);

  // Funções para o modal de confirmação
  const handleAbrirConfirmacaoRemocao = (produto) => {
    setItemParaRemover(produto);
    setIsConfirmModalOpen(true);
  };
  const handleFecharConfirmacaoRemocao = () => {
    setItemParaRemover(null);
    setIsConfirmModalOpen(false);
  };
  const handleConfirmarRemocao = async () => {
    if (itemParaRemover) {
      await produtoService.remover(itemParaRemover.id);
      fetchDados();
      handleFecharConfirmacaoRemocao();
    }
  };

  const handleShowProdutoModal = (produto = null) => { setEditingProduto(produto); setIsProdutoModalOpen(true); };
  const handleHideProdutoModal = () => { fetchDados(); setIsProdutoModalOpen(false); setEditingProduto(null); };
  const handleShowRestauranteModal = () => setIsRestauranteModalOpen(true);
  const handleHideRestauranteModal = () => { fetchDados(); setIsRestauranteModalOpen(false); };

  if (loading) return <><HeaderEmpresa /><div className="container vh-100 d-flex justify-content-center align-items-center"><div className="spinner-border text-danger"></div></div></>;

  const logoImageUrl = restaurante?.imagemUrl?.startsWith('/') ? `${backendUrl}${restaurante.imagemUrl}` : restaurante?.imagemUrl;

  return (
    <>
      <HeaderEmpresa />
      <div className="dashboard-container">
        <div className="container py-5">
          {error && <div className="alert alert-danger">{error}</div>}
          {!restaurante ? (
            <div className="text-center bg-white p-5 rounded shadow-sm">
              <h3>Você ainda não cadastrou seu restaurante.</h3>
              <p className="lead text-muted">Clique no botão abaixo para começar a vender.</p>
              <button className="btn btn-danger btn-lg mt-3" onClick={handleShowRestauranteModal}>+ Cadastrar Meu Restaurante</button>
            </div>
          ) : (
            <>
              <div className="d-flex align-items-center mb-4"><img src={logoImageUrl} alt={`Logo do ${restaurante.nome}`} className="order-restaurant-logo me-3" /><h2>Painel: {restaurante.nome}</h2></div>
              <ul className="nav nav-tabs profile-nav-tabs mb-4">
                <li className="nav-item"><button className={`nav-link ${activeTab === 'pedidos' ? 'active' : ''}`} onClick={() => setActiveTab('pedidos')}>Pedidos Recebidos</button></li>
                <li className="nav-item"><button className={`nav-link ${activeTab === 'cardapio' ? 'active' : ''}`} onClick={() => setActiveTab('cardapio')}>Cardápio</button></li>
                <li className="nav-item"><button className={`nav-link ${activeTab === 'restaurante' ? 'active' : ''}`} onClick={() => setActiveTab('restaurante')}>Meu Restaurante</button></li>
              </ul>
              <div className="tab-content p-4 bg-white rounded shadow-sm">
                {activeTab === 'restaurante' && (<div><div className="d-flex justify-content-between align-items-center mb-3"><h4 className="mb-0">Dados do Estabelecimento</h4><button className="btn btn-outline-primary" onClick={handleShowRestauranteModal}>Editar Dados</button></div><hr/><p><strong>CNPJ:</strong> {restaurante.cnpj}</p><p><strong>Endereço:</strong> {restaurante.endereco}</p><p><strong>Telefone:</strong> {restaurante.telefone}</p><p><strong>Taxa de Entrega:</strong> R$ {parseFloat(restaurante.taxaFrete).toFixed(2)}</p></div>)}
                {activeTab === 'cardapio' && <ProdutoList produtos={produtos} onUpdate={fetchDados} onAddProduto={() => handleShowProdutoModal(null)} onEditProduto={handleShowProdutoModal} onConfirmarRemocao={handleAbrirConfirmacaoRemocao} />}
                {activeTab === 'pedidos' && <PedidosRecebidosTab />}
              </div>
            </>
          )}
        </div>
      </div>
      
      <Modal show={isRestauranteModalOpen} onClose={handleHideRestauranteModal} title={restaurante ? 'Editar Restaurante' : 'Cadastrar Restaurante'} size="lg">
        <RestauranteForm initialData={restaurante} onSave={handleHideRestauranteModal} />
      </Modal>

      <Modal show={isProdutoModalOpen} onClose={handleHideProdutoModal} title={editingProduto ? 'Editar Produto' : 'Adicionar Novo Produto'} size="lg">
        <ProdutoForm initialData={editingProduto} onSave={handleHideProdutoModal} restauranteId={restaurante?.id} />
      </Modal>

      {/* Modal de Confirmação */}
      <Modal show={isConfirmModalOpen} onClose={handleFecharConfirmacaoRemocao} title="Confirmar Exclusão" size="sm">
        <p>Você tem certeza que deseja remover o produto <strong>"{itemParaRemover?.nome}"</strong>?</p>
        <p className="text-danger">Esta ação não pode ser desfeita.</p>
        <div className="d-flex justify-content-end gap-2 mt-4">
          <button className="btn btn-secondary" onClick={handleFecharConfirmacaoRemocao}>Cancelar</button>
          <button className="btn btn-danger" onClick={handleConfirmarRemocao}>Sim, remover</button>
        </div>
      </Modal>
    </>
  );
}