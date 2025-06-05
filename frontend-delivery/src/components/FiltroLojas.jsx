import React, { useState, useEffect } from 'react';
import cozinhaService from '../services/cozinhaService';

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

  const handleCheckboxChange = (filterName) => {
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
    <div className="mb-4 p-3 bg-light rounded shadow-sm">
      <div className="row g-2 align-items-center">
        {/* Filtro por Tipo de Cozinha */}
        <div className="col-md-3">
          <label htmlFor="filtroCozinha" className="form-label fw-normal small mb-1">Tipo de Cozinha</label>
          <select
            id="filtroCozinha"
            className="form-select form-select-sm"
            value={activeFilters.cozinhaId || ''}
            onChange={handleCozinhaChange}
            disabled={loadingCozinhas}
          >
            <option value="">Todas</option>
            {tiposCozinha.map((cozinha) => (
              <option key={cozinha.id} value={cozinha.id}>
                {cozinha.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Filtros Booleanos */}
        <div className="col-md-4 d-flex align-items-end">
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              id="filtroAberto"
              checked={activeFilters.aberto || false}
              onChange={() => handleCheckboxChange('aberto')}
            />
            <label className="form-check-label small" htmlFor="filtroAberto">
              Abertos Agora
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              id="filtroEntregaGratis"
              checked={activeFilters.entregaGratis || false}
              onChange={() => handleCheckboxChange('entregaGratis')}
            />
            <label className="form-check-label small" htmlFor="filtroEntregaGratis">
              Entrega Grátis
            </label>
          </div>
        </div>

        {/* Ordenação */}
        <div className="col-md-3">
            <label htmlFor="ordenacao" className="form-label fw-normal small mb-1">Ordenar por</label>
            <div className="input-group input-group-sm">
                <select
                    id="ordenacao"
                    className="form-select form-select-sm"
                    value={currentSort.orderBy}
                    onChange={handleSortCriteriaChange}
                >
                    <option value="nome">Nome</option>
                    <option value="taxaFrete">Taxa de Entrega</option>
                    {<option value="avaliacao">Avaliação</option>}
                </select>
                <select
                    className="form-select form-select-sm"
                    value={currentSort.orderDirection}
                    onChange={handleSortDirectionChange}
                    aria-label="Direção da ordenação"
                >
                    <option value="ASC">ASC</option>
                    <option value="DESC">DESC</option>
                </select>
            </div>
        </div>


        <div className="col-md-2 d-flex align-items-end">
          <button className="btn btn-sm btn-outline-secondary w-100" onClick={limparFiltros}>
            Limpar
          </button>
        </div>
      </div>
    </div>
  );
}