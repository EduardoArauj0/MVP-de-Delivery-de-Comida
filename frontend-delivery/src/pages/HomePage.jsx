import React, { useEffect, useState, useCallback } from 'react';
import HeaderPublico from '../components/HeaderPublico';
import FiltroLojas from '../components/FiltroLojas';
import RestauranteCard from '../components/RestauranteCard';
import restauranteService from '../services/restauranteService';

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

  // Função para buscar restaurantes da API
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
      setRestaurantes(response.data || []);
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
    <>
      <HeaderPublico busca={activeFilters.search} setBusca={handleSearchChange} />
      <main className="container py-4">
        {/* Banner Promocional */}
        <div className="mb-4">
          <img src="https://source.unsplash.com/1200x200/?food-banner,delivery" className="img-fluid rounded" alt="Promoção" />
        </div>

        <FiltroLojas
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
          currentSort={currentSort}
          onSortChange={handleSortChange}
        />

        <h3 className="mb-3">Restaurantes Disponíveis</h3>
        {loading && <div className="text-center py-5"><div className="spinner-border text-danger" role="status"><span className="visually-hidden">Carregando...</span></div></div>}
        {error && <div className="alert alert-danger">{error}</div>}
        
        {!loading && !error && (
          restaurantes.length > 0 ? (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
              {restaurantes.map(rest => (
                <div className="col" key={rest.id}>
                  <RestauranteCard restaurante={rest} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted py-5">Nenhum restaurante encontrado com os critérios selecionados.</p>
          )
        )}
      </main>
      <footer className="text-center py-4 mt-5 border-top">
        <p className="mb-0">&copy; {new Date().getFullYear()} DeliveryApp. Todos os direitos reservados.</p>
      </footer>
    </>
  );
}