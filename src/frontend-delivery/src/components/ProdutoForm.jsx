import React, { useState, useEffect } from 'react';
import produtoService from '../services/produtoService';
import uploadService from '../services/uploadService';

export default function ProdutoForm({ initialData, onSave, restauranteId }) {
  const produtoId = initialData?.id;

  const [formData, setFormData] = useState({
    nome: '', descricao: '', preco: '0.00', categoria: '', ativo: true,
    imagem: '', RestauranteId: restauranteId || '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        nome: initialData.nome, descricao: initialData.descricao || '',
        preco: parseFloat(initialData.preco).toFixed(2), categoria: initialData.categoria,
        ativo: initialData.ativo, imagem: initialData.imagem || '',
        RestauranteId: initialData.RestauranteId,
      });
    } else {
      setFormData({
        nome: '', descricao: '', preco: '0.00', categoria: '', ativo: true,
        imagem: '', RestauranteId: restauranteId,
      });
    }
  }, [initialData, restauranteId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageChange = (e) => { setImageFile(e.target.files[0]); };

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
      onSave();
    } catch (err) {
      setError(err.response?.data?.erro || 'Ocorreu um erro ao salvar o produto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-3"><label htmlFor="nome" className="form-label">Nome do Produto</label><input type="text" id="nome" name="nome" className="form-control form-control-lg" value={formData.nome} onChange={handleChange} required /></div>
      <div className="mb-3"><label htmlFor="descricao" className="form-label">Descrição</label><textarea id="descricao" name="descricao" className="form-control form-control-lg" value={formData.descricao} onChange={handleChange}></textarea></div>
      <div className="row"><div className="col-md-6 mb-3"><label htmlFor="preco" className="form-label">Preço (R$)</label><input type="number" step="0.01" min="0" id="preco" name="preco" className="form-control form-control-lg" value={formData.preco} onChange={handleChange} required /></div><div className="col-md-6 mb-3"><label htmlFor="categoria" className="form-label">Categoria</label><input type="text" id="categoria" name="categoria" className="form-control form-control-lg" value={formData.categoria} onChange={handleChange} required placeholder="Ex: Pizza Salgada, Bebida..."/></div></div>
      <div className="mb-3"><label htmlFor="imagem" className="form-label">Imagem do Produto</label><input type="file" id="imagem" name="imagem" className="form-control form-control-lg" onChange={handleImageChange} accept="image/*" />{formData.imagem && !imageFile && <small className="d-block mt-1">Imagem atual: <a href={formData.imagem} target="_blank" rel="noopener noreferrer">{formData.imagem}</a></small>}</div>
      <div className="mb-3 form-check form-switch fs-5"><input type="checkbox" id="ativo" name="ativo" className="form-check-input" checked={formData.ativo} onChange={handleChange} /><label htmlFor="ativo" className="form-check-label">Produto Ativo</label></div>
      <div className="d-flex justify-content-end mt-3 border-top pt-3"><button type="button" className="btn btn-secondary me-2" onClick={onSave}>Cancelar</button><button type="submit" className="btn btn-danger" disabled={loading}>{loading ? 'Salvando...' : 'Salvar Produto'}</button></div>
    </form>
  );
}