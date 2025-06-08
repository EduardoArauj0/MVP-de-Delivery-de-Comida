import React, { useState, useEffect } from 'react';
import modoPagamentoService from '../services/modoPagamentoService';

export default function ModoPagamentoManager() {
  const [modos, setModos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchModos = async () => {
    setLoading(true);
    try {
      const response = await modoPagamentoService.listar();
      setModos(response.data);
    } catch {
      setError('Falha ao carregar modos de pagamento.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModos();
  }, []);

  const handleEdit = (modo) => {
    setEditingId(modo.id);
    setEditingName(modo.nome);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleSave = async (id) => {
    try {
      await modoPagamentoService.atualizar(id, { nome: editingName });
      setEditingId(null);
      fetchModos();
    } catch (err) {
      alert(err.response?.data?.erro || 'Erro ao salvar.');
    }
  };

  const handleRemove = async (id) => {
    if (window.confirm('Tem certeza que deseja remover este modo de pagamento?')) {
      try {
        await modoPagamentoService.remover(id);
        fetchModos();
      } catch (err) {
        alert(err.response?.data?.erro || 'Erro ao remover.');
      }
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      await modoPagamentoService.criar({ nome: newName });
      setNewName('');
      fetchModos();
    } catch (err) {
      alert(err.response?.data?.erro || 'Erro ao adicionar.');
    }
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header"><h5 className="mb-0">Gerenciar Modos de Pagamento</h5></div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleAdd} className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Nome do novo modo de pagamento"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button className="btn btn-success" type="submit">+ Adicionar</button>
        </form>
        {loading && <div className="text-center"><div className="spinner-border spinner-border-sm"></div></div>}
        <ul className="list-group">
          {modos.map((modo) => (
            <li key={modo.id} className="list-group-item d-flex justify-content-between align-items-center">
              {editingId === modo.id ? (
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                />
              ) : (
                <span>{modo.nome}</span>
              )}
              <div>
                {editingId === modo.id ? (
                  <>
                    <button className="btn btn-sm btn-success me-2" onClick={() => handleSave(modo.id)}>Salvar</button>
                    <button className="btn btn-sm btn-secondary" onClick={handleCancel}>Cancelar</button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(modo)}>Editar</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemove(modo.id)}>Remover</button>
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