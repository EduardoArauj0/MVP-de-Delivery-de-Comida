import React, { useState, useEffect, useCallback } from 'react';
import restauranteService from '../services/restauranteService';

export default function RestauranteManager({ onEditRestaurante }) {
  const [restaurantes, setRestaurantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRestaurantes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await restauranteService.listar(); 
      setRestaurantes(response.data);
    } catch (err) {
      setError('Falha ao carregar restaurantes.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRestaurantes();
  }, [fetchRestaurantes]);

  const handleToggleAtivo = async (restaurante) => {
    if (window.confirm(`Deseja ${restaurante.ativo ? 'DESATIVAR' : 'ATIVAR'} o restaurante "${restaurante.nome}"?`)) {
      try {
        await restauranteService.atualizar(restaurante.id, { ativo: !restaurante.ativo });
        fetchRestaurantes(); 
      } catch {
        alert('Não foi possível alterar o status do restaurante.');
      }
    }
  };

  const handleRemove = async (restauranteId) => {
    if (window.confirm('Tem certeza que deseja REMOVER este restaurante? A ação é irreversível.')) {
        try {
            await restauranteService.remover(restauranteId);
            fetchRestaurantes();
        } catch (err) {
            alert(err.response?.data?.erro || 'Erro ao remover restaurante.');
        }
    }
  };

  if (loading) {
    return <div className="text-center"><div className="spinner-border"></div></div>;
  }

  return (
    <div className="card shadow-sm">
      <div className="card-header"><h5 className="mb-0">Todos os Restaurantes</h5></div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Nome do Restaurante</th>
                <th>Cozinha</th>
                <th>Dono (Empresa)</th>
                <th className="text-center">Status</th>
                <th className="text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {restaurantes.map((restaurante) => (
                <tr key={restaurante.id}>
                  <td>{restaurante.nome}</td>
                  <td>{restaurante.tipoCozinha?.nome || 'N/A'}</td>
                  <td>{restaurante.usuarioEmpresa?.nome || 'Não vinculado'}</td>
                  <td className="text-center">
                    <span 
                      className={`badge ${restaurante.ativo ? 'bg-success' : 'bg-secondary'}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleToggleAtivo(restaurante)}
                    >
                      {restaurante.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="text-center">
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => onEditRestaurante(restaurante)}>
                      Editar
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemove(restaurante.id)}>
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