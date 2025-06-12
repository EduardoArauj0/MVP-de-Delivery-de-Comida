import React, { useState, useEffect, useCallback } from 'react';
import userService from '../services/userService';

export default function UserManager({ onEditUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers();
      setUsers(response.data);
    } catch (err) {
      setError('Falha ao carregar usuários.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRemoveUser = async (userId) => {
    if (window.confirm('Tem certeza que deseja remover este usuário?')) {
      try {
        await userService.deleteUser(userId);
        fetchUsers();
      } catch (err) {
        alert(err.response?.data?.erro || 'Erro ao remover usuário.');
      }
    }
  };

  if (loading) {
    return <div className="text-center"><div className="spinner-border"></div></div>;
  }

  return (
    <div className="card shadow-sm">
      <div className="card-header"><h5 className="mb-0">Todos os Usuários</h5></div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
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
                    {/* Botão de Editar adicionado */}
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => onEditUser(user)}>
                      Editar
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemoveUser(user.id)}>
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
  );
}