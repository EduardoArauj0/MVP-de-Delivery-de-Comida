import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/usuarios/login', {
        email,
        senha
      });
      login(response.data);
    } catch (err) {
      console.error(err);
      setErro('Email ou senha inválidos');
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <form onSubmit={handleSubmit} className="card p-4 shadow" style={{ maxWidth: 400, width: '100%' }}>
        <h2 className="mb-3 text-center">Login</h2>
        {erro && <div className="alert alert-danger">{erro}</div>}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Senha</label>
          <input type="password" className="form-control" value={senha} onChange={e => setSenha(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-danger w-100">Entrar</button>
      </form>
    </div>
  );
}