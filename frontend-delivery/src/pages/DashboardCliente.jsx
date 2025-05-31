import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import HeaderCliente from '../components/HeaderCliente';

export default function DashboardCliente() {
  const { token } = useAuth();
  const [restaurantes, setRestaurantes] = useState([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function fetchRestaurantes() {
      try {
        const response = await axios.get('http://localhost:3000/restaurantes', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setRestaurantes(response.data);
      } catch (err) {
        console.error(err);
        setErro('Erro ao buscar restaurantes');
      }
    }
    fetchRestaurantes();
  }, [token]);

  return (
    <>
      <HeaderCliente />
      <div className="container py-5">
        <h2 className="mb-4">Restaurantes disponíveis</h2>
        {erro && <div className="alert alert-danger">{erro}</div>}
        <div className="row">
          {restaurantes.map(rest => (
            <div className="col-md-4 mb-4" key={rest.id}>
              <Link to={`/restaurante/${rest.id}`} className="text-decoration-none text-dark">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{rest.nome}</h5>
                    <p className="card-text"><strong>Endereço:</strong> {rest.endereco}</p>
                    <p className="card-text"><strong>Telefone:</strong> {rest.telefone}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}