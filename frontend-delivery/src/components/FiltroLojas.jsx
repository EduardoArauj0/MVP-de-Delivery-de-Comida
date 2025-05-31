export default function FiltroLojas() {
  return (
    <div className="d-flex flex-wrap gap-2 mb-4">
      <button className="btn btn-outline-secondary dropdown-toggle">Ordenar</button>
      <button className="btn btn-outline-secondary">Entrega Grátis</button>
      <button className="btn btn-outline-secondary">Formas de Pagamento</button>
      <button className="btn btn-outline-secondary">Distância</button>
      <button className="btn btn-outline-secondary">Filtros</button>
      <button className="btn btn-outline-dark ms-auto">Limpar</button>
    </div>
  );
}