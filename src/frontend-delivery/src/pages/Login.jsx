import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import userService from '../services/userService';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import './style/LoginPage.css';

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
      if (user.permissoes?.includes('MANAGE_SYSTEM')) {
        navigate('/dashboard-admin', { replace: true });
      } else if (user.permissoes?.includes('MANAGE_RESTAURANT')) {
        navigate('/dashboard-empresa', { replace: true });
      } else {
        const redirectPath = new URLSearchParams(location.search).get('redirect') || '/';
        navigate(redirectPath, { replace: true });
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
      setErro(err.response?.data?.erro || 'Email ou senha inválidos');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="login-container">
      {/* Coluna da Esquerda (Imagem) */}
      <div className="login-image-section"></div>

      {/* Coluna da Direita (Formulário) */}
      <section className="login-form-section">
        <div className="login-form-wrapper">
          <div className="logo">DeliveryApp</div>
          <h2>Bem-vindo de volta!</h2>
          <p className="subtitle">Faça login para continuar</p>

          <form onSubmit={handleSubmit}>
            {erro && <div className="alert alert-danger">{erro}</div>}
            
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input 
                type="email" id="email" className="form-control form-control-lg" 
                value={email} onChange={(e) => setEmail(e.target.value)} 
                required disabled={isSubmitting} placeholder="seuemail@exemplo.com"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="senha" className="form-label">Senha</label>
              <input 
                type="password" id="senha" className="form-control form-control-lg" 
                value={senha} onChange={(e) => setSenha(e.target.value)} 
                required disabled={isSubmitting} placeholder="Sua senha"
              />
            </div>
            
            <div className="login-options">
              <div className="form-check">
                <input type="checkbox" className="form-check-input" id="rememberMe" />
                <label className="form-check-label" htmlFor="rememberMe">Lembrar-me</label>
              </div>
              <Link to="/esqueci-senha" className="text-danger">Esqueci a senha</Link>
            </div>

            <button type="submit" className="btn btn-danger btn-lg w-100 mt-2" disabled={isSubmitting}>
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </button>
            
            <div className="text-center mt-4">
              <span className="text-muted">Não tem conta? </span>
              <Link to="/register" className="fw-bold text-danger">Cadastre-se</Link>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}