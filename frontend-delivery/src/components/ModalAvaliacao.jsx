import { useState } from 'react';
import avaliacaoService from '../services/avaliacaoService';

export default function ModalAvaliacao({ show, handleClose, pedidoId, onAvaliacaoSuccess }) {
  const [nota, setNota] = useState(5);
  const [comentario, setComentario] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');
    try {
      await avaliacaoService.criar({
        nota: Number(nota),
        comentario,
        PedidoId: pedidoId,
      });
      onAvaliacaoSuccess();
      handleClose();
    } catch (err) {
      console.error(err);
      setErro(err.response?.data?.erro || 'Erro ao enviar avaliação. Você já pode ter avaliado este pedido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Avaliar Pedido #{pedidoId}</h5>
            <button type="button" className="btn-close" onClick={handleClose} disabled={loading}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {erro && <div className="alert alert-danger">{erro}</div>}

              <div className="mb-3 text-center">
                <label className="form-label d-block">Sua Nota</label>
                <div
                  className="d-flex justify-content-center fs-2"
                  style={{ WebkitTextStroke: '1px black' }} // Corrigido para sintaxe JSX correta
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={() => !loading && setNota(star)}
                      style={{
                        cursor: loading ? 'default' : 'pointer',
                        color: star <= nota ? '#ffc107' : '#e4e5e9',
                      }}
                      title={`${star} estrela(s)`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="comentario" className="form-label">
                  Comentário (opcional)
                </label>
                <textarea
                  id="comentario"
                  className="form-control"
                  rows="3"
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  disabled={loading}
                ></textarea>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleClose} disabled={loading}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar Avaliação'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}