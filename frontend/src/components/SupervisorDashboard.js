import React, { useState, useEffect } from 'react';
import './SupervisorDashboard.css';
import { getToken } from '../auth';

const SupervisorDashboard = ({ user }) => {
  const [requests, setRequests] = useState([]);
  
  useEffect(() => {
    const fetchRequests = () => {
      fetch('http://localhost:5000/api/pauses/pending') // Esta rota agora busca PENDING e QUEUED
        .then(res => res.json())
        .then(data => setRequests(data))
        .catch(error => console.error("Erro ao buscar solicitações:", error));
    };
    fetchRequests();
    const intervalId = setInterval(fetchRequests, 3000);
    return () => clearInterval(intervalId);
  }, []);

  const handleRequestAction = async (requestId, action) => {
    try {
      const response = await fetch(`http://localhost:5000/api/pauses/${action}/${requestId}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}` // Importante para rotas protegidas no futuro
        },
        body: JSON.stringify({ userId: user.id })
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || `Falha ao ${action} a solicitação.`);
      }
      // Força a remoção visual imediata, o polling fará o resto
      setRequests(currentRequests => 
        currentRequests.filter(req => req.request_id !== requestId)
      );
    } catch (error) {
      console.error(`Erro ao processar a ação ${action}:`, error);
      alert(error.message);
    }
  };

  // Separa a lista de requisições em duas: pendentes e em fila
  const pendingRequests = requests.filter(r => r.status === 'PENDING');
  const queuedRequests = requests.filter(r => r.status === 'QUEUED');

  return (
    <div className="supervisor-dashboard">
      <h3>Solicitações Pendentes ({pendingRequests.length})</h3>
      {pendingRequests.length > 0 ? (
        <ul className="request-list">
          {pendingRequests.map(req => (
            <li key={req.request_id} className="request-item">
              <span className="user-name">{req.user_full_name}</span>
              <div className="request-actions">
                <button className="approve-btn" onClick={() => handleRequestAction(req.request_id, 'approve')}>Aprovar</button>
                <button className="reject-btn" onClick={() => handleRequestAction(req.request_id, 'reject')}>Rejeitar</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-requests">Nenhuma solicitação pendente.</p>
      )}

      <hr className="divider" />
      
      <h3>Fila de Espera ({queuedRequests.length})</h3>
      {queuedRequests.length > 0 ? (
        <ul className="request-list queued-list">
          {queuedRequests.map((req, index) => (
            <li key={req.request_id} className="request-item">
              <span className="queue-position">{index + 1}º</span>
              <span className="user-name">{req.user_full_name}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-requests">A fila de espera está vazia.</p>
      )}
    </div>
  );
};
export default SupervisorDashboard;