import { useState, useEffect, useCallback } from 'react';
import HeaderEmpresa from '../components/HeaderEmpresa';
import RestauranteForm from '../components/RestauranteForm';
import ProdutoList from '../components/ProdutoList';
import restauranteService from '../services/restauranteService';
import produtoService from '../services/produtoService';
import { useAuth } from '../hooks/useAuth';

export default function DashboardEmpresa() {
  const { user } = useAuth();
  const [restaurante, setRestaurante] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);

  const fetchRestaurante = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const response = await restauranteService.listar({ empresaId: user.id });
      if (response.data && response.data.length > 0) {
        setRestaurante(response.data[0]);
        await fetchProdutos(response.data[0].id);
      } else {
        setRestaurante(null);
        setEditMode(true); 
      }
    } catch (err) {
      console.error("Erro ao buscar restaurante da empresa:", err);
      setError('Falha ao carregar dados do restaurante.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchProdutos = async (restauranteId) => {
    try {
      const response = await produtoService.listar({ RestauranteId: restauranteId, ativoOnly: false });
      setProdutos(response.data || []);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
      setError(prev => prev + ' Falha ao carregar produtos.');
    }
  };

  useEffect(() => {
    fetchRestaurante();
  }, [fetchRestaurante]);

  const handleSaveRestaurante = () => {
    fetchRestaurante();
    setEditMode(false);
  };

  if (loading) {
    return (
      <>
        <HeaderEmpresa />
        <div className="container vh-100 d-flex justify-content-center align-items-center">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <HeaderEmpresa />
      <div className="container py-5">
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="card shadow-sm mb-5">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h4 className="mb-0">
              {restaurante ? `Gerenciar Restaurante: ${restaurante.nome}` : 'Cadastrar Novo Restaurante'}
            </h4>
            {restaurante && (
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => setEditMode(!editMode)}
              >
                {editMode ? 'Cancelar Edição' : 'Editar Restaurante'}
              </button>
            )}
          </div>
          <div className="card-body">
            {editMode ? (
              <RestauranteForm
                initialData={restaurante}
                onSave={handleSaveRestaurante}
              />
            ) : (
              restaurante && (
                <div>
                  <p><strong>CNPJ:</strong> {restaurante.cnpj}</p>
                  <p><strong>Endereço:</strong> {restaurante.endereco}</p>
                  <p><strong>Telefone:</strong> {restaurante.telefone}</p>
                  <p><strong>Taxa de Entrega:</strong> R$ {parseFloat(restaurante.taxaFrete).toFixed(2)}</p>
                  <p><strong>Status:</strong> {restaurante.ativo ? 'Ativo' : 'Inativo'}</p>
                  <p><strong>Funcionamento:</strong> {restaurante.aberto ? 'Aberto' : 'Fechado'}</p>
                </div>
              )
            )}
          </div>
        </div>

        {restaurante && !editMode && (
          <div className="card shadow-sm">
            <div className="card-header">
              <h4 className="mb-0">Gerenciar Cardápio</h4>
            </div>
            <div className="card-body">
              <ProdutoList
                produtos={produtos}
                restauranteId={restaurante.id}
                onUpdate={fetchRestaurante}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}