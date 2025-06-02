import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/login', { email, senha });
      login(res.data.token, res.data.user);

      // redirecionar para o dashboard correto
      const tipo = res.data.user.tipo;
      if (tipo === 'cliente') {
        navigate('/dashboard-cliente');
      } else if (tipo === 'empresa') {
        navigate('/pedidos-recebidos');
      } else {
        navigate('/admin');
      }
    } catch (err) {
      console.error(err)
      setErro('Email ou senha inválidos');
    }
  }

  return (
    <div className="container py-5" style={{ maxWidth: 500 }}>
      <h2 className="mb-4">Login</h2>
      {erro && <div className="alert alert-danger">{erro}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Senha</label>
          <input
            type="password"
            className="form-control"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-danger w-100">Entrar</button>
      </form>
    </div>
  );
}