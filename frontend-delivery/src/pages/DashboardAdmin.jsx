import HeaderAdmin from '../components/HeaderAdmin';
import CozinhaManager from '../components/CozinhaManager';
import ModoPagamentoManager from '../components/ModoPagamentoManager';

export default function DashboardAdmin() {
  return (
    <>
      <HeaderAdmin />
      <div className="container py-5">
        <h2 className="mb-4">Painel de Administração do Sistema</h2>
        <div className="row g-4">
          <div className="col-md-6">
            <CozinhaManager />
          </div>
          <div className="col-md-6">
            <ModoPagamentoManager />
          </div>
        </div>
      </div>
    </>
  );
}