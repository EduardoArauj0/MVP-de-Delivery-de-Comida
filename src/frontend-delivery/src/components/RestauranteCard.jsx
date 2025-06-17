import { Link } from 'react-router-dom';
import './style/RestauranteCard.css';

export default function RestauranteCard({ restaurante }) {
    console.log('URL da API lida pelo Vite:', import.meta.env.VITE_API_URL);
  if (!restaurante) {
    return null;
  }

  const backendUrl = import.meta.env.VITE_API_URL;

  let imagemUrl;

  if (restaurante.imagemUrl) {
    if (restaurante.imagemUrl.startsWith('/')) {
      imagemUrl = `${backendUrl}${restaurante.imagemUrl}`;
    } else {
      imagemUrl = restaurante.imagemUrl;
    }
  } else {
    const tipoCozinhaNome = restaurante.Cozinha?.nome || 'restaurant';
    imagemUrl = `https://source.unsplash.com/150x150/?restaurant-logo,${tipoCozinhaNome.toLowerCase()}&random=${restaurante.id}`;
  }

  const tipoCozinhaNome = restaurante.Cozinha?.nome || restaurante.tipoCozinha?.nome || 'Cozinha';
  const taxaFreteFormatada = restaurante.taxaFrete !== undefined && restaurante.taxaFrete !== null
    ? parseFloat(restaurante.taxaFrete) === 0 ? 'Grátis' : `R$ ${parseFloat(restaurante.taxaFrete).toFixed(2)}`
    : 'Consultar';

  return (
    <Link to={`/restaurante/${restaurante.id}`} className="restaurant-card-link">
      <div className="restaurant-card-horizontal">
        
        {/* Logo à Esquerda */}
        <img
          src={imagemUrl}
          className="restaurant-logo"
          alt={`Logo do restaurante ${restaurante.nome}`}
        />
        
        {/* Bloco de Informações à Direita */}
        <div className="restaurant-info">
          <span className="restaurant-name">{restaurante.nome}</span>
          
          <div className="restaurant-details">
            <span className="rating">
              ★ {restaurante.avaliacaoMedia > 0 ? restaurante.avaliacaoMedia.toFixed(1) : 'Sem avaliação'}
            </span>
            <span>•</span>
            <span>{tipoCozinhaNome}</span>
          </div>

          <div className="restaurant-meta">
            <span className={parseFloat(restaurante.taxaFrete) === 0 ? 'free-delivery' : 'text-muted'}>
              {taxaFreteFormatada}
            </span>
            {restaurante.aberto !== undefined && (
              <>
                <span>•</span>
                {restaurante.aberto ? (
                  <span className="text-success">Aberto</span>
                ) : (
                  <span className="text-danger">Fechado</span>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}