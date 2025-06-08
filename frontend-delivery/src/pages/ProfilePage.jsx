import React, { useState, useEffect } from 'react';
import HeaderCliente from '../components/HeaderCliente';
import EnderecoForm from '../components/EnderecoForm';
import { useAuth } from '../hooks/useAuth';
import enderecoService from '../services/enderecoService';

export default function ProfilePage() {
  const { user } = useAuth();
  const [enderecos, setEnderecos] = useState([]);
  const [editingEndereco, setEditingEndereco] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchEnderecos = async () => {
    try {
      const response = await enderecoService.listarMeus();
      setEnderecos(response.data);
    } catch (error) {
      console.error("Erro ao buscar endereços", error);
    }
  };

  useEffect(() => {
    fetchEnderecos();
  }, []);

  const handleSave = () => {
    setShowForm(false);
    setEditingEndereco(null);
    fetchEnderecos();
  };

  const handleEdit = (endereco) => {
    setEditingEndereco(endereco);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingEndereco(null);
    setShowForm(true);
  };

  const handleRemove = async (id) => {
    if (window.confirm("Tem certeza que deseja remover este endereço?")) {
      await enderecoService.remover(id);
      fetchEnderecos();
    }
  };

  return (
    <>
      <HeaderCliente />
      <div className="container py-5">
        <h2 className="mb-4">Meu Perfil</h2>
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Meus Dados</h5>
            <p><strong>Nome:</strong> {user.nome}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        </div>

        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Meus Endereços</h5>
            <button className="btn btn-primary" onClick={handleAddNew}>
              + Adicionar Novo
            </button>
          </div>
          <div className="card-body">
            {showForm && (
              <EnderecoForm
                initialData={editingEndereco}
                onSave={handleSave}
                onCancel={() => setShowForm(false)}
              />
            )}

            {!showForm && enderecos.length > 0 && (
              <ul className="list-group">
                {enderecos.map(end => (
                  <li key={end.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{end.logradouro}, {end.numero}</strong><br />
                      <small>{end.bairro}, {end.cidade} - CEP: {end.cep}</small>
                    </div>
                    <div>
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(end)}>Editar</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemove(end.id)}>Remover</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {!showForm && enderecos.length === 0 && <p>Nenhum endereço cadastrado.</p>}
          </div>
        </div>
      </div>
    </>
  );
}