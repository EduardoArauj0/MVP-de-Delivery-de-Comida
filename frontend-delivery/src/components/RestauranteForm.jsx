import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useAppData } from '../context/AppDataContext';
import restauranteService from '../services/restauranteService';
import uploadService from '../services/uploadService';

export default function RestauranteForm({ initialData, onSave }) {
  const { user } = useAuth();
  const { cozinhas } = useAppData();
  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    telefone: '',
    endereco: '',
    taxaFrete: '0.00',
    ativo: true,
    aberto: true,
    imagemUrl: '',
    CozinhaId: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        nome: initialData.nome || '',
        cnpj: initialData.cnpj || '',
        telefone: initialData.telefone || '',
        endereco: initialData.endereco || '',
        taxaFrete: parseFloat(initialData.taxaFrete || 0).toFixed(2),
        ativo: initialData.ativo !== undefined ? initialData.ativo : true,
        aberto: initialData.aberto !== undefined ? initialData.aberto : true,
        imagemUrl: initialData.imagemUrl || '',
        CozinhaId: initialData.CozinhaId || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
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
      let imageUrl = formData.imagemUrl;
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('imagem', imageFile);
        const uploadResponse = await uploadService.uploadImagem(uploadData);
        imageUrl = uploadResponse.data.url;
      }
      
      const dataToSubmit = { ...formData, imagemUrl: imageUrl, empresaId: user.id };

      if (initialData && initialData.id) {
        await restauranteService.atualizar(initialData.id, dataToSubmit);
      } else {
        await restauranteService.criar(dataToSubmit);
      }
      onSave();
    } catch (err) {
      console.error("Erro ao salvar restaurante:", err);
      setError(err.response?.data?.erro || 'Ocorreu um erro ao salvar. Verifique os dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="nome" className="form-label">Nome do Restaurante</label>
          <input type="text" id="nome" name="nome" className="form-control" value={formData.nome} onChange={handleChange} required />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="cnpj" className="form-label">CNPJ</label>
          <input type="text" id="cnpj" name="cnpj" className="form-control" value={formData.cnpj} onChange={handleChange} required />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="telefone" className="form-label">Telefone</label>
          <input type="tel" id="telefone" name="telefone" className="form-control" value={formData.telefone} onChange={handleChange} />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="endereco" className="form-label">Endereço Completo</label>
          <input type="text" id="endereco" name="endereco" className="form-control" value={formData.endereco} onChange={handleChange} />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="CozinhaId" className="form-label">Tipo de Cozinha</label>
          <select id="CozinhaId" name="CozinhaId" className="form-select" value={formData.CozinhaId} onChange={handleChange} required>
            <option value="">Selecione...</option>
            {cozinhas.map((cozinha) => (
              <option key={cozinha.id} value={cozinha.id}>{cozinha.nome}</option>
            ))}
          </select>
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="taxaFrete" className="form-label">Taxa de Entrega (R$)</label>
          <input type="number" step="0.01" min="0" id="taxaFrete" name="taxaFrete" className="form-control" value={formData.taxaFrete} onChange={handleChange} />
        </div>
        <div className="col-md-12 mb-3">
          <label htmlFor="imagem" className="form-label">Imagem do Restaurante</label>
          <input type="file" id="imagem" name="imagem" className="form-control" onChange={handleImageChange} accept="image/*" />
          {formData.imagemUrl && !imageFile && <small className="d-block mt-1">Imagem atual: <a href={formData.imagemUrl} target="_blank" rel="noopener noreferrer">{formData.imagemUrl}</a></small>}
        </div>
        <div className="col-md-6 mb-3">
          <div className="form-check form-switch">
            <input type="checkbox" id="ativo" name="ativo" className="form-check-input" checked={formData.ativo} onChange={handleChange} />
            <label htmlFor="ativo" className="form-check-label">Restaurante Ativo</label>
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="form-check form-switch">
            <input type="checkbox" id="aberto" name="aberto" className="form-check-input" checked={formData.aberto} onChange={handleChange} />
            <label htmlFor="aberto" className="form-check-label">Aberto para Pedidos</label>
          </div>
        </div>
      </div>
      <button type="submit" className="btn btn-success" disabled={loading}>
        {loading ? 'Salvando...' : 'Salvar Informações'}
      </button>
    </form>
  );
}