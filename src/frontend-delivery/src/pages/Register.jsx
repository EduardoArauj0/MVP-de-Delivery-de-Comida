import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import userService from '../services/userService';
import './style/LoginPage.css';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: '', email: '', senha: '' });
  const [erro, setErro] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userType, setUserType] = useState('cliente');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setIsSubmitting(true);
    const userData = { ...form, tipo: userType };
    try {
      await userService.register(userData);
      navigate('/login?status=registered');
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao registrar. Verifique os dados.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      {/* Coluna da Esquerda (Imagem) */}
      <div className="login-image-section"></div>

      {/* Coluna da Direita (Formulário) */}
      <section className="login-form-section">
        <div className="login-form-wrapper">
          <div className="logo">DeliveryApp</div>
          <h2>Crie sua conta</h2>
          
          <div className="user-type-selector">
            <button 
              className={`btn ${userType === 'cliente' ? 'btn-danger' : 'btn-light'}`}
              onClick={() => setUserType('cliente')}>
              Sou Cliente
            </button>
            <button 
              className={`btn ${userType === 'empresa' ? 'btn-danger' : 'btn-light'}`}
              onClick={() => setUserType('empresa')}>
              Sou Empresa
            </button>
          </div>
          
          <p className="subtitle">
            {userType === 'cliente' 
              ? 'Peça sua comida favorita em minutos.' 
              : 'Cadastre seu restaurante e comece a vender.'}
          </p>

          <form onSubmit={handleSubmit}>
            {erro && <div className="alert alert-danger">{erro}</div>}
            
            <div className="mb-3">
              <label className="form-label" htmlFor="nome">
                {userType === 'cliente' ? 'Seu Nome Completo' : 'Nome do Responsável'}
              </label>
              <input 
                type="text" name="nome" id="nome"
                className="form-control form-control-lg" 
                value={form.nome} onChange={handleChange} 
                required disabled={isSubmitting}
                placeholder={userType === 'cliente' ? 'Seu nome completo' : 'Nome do responsável pela loja'}
              />
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="email">Email</label>
              <input 
                type="email" name="email" id="email"
                className="form-control form-control-lg" 
                value={form.email} onChange={handleChange} 
                required disabled={isSubmitting}
                placeholder="seuemail@exemplo.com"
              />
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="senha">Senha</label>
              <input 
                type="password" name="senha" id="senha"
                className="form-control form-control-lg" 
                value={form.senha} onChange={handleChange} 
                required disabled={isSubmitting}
                placeholder="Crie uma senha forte"
              />
            </div>

            <button type="submit" className="btn btn-danger btn-lg w-100 mt-3" disabled={isSubmitting}>
              {isSubmitting ? 'Cadastrando...' : 'Criar Conta'}
            </button>
            
            <div className="text-center mt-4">
              <span className="text-muted">Já tem uma conta? </span>
              <Link to="/login" className="fw-bold text-danger">Faça login</Link>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}