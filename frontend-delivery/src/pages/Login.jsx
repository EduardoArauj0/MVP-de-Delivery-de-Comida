import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import userService from '../services/userService'; 

export default function Login() {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setErro(''); 
    try {
      const res = await userService.login({ email, senha });
      login(res.data);
    } catch (err) {
      console.error(err);
      setErro(err.response?.data?.erro || 'Email ou senha inválidos');
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
        <button type="submit" className="btn btn-danger w-100">Entrar</button>
        <div className="text-center mt-3">
          <span>Não tem conta? </span>
          <a href="/register" className="text-danger fw-bold">Cadastre-se</a>
        </div>
      </form>
    </div>
  );
}