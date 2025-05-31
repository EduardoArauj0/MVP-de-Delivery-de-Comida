import { Link } from 'react-router-dom';

export default function RestauranteCard({ restaurante }) {
  return (
    <Link to={`/restaurante/${restaurante.id}`} className="text-decoration-none text-dark">
      <div className="card h-100 shadow-sm">
        <div className="card-body">
          <h5 className="card-title">{restaurante.nome}</h5>
          <p className="card-text mb-1"><strong>Tipo:</strong> Lanches</p>
          <p className="card-text mb-1 text-muted">Entrega: R$ 8,99 • 1.2 km • 35-45 min</p>
          <p className="card-text"><strong>Endereço:</strong> {restaurante.endereco}</p>
        </div>
      </div>
    </Link>
  );
}