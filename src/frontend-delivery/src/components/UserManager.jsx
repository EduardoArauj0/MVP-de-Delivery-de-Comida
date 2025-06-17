import React, { useState, useEffect, useCallback } from 'react';
import userService from '../services/userService';
import ConfirmModal from './ConfirmModal';
import ErrorModal from './ErrorModal';

export default function UserManager({ onEditUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToRemove, setUserToRemove] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers();
      setUsers(response.data);
    } catch (err) {
      setErrorMessage('Falha ao carregar usuários.');
      setShowErrorModal(true);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRemoveClick = (user) => {
    setUserToRemove(user);
    setShowConfirmModal(true);
  };

  const handleConfirmRemove = async () => {
    if (!userToRemove) return;
    try {
      await userService.deleteUser(userToRemove.id);
      fetchUsers(); 
    } catch (err) {
      setErrorMessage(err.response?.data?.erro || 'Erro ao remover usuário.');
      setShowErrorModal(true);
    } finally {
      setShowConfirmModal(false);
      setUserToRemove(null);
    }
  };

  if (loading) {
    return <div className="text-center"><div className="spinner-border"></div></div>;
  }

  return (
    <>
      <div className="card shadow-sm">
        <div className="card-header"><h5 className="mb-0">Todos os Usuários</h5></div>
        <div className="card-body">
          {errorMessage && !showErrorModal && <div className="alert alert-danger">{errorMessage}</div>}
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th className="text-center">Grupos/Papéis</th>
                  <th className="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.nome}</td>
                    <td>{user.email}</td>
                    <td className="text-center">
                      {user.grupos.map(grupo => (
                        <span key={grupo.nome} className={`badge me-1 text-bg-${grupo.nome === 'Admin' ? 'danger' : grupo.nome === 'Empresa' ? 'primary' : 'secondary'}`}>
                          {grupo.nome}
                        </span>
                      ))}
                    </td>
                    <td className="text-center">
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => onEditUser(user)}>
                        Editar
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemoveClick(user)}>
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmModal
        show={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmRemove}
        title="Confirmar Remoção"
        confirmText="Sim, Remover"
      >
        <p>Tem certeza que deseja remover o usuário <strong>"{userToRemove?.nome}"</strong>?</p>
      </ConfirmModal>

      <ErrorModal
        show={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Erro"
      >
        <p>{errorMessage}</p>
      </ErrorModal>
    </>
  );
}