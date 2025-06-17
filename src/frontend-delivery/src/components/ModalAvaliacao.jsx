import { useState } from 'react';
import avaliacaoService from '../services/avaliacaoService';
import './style/ModalAvaliacao.css';

export default function ModalAvaliacao({ show, handleClose, pedidoId, onAvaliacaoSuccess }) {
  const [nota, setNota] = useState(0);
  const [hover, setHover] = useState(0); 
  const [comentario, setComentario] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nota === 0) {
      setErro('Por favor, selecione uma nota de 1 a 5 estrelas.');
      return;
    }
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
      setErro(err.response?.data?.erro || 'Erro ao enviar avaliação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Avaliar Pedido</h5>
            <button type="button" className="btn-close" onClick={handleClose} disabled={loading}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {erro && <div className="alert alert-danger">{erro}</div>}

              <div className="text-center">
                <label className="form-label d-block">Sua Nota</label>
                <div className="rating-stars">
                  {[...Array(5)].map((star, index) => {
                    const ratingValue = index + 1;
                    return (
                      <label key={index}>
                        <input
                          type="radio"
                          name="rating"
                          value={ratingValue}
                          onClick={() => setNota(ratingValue)}
                          style={{ display: 'none' }} 
                        />
                        <i
                          className={`bi bi-star-fill star ${ratingValue <= (hover || nota) ? 'on' : 'off'}`}
                          onMouseEnter={() => setHover(ratingValue)}
                          onMouseLeave={() => setHover(0)}
                        ></i>
                      </label>
                    );
                  })}
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

            <div className="modal-footer border-0">
              <button type="button" className="btn btn-secondary" onClick={handleClose} disabled={loading}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-danger" disabled={loading || nota === 0}>
                {loading ? 'Enviando...' : 'Enviar Avaliação'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}