import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../services/userService';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: '', email: '', senha: '', tipo: 'cliente' });
  const [erro, setErro] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    try {
      await userService.register(form);
      navigate('/login');
    } catch (err) {
      console.error(err);
      setErro(err.response?.data?.erro || 'Erro ao registrar. Verifique os dados e tente novamente.');
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <form onSubmit={handleSubmit} className="card p-4 shadow" style={{ maxWidth: 500, width: '100%' }}>
        <h2 className="mb-3 text-center">Cadastro</h2>
        {erro && <div className="alert alert-danger">{erro}</div>}
        <div className="mb-3">
          <label className="form-label">Nome</label>
          <input type="text" name="nome" className="form-control" value={form.nome} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Senha</label>
          <input type="password" name="senha" className="form-control" value={form.senha} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Tipo</label>
          <select name="tipo" className="form-select" value={form.tipo} onChange={handleChange}>
            <option value="cliente">Cliente</option>
            <option value="empresa">Empresa</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary w-100">Cadastrar</button>
      </form>
    </div>
  );
}