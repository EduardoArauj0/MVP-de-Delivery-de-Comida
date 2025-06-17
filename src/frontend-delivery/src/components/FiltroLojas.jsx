import React, { useState, useEffect } from 'react';
import cozinhaService from '../services/cozinhaService';
import './style/FiltroLojas.css';

export default function FiltroLojas({
  activeFilters,
  onFilterChange,
  currentSort, 
  onSortChange
}) {
  const [tiposCozinha, setTiposCozinha] = useState([]);
  const [loadingCozinhas, setLoadingCozinhas] = useState(false);

  useEffect(() => {
    const fetchCozinhas = async () => {
      setLoadingCozinhas(true);
      try {
        const response = await cozinhaService.listar();
        setTiposCozinha(response.data || []);
      } catch (error) {
        console.error("Erro ao buscar tipos de cozinha:", error);
        setTiposCozinha([]); 
      } finally {
        setLoadingCozinhas(false);
      }
    };
    fetchCozinhas();
  }, []);

  const handleToggleFilter = (filterName) => {
    onFilterChange({ ...activeFilters, [filterName]: !activeFilters[filterName] });
  };

  const handleCozinhaChange = (event) => {
    onFilterChange({ ...activeFilters, cozinhaId: event.target.value });
  };

  const handleSortCriteriaChange = (event) => {
    onSortChange({ ...currentSort, orderBy: event.target.value });
  };

  const handleSortDirectionChange = (event) => {
    onSortChange({ ...currentSort, orderDirection: event.target.value });
  };

  const limparFiltros = () => {
    onFilterChange({ cozinhaId: '', aberto: false, entregaGratis: false, search: activeFilters.search || '' });
    onSortChange({ orderBy: 'nome', orderDirection: 'ASC' });
  };

  return (
    <div className="d-flex flex-wrap align-items-center gap-3">
      
      {/* Filtro de Cozinha */}
      <div className="flex-grow-1" style={{minWidth: '200px'}}>
        <select
          id="filtroCozinha"
          className="form-select form-select-sm filter-select"
          value={activeFilters.cozinhaId || ''}
          onChange={handleCozinhaChange}
          disabled={loadingCozinhas}
        >
          <option value="">Todas as cozinhas</option>
          {tiposCozinha.map((cozinha) => (
            <option key={cozinha.id} value={cozinha.id}>
              {cozinha.nome}
            </option>
          ))}
        </select>
      </div>

      {/* Botões de Filtro */}
      <div className="d-flex align-items-center gap-2">
        <button 
          type="button"
          onClick={() => handleToggleFilter('aberto')}
          className={`btn filter-pill ${activeFilters.aberto ? 'btn-danger' : 'btn-outline-secondary'}`}
        >
          Abertos
        </button>
        <button
          type="button"
          onClick={() => handleToggleFilter('entregaGratis')}
          className={`btn filter-pill ${activeFilters.entregaGratis ? 'btn-danger' : 'btn-outline-secondary'}`}
        >
          Entrega Grátis
        </button>
      </div>

      <div className="vr d-none d-lg-block mx-2"></div>

      {/* Ordenação */}
      <div className="d-flex align-items-center gap-2">
        <span className="small text-muted me-1">Ordenar por:</span>
        <select
            id="ordenacao"
            className="form-select form-select-sm filter-select" 
            value={currentSort.orderBy}
            onChange={handleSortCriteriaChange}
        >
            <option value="nome">Nome</option>
            <option value="taxaFrete">Taxa de Entrega</option>
            <option value="avaliacao">Avaliação</option>
        </select>
        <select
            className="form-select form-select-sm filter-select" 
            value={currentSort.orderDirection}
            onChange={handleSortDirectionChange}
            aria-label="Direção da ordenação"
        >
            <option value="ASC">CRESC</option>
            <option value="DESC">DESC</option>
        </select>
      </div>
      
      {/* Botão LimpaR */}
      <div className="ms-auto">
        <button 
          onClick={limparFiltros} 
          className="btn filter-pill btn-outline-secondary" /* ESTILO PADRONIZADO AQUI */
        >
          Limpar
        </button>
      </div>
    </div>
  );
}