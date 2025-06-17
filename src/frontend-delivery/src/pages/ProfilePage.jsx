import React, { useState, useEffect } from 'react';
import HeaderCliente from '../components/HeaderCliente';
import EnderecoForm from '../components/EnderecoForm';
import { useAuth } from '../hooks/useAuth';
import enderecoService from '../services/enderecoService';
import userService from '../services/userService';
import Modal from '../components/Modal';
import './style/ProfilePage.css';

export default function ProfilePage() {
  const { user, updateUserContext } = useAuth();
  const [isEnderecoModalOpen, setIsEnderecoModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [enderecos, setEnderecos] = useState([]);
  const [editingEndereco, setEditingEndereco] = useState(null);
  const [userData, setUserData] = useState({ nome: user?.nome || '', email: user?.email || '', senha: '' });
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [activeTab, setActiveTab] = useState('enderecos');

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
  
  const handleEnderecoSave = () => {
    setIsEnderecoModalOpen(false);
    setEditingEndereco(null);
    fetchEnderecos();
  };

  const handleEditEndereco = (endereco) => {
    setEditingEndereco(endereco);
    setIsEnderecoModalOpen(true);
  };

  const handleAddNewEndereco = () => {
    setEditingEndereco(null);
    setIsEnderecoModalOpen(true);
  };

  const handleCancelEndereco = () => {
    setIsEnderecoModalOpen(false);
    setEditingEndereco(null);
  };

  const handleRemoveEndereco = async (id) => {
    if (window.confirm("Tem certeza que deseja remover este endereço?")) {
      await enderecoService.remover(id);
      fetchEnderecos();
    }
  };

  const handleShowUserModal = () => {
    setUserData({ nome: user.nome, email: user.email, senha: '' });
    setFeedback({ message: '', type: '' });
    setIsUserModalOpen(true);
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
        setIsUserModalOpen(false);
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
      <Modal 
        show={isEnderecoModalOpen} 
        onClose={handleCancelEndereco}
        title={editingEndereco ? 'Editar Endereço' : 'Adicionar Novo Endereço'}
        size="lg"
      >
        <EnderecoForm
          initialData={editingEndereco}
          onSave={handleEnderecoSave}
          onCancel={handleCancelEndereco}
        />
      </Modal>

      {/* Modal para Dados */}
      <Modal 
        show={isUserModalOpen} 
        onClose={() => setIsUserModalOpen(false)}
        title="Editar Dados Pessoais"
      >
        {feedback.message && <div className={`alert alert-${feedback.type}`}>{feedback.message}</div>}
        <form onSubmit={handleUserUpdate}>
          <div className="mb-3">
            <label htmlFor="nome" className="form-label">Nome</label>
            <input type="text" id="nome" name="nome" className="form-control" value={userData.nome} onChange={handleUserFormChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input type="email" id="email" name="email" className="form-control" value={userData.email} onChange={handleUserFormChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="senha" className="form-label">Nova Senha (deixe em branco para não alterar)</label>
            <input type="password" id="senha" name="senha" className="form-control" value={userData.senha} onChange={handleUserFormChange} />
          </div>
          <div className="modal-footer border-0 pt-4">
            <button type="button" className="btn btn-secondary" onClick={() => setIsUserModalOpen(false)}>Cancelar</button>
            <button type="submit" className="btn btn-danger">Salvar Alterações</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}