import { useState } from 'react';
import { Link } from 'react-router-dom';
import './style/LoginPage.css';

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); 

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    console.log(`Solicitação de reset de senha para o email: ${email}`);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true); 
    }, 1500);
  };

  const renderForm = () => (
    <>
      <h2>Esqueceu sua senha?</h2>
      <p className="subtitle">Sem problemas! Insira seu email abaixo para receber um link de redefinição.</p>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input 
            type="email" 
            id="email"
            className="form-control form-control-lg" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            disabled={isSubmitting} 
            placeholder="seuemail@exemplo.com"
          />
        </div>

        <button type="submit" className="btn btn-danger btn-lg w-100 mt-2" disabled={isSubmitting}>
          {isSubmitting ? 'Enviando...' : 'Enviar Link'}
        </button>
        
        <div className="text-center mt-4">
          <Link to="/login" className="fw-bold text-danger">Lembrei minha senha</Link>
        </div>
      </form>
    </>
  );

  const renderSuccess = () => (
    <div className="success-state-container">
      <i className="bi bi-check-circle-fill success-icon"></i>
      <h3>Verifique seu email!</h3>
      <p>
        Se uma conta com o email <strong>{email}</strong> existir,
        enviamos um link para você redefinir sua senha.
      </p>
      <Link to="/login" className="btn btn-outline-danger">Voltar para o Login</Link>
    </div>
  );

  return (
    <div className="login-container">
      <section className="login-form-section">
        <div className="login-form-wrapper">
          <div className="logo">DeliveryApp</div>
          
          {/* Renderiza o formulário ou a tela de sucesso com base no estado */}
          {isSubmitted ? renderSuccess() : renderForm()}
        
        </div>
      </section>
    </div>
  );
}