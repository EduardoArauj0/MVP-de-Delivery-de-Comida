import React, { useState, useEffect } from 'react';
import enderecoService from '../services/enderecoService';

export default function EnderecoForm({ initialData, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', cep: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', cep: '' });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (initialData) {
      await enderecoService.atualizar(initialData.id, formData);
    } else {
      await enderecoService.criar(formData);
    }
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="card card-body mb-4 bg-light">
      <div className="row">
        <div className="col-md-8 mb-3">
          <label className="form-label">Logradouro</label>
          <input type="text" name="logradouro" value={formData.logradouro} onChange={handleChange} className="form-control" required />
        </div>
        <div className="col-md-4 mb-3">
          <label className="form-label">Número</label>
          <input type="text" name="numero" value={formData.numero} onChange={handleChange} className="form-control" required />
        </div>
         <div className="col-md-6 mb-3">
          <label className="form-label">Complemento</label>
          <input type="text" name="complemento" value={formData.complemento} onChange={handleChange} className="form-control" />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">CEP</label>
          <input type="text" name="cep" value={formData.cep} onChange={handleChange} className="form-control" required />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Bairro</label>
          <input type="text" name="bairro" value={formData.bairro} onChange={handleChange} className="form-control" required />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Cidade</label>
          <input type="text" name="cidade" value={formData.cidade} onChange={handleChange} className="form-control" required />
        </div>
      </div>
      <div className="d-flex justify-content-end">
        <button type="button" className="btn btn-secondary me-2" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn btn-success">Salvar Endereço</button>
      </div>
    </form>
  );
}