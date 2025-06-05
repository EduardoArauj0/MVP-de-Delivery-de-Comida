import { Link } from 'react-router-dom';

export default function RestauranteCard({ restaurante }) {
  if (!restaurante) {
    return null;
  }

  const tipoCozinhaNome = restaurante.Cozinha?.nome || restaurante.tipoCozinha?.nome || 'Não especificado';
  const taxaFreteFormatada = restaurante.taxaFrete !== undefined && restaurante.taxaFrete !== null
    ? parseFloat(restaurante.taxaFrete) === 0 ? 'Grátis' : `R$ ${parseFloat(restaurante.taxaFrete).toFixed(2)}`
    : 'Consultar';

  return (
    <Link to={`/restaurante/${restaurante.id}`} className="text-decoration-none text-dark">
      <div className="card h-100 shadow-sm restaurant-card">
        <img
          src={restaurante.imagemUrl || `https://source.unsplash.com/400x300/?food,${tipoCozinhaNome.toLowerCase()}&random=${restaurante.id}`}
          className="card-img-top"
          alt={`Foto do restaurante ${restaurante.nome}`}
          style={{ height: '180px', objectFit: 'cover' }}
        />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title text-truncate mb-1">{restaurante.nome}</h5>
          <small className="text-muted mb-2">
            {<span className="badge bg-warning text-dark me-2">⭐ {restaurante.avaliacaoMedia || '-'}</span>}
            {tipoCozinhaNome}
          </small>
          
          <p className="card-text small text-muted mb-2 text-truncate" title={restaurante.endereco}>
            📍 {restaurante.endereco || 'Endereço não informado'}
          </p>

          <div className="mt-auto">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className={parseFloat(restaurante.taxaFrete) === 0 ? 'text-success fw-bold' : 'text-muted'}>
                {taxaFreteFormatada}
              </span>
            </div>
            
            {restaurante.aberto !== undefined && (
                 restaurante.aberto ? (
                    <span className="badge bg-success-subtle border border-success-subtle text-success-emphasis rounded-pill px-2 py-1 float-end">Aberto</span>
                  ) : (
                    <span className="badge bg-danger-subtle border border-danger-subtle text-danger-emphasis rounded-pill px-2 py-1 float-end">Fechado</span>
                  )
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}