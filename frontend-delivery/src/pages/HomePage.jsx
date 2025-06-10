import React, { useEffect, useState, useCallback } from 'react';
import HeaderPublico from '../components/HeaderPublico';
import FiltroLojas from '../components/FiltroLojas';
import RestauranteCard from '../components/RestauranteCard';
import restauranteService from '../services/restauranteService';
import avaliacaoService from '../services/avaliacaoService';

export default function HomePage() {
  const [restaurantes, setRestaurantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [activeFilters, setActiveFilters] = useState({
    search: '', 
    cozinhaId: '',
    aberto: false, 
    entregaGratis: false,
  });

  const [currentSort, setCurrentSort] = useState({
    orderBy: 'nome',
    orderDirection: 'ASC',
  });

  const fetchRestaurantes = useCallback(async () => {
    setLoading(true);
    setError('');
    
    const params = {
      search: activeFilters.search || undefined,
      cozinhaId: activeFilters.cozinhaId || undefined,
      aberto: activeFilters.aberto ? true : undefined, 
      entregaGratis: activeFilters.entregaGratis ? true : undefined,
      ativoOnly: true,
      orderBy: currentSort.orderBy,
      orderDirection: currentSort.orderDirection,
    };

    Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

    try {
      const response = await restauranteService.listar(params);
      let restaurantesData = response.data || [];

      if (restaurantesData.length > 0) {
        const promessasDeAvaliacao = restaurantesData.map(rest => 
          avaliacaoService.listarPorRestaurante(rest.id)
            .then(res => ({ restauranteId: rest.id, media: res.data.mediaNotas }))
            .catch(() => ({ restauranteId: rest.id, media: 0 }))
        );
        
        const resultadosAvaliacao = await Promise.all(promessasDeAvaliacao);
        
        const mapaDeMedias = resultadosAvaliacao.reduce((acc, curr) => {
          acc[curr.restauranteId] = curr.media;
          return acc;
        }, {});

        restaurantesData = restaurantesData.map(rest => ({
          ...rest,
          avaliacaoMedia: mapaDeMedias[rest.id] || 0
        }));
      }
      
      setRestaurantes(restaurantesData);

    } catch (err) {
      console.error("Erro ao buscar restaurantes:", err);
      setError('Não foi possível carregar os restaurantes. Tente novamente mais tarde.');
      setRestaurantes([]);
    } finally {
      setLoading(false);
    }
  }, [activeFilters, currentSort]);

  useEffect(() => {
    fetchRestaurantes();
  }, [fetchRestaurantes]); 

  const handleSearchChange = (newSearchTerm) => {
    setActiveFilters(prev => ({ ...prev, search: newSearchTerm }));
  };

  const handleFilterChange = (newFiltersFromChild) => {
    setActiveFilters(prev => ({...prev, ...newFiltersFromChild}));
  };

  const handleSortChange = (newSortFromChild) => {
    setCurrentSort(newSortFromChild);
  };

  return (
    <div className="page-container">
      <HeaderPublico busca={activeFilters.search} setBusca={handleSearchChange} />
      
      <main className="content-wrap">

        <section className="py-4 border-bottom">
          <div className="container">
            <FiltroLojas
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
              currentSort={currentSort}
              onSortChange={handleSortChange}
            />
          </div>
        </section>

        <section className="py-5">
          <div className="container">
            <h3 className="mb-4">Restaurantes Disponíveis</h3>
            {loading && <div className="text-center py-5"><div className="spinner-border text-danger" role="status"><span className="visually-hidden">Carregando...</span></div></div>}
            {error && <div className="alert alert-danger">{error}</div>}
            
            {!loading && !error && (
              restaurantes.length > 0 ? (
                <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
                  {restaurantes.map(rest => (
                    <div className="col" key={rest.id}>
                      <RestauranteCard restaurante={rest} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted py-5">
                  <p>Nenhum restaurante encontrado com os critérios selecionados.</p>
                </div>
              )
            )}
          </div>
        </section>
      </main>
      <footer className="bg-dark text-white">
        <div className="container py-4">
          <p className="mb-0 text-center">&copy; {new Date().getFullYear()} DeliveryApp. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}