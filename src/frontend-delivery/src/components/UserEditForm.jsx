import React, { useState, useEffect } from 'react';
import userService from '../services/userService';
import grupoService from '../services/grupoService';

export default function UserEditForm({ user, onSave, onCancel }) {
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
    } catch {
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
  );
}