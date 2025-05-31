import HeaderPublico from '../components/HeaderPublico';
import FiltroLojas from '../components/FiltroLojas';
import RestauranteCard from '../components/RestauranteCard';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function HomePage() {
  const [restaurantes, setRestaurantes] = useState([]);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get('http://localhost:3000/restaurantes');
      setRestaurantes(res.data);
    }
    fetchData();
  }, []);

  const filtrados = restaurantes.filter(r =>
    r.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <>
      <HeaderPublico busca={busca} setBusca={setBusca} />
      <div className="container py-3">
        <FiltroLojas />
        <h4 className="mb-3">Lojas</h4>
        <div className="row">
          {filtrados.map(rest => (
            <div className="col-md-4 mb-4" key={rest.id}>
              <RestauranteCard restaurante={rest} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}