import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import restauranteService from '../services/restauranteService';
import produtoService from '../services/produtoService';
import HeaderEmpresa from '../components/HeaderEmpresa';
import RestauranteForm from '../components/RestauranteForm';
import ProdutoList from '../components/ProdutoList';
import ProdutoForm from '../components/ProdutoForm';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal'
import PedidosRecebidosContent from './PedidosRecebidosPage';
import './style/DashboardEmpresa.css';

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
                {activeTab === 'pedidos' && <PedidosRecebidosContent />}
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

      <ConfirmModal
        show={isConfirmModalOpen}
        onClose={handleFecharConfirmacaoRemocao}
        onConfirm={handleConfirmarRemocao}
        title="Confirmar Exclusão"
        confirmText="Sim, remover"
      >
        <p>Você tem certeza que deseja remover o produto <strong>"{itemParaRemover?.nome}"</strong>?</p>
        <p className="text-danger small">Esta ação não pode ser desfeita.</p>
      </ConfirmModal>
    </>
  );
}