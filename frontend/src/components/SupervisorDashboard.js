import React, { useState, useEffect } from 'react';
import './SupervisorDashboard.css';

// Recebe o objeto 'user' do supervisor logado
const SupervisorDashboard = ({ user }) => {
  const [pendingRequests, setPendingRequests] = useState([]);
  
  const fetchPendingRequests = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/pauses/pending');
      const data = await response.json();
      setPendingRequests(data);
    } catch (error) {
      console.error("Erro ao buscar solicitações pendentes:", error);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
    const intervalId = setInterval(fetchPendingRequests, 5000);
    return () => clearInterval(intervalId);
  }, []);

  // NOVA FUNÇÃO para lidar com as ações (aprovar/rejeitar)
  const handleRequestAction = async (requestId, action) => {
    try {
      const response = await fetch(`http://localhost:5000/api/pauses/${action}/${requestId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }) // Envia o ID do supervisor
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || `Falha ao ${action} a solicitação.`);
      }

      // Se a ação foi bem-sucedida, removemos a solicitação da lista local
      // para dar um feedback visual imediato, sem esperar o próximo polling.
      setPendingRequests(currentRequests => 
        currentRequests.filter(req => req.request_id !== requestId)
      );

    } catch (error) {
      console.error(`Erro ao processar a ação ${action}:`, error);
      alert(error.message);
    }
  };

  return (
    <div className="supervisor-dashboard">
      <h3>Solicitações Pendentes ({pendingRequests.length})</h3>
      {pendingRequests.length === 0 ? (
        <p className="no-requests">Nenhuma solicitação no momento.</p>
      ) : (
        <ul className="request-list">
          {pendingRequests.map(req => (
            <li key={req.request_id} className="request-item">
              <div className="request-info">
                <span className="user-name">{req.user_full_name}</span>
                <span className="pause-type">{`${req.pause_type_name} (${req.duration_minutes} min)`}</span>
              </div>
              <div className="request-actions">
                {/* Botões agora chamam a nova função, passando o ID e a ação */}
                <button className="approve-btn" onClick={() => handleRequestAction(req.request_id, 'approve')}>
                  Aprovar
                </button>
                <button className="reject-btn" onClick={() => handleRequestAction(req.request_id, 'reject')}>
                  Rejeitar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SupervisorDashboard;