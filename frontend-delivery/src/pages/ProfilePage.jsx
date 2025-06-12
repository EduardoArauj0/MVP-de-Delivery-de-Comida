import React, { useState, useEffect } from 'react';
import HeaderCliente from '../components/HeaderCliente';
import EnderecoForm from '../components/EnderecoForm';
import { useAuth } from '../hooks/useAuth';
import enderecoService from '../services/enderecoService';
import userService from '../services/userService';
import { Modal } from 'bootstrap';
import './style/ProfilePage.css';

export default function ProfilePage() {
  const { user, updateUserContext } = useAuth();
  
  // Estados para o modal de endereço
  const [enderecos, setEnderecos] = useState([]);
  const [editingEndereco, setEditingEndereco] = useState(null);
  const [enderecoModal, setEnderecoModal] = useState(null);

  // Estados para o modal de dados do usuário
  const [userModal, setUserModal] = useState(null);
  const [userData, setUserData] = useState({ nome: user?.nome || '', email: user?.email || '', senha: '' });
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  
  const [activeTab, setActiveTab] = useState('enderecos');

  // Inicialização dos modais
  useEffect(() => {
    const enderecoModalEl = document.getElementById('enderecoModal');
    if (enderecoModalEl) setEnderecoModal(new Modal(enderecoModalEl));

    const userModalEl = document.getElementById('userModal');
    if (userModalEl) setUserModal(new Modal(userModalEl));
  }, []);

  const fetchEnderecos = async () => {
    try {
      const response = await enderecoService.listarMeus();
      setEnderecos(response.data);
    } catch (error) {
      console.error("Erro ao buscar endereços", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchEnderecos();
    }
  }, [user]);
  
  // Funções para o modal de endereço
  const handleEnderecoSave = () => {
    if (enderecoModal) enderecoModal.hide();
    setEditingEndereco(null);
    fetchEnderecos();
  };
  const handleEditEndereco = (endereco) => {
    setEditingEndereco(endereco);
    if (enderecoModal) enderecoModal.show();
  };
  const handleAddNewEndereco = () => {
    setEditingEndereco(null);
    if (enderecoModal) enderecoModal.show();
  };
  const handleCancelEndereco = () => {
    if (enderecoModal) enderecoModal.hide();
    setEditingEndereco(null);
  };
  const handleRemoveEndereco = async (id) => {
    if (window.confirm("Tem certeza que deseja remover este endereço?")) {
      await enderecoService.remover(id);
      fetchEnderecos();
    }
  };

  // Funções para o modal de dados do usuário
  const handleShowUserModal = () => {
    setUserData({ nome: user.nome, email: user.email, senha: '' });
    setFeedback({ message: '', type: '' });
    if (userModal) userModal.show();
  };
  const handleUserFormChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };
  const handleUserUpdate = async (e) => {
    e.preventDefault();
    const dataToUpdate = {
      nome: userData.nome,
      email: userData.email,
    };
    if (userData.senha) {
      dataToUpdate.senha = userData.senha;
    }
    
    try {
      const response = await userService.updateUser(user.id, dataToUpdate);
      updateUserContext(response.data);
      setFeedback({ message: 'Dados atualizados com sucesso!', type: 'success' });
      setTimeout(() => {
        if (userModal) userModal.hide();
      }, 1500);
    } catch (error) {
      setFeedback({ message: error.response?.data?.erro || 'Erro ao atualizar dados.', type: 'danger' });
    }
  };

  return (
    <div className="profile-page-container vh-100">
      <HeaderCliente />
      <div className="container py-5">
        <h2 className="mb-4">Meu Perfil</h2>

        <ul className="nav nav-tabs profile-nav-tabs mb-4">
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'enderecos' ? 'active' : ''}`} onClick={() => setActiveTab('enderecos')}>
              Meus Endereços
            </button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'dados' ? 'active' : ''}`} onClick={() => setActiveTab('dados')}>
              Dados Pessoais
            </button>
          </li>
        </ul>

        <div className="tab-content">
          {activeTab === 'enderecos' && (
            <div className="tab-pane fade show active">
              <div className="d-flex justify-content-end mb-3">
                <button className="btn btn-danger" onClick={handleAddNewEndereco}>+ Adicionar Novo Endereço</button>
              </div>
              <div className="row g-4">
                {enderecos.length > 0 ? (
                  enderecos.map(end => (
                    <div className="col-12 col-md-6" key={end.id}>
                      <div className="address-card">
                        <div className="address-card-info">
                          <strong>{end.logradouro}, {end.numero}</strong>
                          <small>{end.bairro}, {end.cidade} - CEP: {end.cep}</small>
                        </div>
                        <div className="address-card-actions">
                          <button className="btn" title="Editar" onClick={() => handleEditEndereco(end)}><i className="bi bi-pencil-fill"></i></button>
                          <button className="btn" title="Remover" onClick={() => handleRemoveEndereco(end.id)}><i className="bi bi-trash-fill"></i></button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">Nenhum endereço cadastrado.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'dados' && (
            <div className="tab-pane fade show active">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Meus Dados</h5>
                  <p><strong>Nome:</strong> {user?.nome}</p>
                  <p><strong>Email:</strong> {user?.email}</p>
                  <button className="btn btn-danger" onClick={handleShowUserModal}>Editar Dados</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal para Endereço */}
      <div className="modal fade" id="enderecoModal" tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{editingEndereco ? 'Editar Endereço' : 'Adicionar Novo Endereço'}</h5>
              <button type="button" className="btn-close" onClick={handleCancelEndereco}></button>
            </div>
            <div className="modal-body">
              <EnderecoForm
                initialData={editingEndereco}
                onSave={handleEnderecoSave}
                onCancel={handleCancelEndereco}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal para Dados do Usuário */}
      <div className="modal fade" id="userModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Editar Dados Pessoais</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              {feedback.message && <div className={`alert alert-${feedback.type}`}>{feedback.message}</div>}
              <form onSubmit={handleUserUpdate}>
                <div className="mb-3">
                  <label htmlFor="nome" className="form-label">Nome</label>
                  <input type="text" id="nome" name="nome" className="form-control form-control-lg" value={userData.nome} onChange={handleUserFormChange} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input type="email" id="email" name="email" className="form-control form-control-lg" value={userData.email} onChange={handleUserFormChange} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="senha" className="form-label">Nova Senha (deixe em branco para não alterar)</label>
                  <input type="password" id="senha" name="senha" className="form-control form-control-lg" value={userData.senha} onChange={handleUserFormChange} />
                </div>
                <div className="modal-footer border-0 pt-4">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                  <button type="submit" className="btn btn-danger">Salvar Alterações</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}