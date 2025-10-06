import React, { useState, useEffect } from 'react';
import './SupervisorDashboard.css';

/**
 * SupervisorDashboard Component
 * Este componente é o painel de AÇÕES do supervisor na sidebar.
 * Ele recebe a lista de requisições ('requests') e a função de ação ('onAction')
 * do seu componente pai, o Dashboard.js. Ele é um componente "burro".
 */
const SupervisorDashboard = ({ user, requests, onAction }) => {

  // Função para o clique do botão "Aprovar"
  const handleApprove = (requestId) => {
    onAction(`approve/${requestId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id }),
    });
  };

  // Função para o clique do botão "Rejeitar"
  const handleReject = (requestId) => {
    onAction(`reject/${requestId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id }),
    });
  };

  // Separa a lista de requisições (recebida via props) em duas para exibição
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