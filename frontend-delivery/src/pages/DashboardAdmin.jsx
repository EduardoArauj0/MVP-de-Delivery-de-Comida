import { useState, useEffect } from 'react';
import HeaderAdmin from '../components/HeaderAdmin';
import CozinhaManager from '../components/CozinhaManager';
import ModoPagamentoManager from '../components/ModoPagamentoManager';
import UserManager from '../components/UserManager';
import Modal from '../components/Modal';
import userService from '../services/userService';
import grupoService from '../services/grupoService';

const UserEditForm = ({ user, onSave, onCancel }) => {
  const [nome, setNome] = useState(user.nome);
  const [email, setEmail] = useState(user.email);
  const [gruposDisponiveis, setGruposDisponiveis] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(user.grupos[0]?.id || '');

  useEffect(() => {
    grupoService.listar().then(response => {
      setGruposDisponiveis(response.data);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await userService.updateUser(user.id, { nome, email });
      if (selectedGroupId && selectedGroupId !== user.grupos[0]?.id) {
        await userService.updateUserGroup(user.id, selectedGroupId);
      }
      onSave();
    } catch  {
      alert('Erro ao atualizar usuário.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Nome</label>
        <input type="text" className="form-control" value={nome} onChange={e => setNome(e.target.value)} />
      </div>
      <div className="mb-3">
        <label className="form-label">Email</label>
        <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div className="mb-3">
        <label className="form-label">Papel / Grupo</label>
        <select className="form-select" value={selectedGroupId} onChange={e => setSelectedGroupId(e.target.value)}>
          {gruposDisponiveis.map(grupo => (
            <option key={grupo.id} value={grupo.id}>{grupo.nome}</option>
          ))}
        </select>
      </div>
      <div className="d-flex justify-content-end gap-2 mt-4">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn btn-primary">Salvar Alterações</button>
      </div>
    </form>
  )
};

export default function DashboardAdmin() {
  const [activeTab, setActiveTab] = useState('usuarios');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [refreshUserList, setRefreshUserList] = useState(0);

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsUserModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsUserModalOpen(false);
    setEditingUser(null);
  };

  const handleSaveUser = () => {
    handleCloseModal();
    setRefreshUserList(prev => prev + 1);
  };

  return (
    <>
      <HeaderAdmin />
      <div className="container py-5">
        <h2 className="mb-4">Painel de Administração do Sistema</h2>
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item"><button className={`nav-link ${activeTab === 'usuarios' ? 'active' : ''}`} onClick={() => setActiveTab('usuarios')}><i className="bi bi-people-fill me-2"></i>Gerenciar Usuários</button></li>
          <li className="nav-item"><button className={`nav-link ${activeTab === 'cozinhas' ? 'active' : ''}`} onClick={() => setActiveTab('cozinhas')}><i className="bi bi-egg-fried me-2"></i>Gerenciar Cozinhas</button></li>
          <li className="nav-item"><button className={`nav-link ${activeTab === 'pagamentos' ? 'active' : ''}`} onClick={() => setActiveTab('pagamentos')}><i className="bi bi-credit-card-fill me-2"></i>Gerenciar Pagamentos</button></li>
        </ul>
        <div className="tab-content pt-4">
          {activeTab === 'cozinhas' && <CozinhaManager />}
          {activeTab === 'pagamentos' && <ModoPagamentoManager />}
          {activeTab === 'usuarios' && <UserManager onEditUser={handleEditUser} key={refreshUserList} />}
        </div>
      </div>

      <Modal show={isUserModalOpen} onClose={handleCloseModal} title={`Editando: ${editingUser?.nome}`}>
        {editingUser && <UserEditForm user={editingUser} onSave={handleSaveUser} onCancel={handleCloseModal} />}
      </Modal>
    </>
  );
}