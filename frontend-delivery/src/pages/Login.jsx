import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import userService from '../services/userService';
import { useNavigate, useLocation, Link } from 'react-router-dom';

export default function Login() {
  const { login, user, loadingAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loadingAuth && user) {
      const redirectPath = new URLSearchParams(location.search).get('redirect') || '/';
      if (user.tipo === 'cliente') {
        navigate(redirectPath, { replace: true });
      } else if (user.tipo === 'empresa') {
        navigate('/dashboard-empresa', { replace: true });
      } else if (user.tipo === 'admin') {
        navigate('/dashboard-admin', { replace: true });
      }
    }
  }, [user, loadingAuth, navigate, location.search]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setIsSubmitting(true);
    try {
      const res = await userService.login({ email, senha });
      login(res.data);
    } catch (err) {
      console.error(err);
      setErro(err.response?.data?.erro || 'Email ou senha inválidos');
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <form onSubmit={handleSubmit} className="card p-4 shadow" style={{ maxWidth: 500, width: '100%' }}>
        <h2 className="mb-4 text-center">Login</h2>
        {erro && <div className="alert alert-danger">{erro}</div>}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Senha</label>
          <input
            type="password"
            className="form-control"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        <button type="submit" className="btn btn-danger w-100" disabled={isSubmitting}>
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>
        <div className="text-center mt-3">
          <span>Não tem conta? </span>
          <Link to="/register" className="text-danger fw-bold">Cadastre-se</Link>
        </div>
      </form>
    </div>
  );
}