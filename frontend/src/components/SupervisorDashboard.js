import React, { useState, useEffect } from 'react';
import './SupervisorDashboard.css';

/**
 * SupervisorDashboard Component
 * Este componente é o painel de AÇÕES do supervisor na sidebar.
 * Ele é responsável por mostrar as solicitações PENDENTES e em FILA.
 * 
 * Props:
 * - user: O objeto do supervisor logado.
 * - onAction: A função "chefe" do Dashboard.js para executar chamadas de API.
 */
const SupervisorDashboard = ({ user, onAction }) => {
  // O estado 'requests' agora será preenchido via polling do Dashboard.js,
  // mas precisamos de um estado local para exibi-lo.
  const [requests, setRequests] = useState([]);
  
  // O useEffect busca os dados das solicitações (pendentes e em fila)
  useEffect(() => {
    const fetchRequests = () => {
      // Usamos a função onAction para fazer uma chamada GET
      // O Dashboard.js tratará a resposta e atualizará o estado
      // NOTA: Para chamadas GET, não precisamos passar o segundo argumento 'options'.
      // Precisamos de um novo endpoint para buscar dados para este componente.
      // Vamos criar `GET /api/pauses/requests`
      
      // *** LÓGICA DE POLLING FOI MOVIDA PARA O DASHBOARD.JS ***
      // Para este componente, vamos buscar os dados diretamente por simplicidade por enquanto
      // e refatorar depois para receber do Dashboard.js
      fetch('http://localhost:5000/api/pauses/pending') // Esta rota já busca PENDING e QUEUED
        .then(res => res.json())
        .then(data => setRequests(data))
        .catch(error => console.error("Erro ao buscar solicitações:", error));
    };

    fetchRequests();
    const intervalId = setInterval(fetchRequests, 3000); // Continua com seu polling local por enquanto
    
    return () => clearInterval(intervalId);
  }, []);

  // --- Funções que preparam e chamam 'onAction' ---

  const handleApprove = (requestId) => {
    onAction(`approve/${requestId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id }),
    });
  };

  const handleReject = (requestId) => {
    onAction(`reject/${requestId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id }),
    });
  };

  // Separa a lista de requisições em duas para exibição
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
                <button className="approve-btn" onClick={() => handleApprove(req.request_id)}>Aprovar</button>
                <button className="reject-btn" onClick={() => handleReject(req.request_id)}>Rejeitar</button>
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