import React, { useState, useEffect } from 'react';
import cozinhaService from '../services/cozinhaService';

export default function CozinhaManager() {
  const [cozinhas, setCozinhas] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCozinhas = async () => {
    setLoading(true);
    try {
      const response = await cozinhaService.listar();
      setCozinhas(response.data);
    } catch {
      setError('Falha ao carregar cozinhas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCozinhas();
  }, []);

  const handleEdit = (cozinha) => {
    setEditingId(cozinha.id);
    setEditingName(cozinha.nome);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleSave = async (id) => {
    try {
      await cozinhaService.atualizar(id, { nome: editingName });
      setEditingId(null);
      fetchCozinhas();
    } catch (err) {
      alert(err.response?.data?.erro || 'Erro ao salvar.');
    }
  };

  const handleRemove = async (id) => {
    if (window.confirm('Tem certeza que deseja remover este tipo de cozinha?')) {
      try {
        await cozinhaService.remover(id);
        fetchCozinhas();
      } catch (err) {
        alert(err.response?.data?.erro || 'Erro ao remover.');
      }
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      await cozinhaService.criar({ nome: newName });
      setNewName('');
      fetchCozinhas();
    } catch (err) {
      alert(err.response?.data?.erro || 'Erro ao adicionar.');
    }
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header"><h5 className="mb-0">Gerenciar Tipos de Cozinha</h5></div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleAdd} className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Nome da nova cozinha"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button className="btn btn-success" type="submit">+ Adicionar</button>
        </form>
        {loading && <div className="text-center"><div className="spinner-border spinner-border-sm"></div></div>}
        <ul className="list-group">
          {cozinhas.map((cozinha) => (
            <li key={cozinha.id} className="list-group-item d-flex justify-content-between align-items-center">
              {editingId === cozinha.id ? (
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                />
              ) : (
                <span>{cozinha.nome}</span>
              )}
              <div>
                {editingId === cozinha.id ? (
                  <>
                    <button className="btn btn-sm btn-success me-2" onClick={() => handleSave(cozinha.id)}>Salvar</button>
                    <button className="btn btn-sm btn-secondary" onClick={handleCancel}>Cancelar</button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(cozinha)}>Editar</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemove(cozinha.id)}>Remover</button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}