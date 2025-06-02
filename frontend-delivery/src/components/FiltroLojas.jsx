export default function FiltroLojas({ filtros, setFiltros }) {
  const toggleFiltro = (campo) => {
    setFiltros(prev => ({ ...prev, [campo]: !prev[campo] }));
  };

  const limpar = () => {
    setFiltros({ entregaGratis: false, pagamento: false });
  };

  return (
    <div className="d-flex flex-wrap gap-2 mb-4">
      <button className="btn btn-outline-secondary">Ordenar</button>
      <button
        className={`btn btn-${filtros.entregaGratis ? 'danger' : 'outline-secondary'}`}
        onClick={() => toggleFiltro('entregaGratis')}
      >
        Entrega Grátis
      </button>
      <button
        className={`btn btn-${filtros.pagamento ? 'danger' : 'outline-secondary'}`}
        onClick={() => toggleFiltro('pagamento')}
      >
        Formas de Pagamento
      </button>
      <button className="btn btn-outline-secondary">Distância</button>
      <button className="btn btn-outline-secondary">Filtros</button>
      <button className="btn btn-outline-dark ms-auto" onClick={limpar}>Limpar</button>
    </div>
  );
}