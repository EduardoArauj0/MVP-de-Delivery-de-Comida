import React, { useState, useEffect, useCallback } from 'react';
import restauranteService from '../services/restauranteService';
import ConfirmModal from './ConfirmModal';

export default function RestauranteManager({ onEditRestaurante }) {
  const [restaurantes, setRestaurantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [itemToProcess, setItemToProcess] = useState(null);

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

  const handleToggleAtivoClick = (restaurante) => {
    setItemToProcess(restaurante);
    setConfirmAction(() => () => handleToggleAtivo(restaurante));
    setShowConfirmModal(true);
  };
  
  const handleRemoveClick = (restaurante) => {
    setItemToProcess(restaurante);
    setConfirmAction(() => () => handleRemove(restaurante.id));
    setShowConfirmModal(true);
  };

  const handleToggleAtivo = async (restaurante) => {
    try {
      await restauranteService.atualizar(restaurante.id, { ativo: !restaurante.ativo });
      fetchRestaurantes();
    } catch {
      alert('Não foi possível alterar o status do restaurante.');
    }
  };

  const handleRemove = async (restauranteId) => {
    try {
      await restauranteService.remover(restauranteId);
      fetchRestaurantes();
    } catch (err) {
      alert(err.response?.data?.erro || 'Erro ao remover restaurante.');
    }
  };
  
  const handleConfirm = () => {
    if (confirmAction) {
      confirmAction();
    }
    setShowConfirmModal(false);
    setItemToProcess(null);
    setConfirmAction(null);
  };

  if (loading) return <div className="text-center"><div className="spinner-border"></div></div>;

  return (
    <>
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
                        onClick={() => handleToggleAtivoClick(restaurante)}
                      >
                        {restaurante.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="text-center">
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => onEditRestaurante(restaurante)}>
                        Editar
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemoveClick(restaurante)}>
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
        onConfirm={handleConfirm}
        title="Confirmar Ação"
        confirmText="Sim, Confirmar"
      >
        <p>Você tem certeza que deseja executar esta ação para o restaurante <strong>"{itemToProcess?.nome}"</strong>?</p>
      </ConfirmModal>
    </>
  );
}