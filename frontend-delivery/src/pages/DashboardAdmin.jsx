import { useState } from 'react';
import HeaderAdmin from '../components/HeaderAdmin';
import CozinhaManager from '../components/CozinhaManager';
import ModoPagamentoManager from '../components/ModoPagamentoManager';
import UserManager from '../components/UserManager';
import RestauranteManager from '../components/RestauranteManager';
import AvaliacaoManager from '../components/AvaliacaoManager'; // 1. IMPORTE O NOVO COMPONENTE
import Modal from '../components/Modal';
import UserEditForm from '../components/UserEditForm';
import RestauranteForm from '../components/RestauranteForm';

export default function DashboardAdmin() {
  const [activeTab, setActiveTab] = useState('usuarios');
  
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isRestauranteModalOpen, setIsRestauranteModalOpen] = useState(false);
  const [editingRestaurante, setEditingRestaurante] = useState(null);
  const [refreshUserList, setRefreshUserList] = useState(0);

  const handleEditUser = (user) => { setEditingUser(user); setIsUserModalOpen(true); };
  const handleCloseUserModal = () => { setIsUserModalOpen(false); setEditingUser(null); };
  const handleSaveUser = () => { handleCloseUserModal(); setRefreshUserList(prev => prev + 1); };

  const handleEditRestaurante = (restaurante) => { setEditingRestaurante(restaurante); setIsRestauranteModalOpen(true); };
  const handleCloseRestauranteModal = () => { setIsRestauranteModalOpen(false); setEditingRestaurante(null); };

  return (
    <>
      <HeaderAdmin />
      <div className="container py-5">
        <h2 className="mb-4">Painel de Administração do Sistema</h2>
        
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'usuarios' ? 'active' : ''}`} onClick={() => setActiveTab('usuarios')}>
              <i className="bi bi-people-fill me-2"></i>Gerenciar Usuários
            </button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'restaurantes' ? 'active' : ''}`} onClick={() => setActiveTab('restaurantes')}>
              <i className="bi bi-shop me-2"></i>Gerenciar Restaurantes
            </button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'avaliacoes' ? 'active' : ''}`} onClick={() => setActiveTab('avaliacoes')}>
              <i className="bi bi-star-half me-2"></i>Gerenciar Avaliações
            </button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'cozinhas' ? 'active' : ''}`} onClick={() => setActiveTab('cozinhas')}>
              <i className="bi bi-egg-fried me-2"></i>Gerenciar Cozinhas
            </button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'pagamentos' ? 'active' : ''}`} onClick={() => setActiveTab('pagamentos')}>
              <i className="bi bi-credit-card-fill me-2"></i>Gerenciar Pagamentos
            </button>
          </li>
        </ul>

        <div className="tab-content pt-4">
          {activeTab === 'usuarios' && <UserManager onEditUser={handleEditUser} key={refreshUserList} />}
          {activeTab === 'restaurantes' && <RestauranteManager onEditRestaurante={handleEditRestaurante} />}
          {activeTab === 'avaliacoes' && <AvaliacaoManager />}
          {activeTab === 'cozinhas' && <CozinhaManager />}
          {activeTab === 'pagamentos' && <ModoPagamentoManager />}
        </div>
      </div>

      <Modal show={isUserModalOpen} onClose={handleCloseUserModal} title={`Editando: ${editingUser?.nome}`}>
        {editingUser && <UserEditForm user={editingUser} onSave={handleSaveUser} onCancel={handleCloseUserModal} />}
      </Modal>

      <Modal show={isRestauranteModalOpen} onClose={handleCloseRestauranteModal} title={`Editando: ${editingRestaurante?.nome}`} size="lg">
        {editingRestaurante && 
          <RestauranteForm
            initialData={editingRestaurante}
            onSave={handleCloseRestauranteModal}
          />
        }
      </Modal>
    </>
  );
}