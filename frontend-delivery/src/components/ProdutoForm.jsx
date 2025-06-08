import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import produtoService from '../services/produtoService';
import uploadService from '../services/uploadService';

export default function ProdutoForm() {
  const { produtoId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const restauranteId = location.state?.restauranteId;

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '0.00',
    categoria: '',
    ativo: true,
    imagem: '',
    RestauranteId: restauranteId || '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (produtoId) {
      setLoading(true);
      produtoService.buscarPorId(produtoId)
        .then(res => {
          const produto = res.data;
          setFormData({
            nome: produto.nome,
            descricao: produto.descricao || '',
            preco: parseFloat(produto.preco).toFixed(2),
            categoria: produto.categoria,
            ativo: produto.ativo,
            imagem: produto.imagem || '',
            RestauranteId: produto.RestauranteId,
          });
        })
        .catch(err => {
          console.error("Erro ao buscar produto", err);
          setError('Produto não encontrado.');
        })
        .finally(() => setLoading(false));
    }
  }, [produtoId]);

  if (!formData.RestauranteId && !produtoId) {
     navigate('/dashboard-empresa');
     return null;
  }
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let imageUrl = formData.imagem;
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('imagem', imageFile);
        const uploadResponse = await uploadService.uploadImagem(uploadData);
        imageUrl = uploadResponse.data.url;
      }

      const dataToSubmit = { ...formData, imagem: imageUrl };

      if (produtoId) {
        await produtoService.atualizar(produtoId, dataToSubmit);
      } else {
        await produtoService.criar(dataToSubmit);
      }
      navigate('/dashboard-empresa');
    } catch (err) {
      console.error("Erro ao salvar produto:", err);
      setError(err.response?.data?.erro || 'Ocorreu um erro ao salvar o produto.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && produtoId) {
      return <div className="text-center"><div className="spinner-border"></div></div>
  }

  return (
    <div className="card shadow-sm">
        <div className="card-header">
            <h4 className="mb-0">{produtoId ? 'Editar Produto' : 'Adicionar Novo Produto'}</h4>
        </div>
        <div className="card-body">
            <form onSubmit={handleSubmit}>
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="mb-3">
                <label htmlFor="nome" className="form-label">Nome do Produto</label>
                <input type="text" id="nome" name="nome" className="form-control" value={formData.nome} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label htmlFor="descricao" className="form-label">Descrição</label>
                <textarea id="descricao" name="descricao" className="form-control" value={formData.descricao} onChange={handleChange}></textarea>
              </div>
              <div className="row">
                  <div className="col-md-6 mb-3">
                      <label htmlFor="preco" className="form-label">Preço (R$)</label>
                      <input type="number" step="0.01" min="0" id="preco" name="preco" className="form-control" value={formData.preco} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6 mb-3">
                      <label htmlFor="categoria" className="form-label">Categoria</label>
                      <input type="text" id="categoria" name="categoria" className="form-control" value={formData.categoria} onChange={handleChange} required placeholder="Ex: Pizza Salgada, Bebida..."/>
                  </div>
              </div>
              <div className="mb-3">
                <label htmlFor="imagem" className="form-label">Imagem do Produto</label>
                <input type="file" id="imagem" name="imagem" className="form-control" onChange={handleImageChange} accept="image/*" />
                {formData.imagem && !imageFile && <small className="d-block mt-1">Imagem atual: <a href={formData.imagem} target="_blank" rel="noopener noreferrer">{formData.imagem}</a></small>}
              </div>
              <div className="mb-3 form-check form-switch">
                <input type="checkbox" id="ativo" name="ativo" className="form-check-input" checked={formData.ativo} onChange={handleChange} />
                <label htmlFor="ativo" className="form-check-label">Produto Ativo</label>
              </div>
              <div className="d-flex justify-content-end">
                <button type="button" className="btn btn-secondary me-2" onClick={() => navigate('/dashboard-empresa')}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-success" disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar Produto'}
                </button>
              </div>
            </form>
        </div>
    </div>
  );
}