import React, { useState, useEffect } from 'react';
import userService from '../services/userService';
import restauranteService from '../services/restauranteService';
import pedidoService from '../services/pedidoService';

const StatCard = ({ title, value, icon, color }) => (
  <div className="col-xl-3 col-md-6 mb-4">
    <div className={`card border-left-${color} shadow h-100 py-2`}>
      <div className="card-body">
        <div className="row no-gutters align-items-center">
          <div className="col mr-2">
            <div className={`text-xs font-weight-bold text-${color} text-uppercase mb-1`}>{title}</div>
            <div className="h5 mb-0 font-weight-bold text-gray-800">{value}</div>
          </div>
          <div className="col-auto">
            <i className={`bi ${icon} fs-2 text-gray-300`}></i>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function DashboardStats() {
  const [stats, setStats] = useState({ users: 0, restaurants: 0, orders: 0, ordersToday: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, restaurantsRes, ordersRes] = await Promise.all([
          userService.getAllUsers(),
          restauranteService.listar(),
          pedidoService.listar()
        ]);

        const today = new Date().toISOString().slice(0, 10);
        const ordersTodayCount = ordersRes.data.filter(order => order.createdAt.startsWith(today)).length;

        setStats({
          users: usersRes.data.length,
          restaurants: restaurantsRes.data.length,
          orders: ordersRes.data.length,
          ordersToday: ordersTodayCount,
        });
      } catch (error) {
        console.error("Erro ao carregar estatísticas", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats(); 

    const intervalId = setInterval(fetchStats, 30000);

    return () => clearInterval(intervalId);
    
  }, []); 

  if (loading) {
    return <div className="text-center"><div className="spinner-border"></div></div>;
  }

  return (
    <div className="row">
      <StatCard title="Usuários Cadastrados" value={stats.users} icon="bi-people-fill" color="primary" />
      <StatCard title="Restaurantes Ativos" value={stats.restaurants} icon="bi-shop" color="success" />
      <StatCard title="Total de Pedidos" value={stats.orders} icon="bi-receipt" color="info" />
      <StatCard title="Pedidos Hoje" value={stats.ordersToday} icon="bi-calendar-check" color="warning" />
    </div>
  );
}