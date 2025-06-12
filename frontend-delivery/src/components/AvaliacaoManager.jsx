import React, { useState, useEffect, useCallback } from 'react';
import avaliacaoService from '../services/avaliacaoService';

const Stars = ({ nota }) => {
  const totalStars = 5;
  let starElements = [];
  for (let i = 1; i <= totalStars; i++) {
    starElements.push(
      <i key={i} className={`bi bi-star-fill ${i <= nota ? 'text-warning' : 'text-secondary'}`}></i>
    );
  }
  return <div>{starElements}</div>;
};

export default function AvaliacaoManager() {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAvaliacoes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await avaliacaoService.listarTodas();
      setAvaliacoes(response.data);
    } catch (err) {
      setError('Falha ao carregar avaliações.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAvaliacoes();
  }, [fetchAvaliacoes]);

  const handleRemove = async (avaliacaoId) => {
    if (window.confirm('Tem certeza que deseja REMOVER esta avaliação?')) {
      try {
        await avaliacaoService.remover(avaliacaoId);
        fetchAvaliacoes();
      } catch (err) {
        alert(err.response?.data?.erro || 'Erro ao remover avaliação.');
      }
    }
  };

  if (loading) {
    return <div className="text-center"><div className="spinner-border"></div></div>;
  }

  return (
    <div className="card shadow-sm">
      <div className="card-header"><h5 className="mb-0">Todas as Avaliações</h5></div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        {avaliacoes.length === 0 ? (
          <p className="text-muted">Nenhuma avaliação encontrada.</p>
        ) : (
          avaliacoes.map((avaliacao) => (
            <div className="card mb-3" key={avaliacao.id}>
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="card-title mb-1">
                      Restaurante: {avaliacao.Restaurante?.nome || 'Não encontrado'}
                    </h6>
                    <p className="card-subtitle text-muted small">
                      Cliente: {avaliacao.avaliador?.nome || 'Anônimo'}
                    </p>
                  </div>
                  <div className="text-end">
                    <Stars nota={avaliacao.nota} />
                    <small className="text-muted">
                      {new Date(avaliacao.createdAt).toLocaleDateString('pt-BR')}
                    </small>
                  </div>
                </div>
                {avaliacao.comentario && (
                  <p className="card-text mt-2 fst-italic">"{avaliacao.comentario}"</p>
                )}
              </div>
              <div className="card-footer bg-light text-end">
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemove(avaliacao.id)}>
                  <i className="bi bi-trash-fill me-1"></i>
                  Remover Avaliação
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}