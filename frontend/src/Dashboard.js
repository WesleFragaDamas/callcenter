import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { getToken } from './auth';

import PauseControl from './components/PauseControl';
import SupervisorDashboard from './components/SupervisorDashboard';
import SupervisorMonitor from './components/SupervisorMonitor';
import TeamStatus from './components/TeamStatus';
import OperatorPauseView from './components/OperatorPauseView';

const Dashboard = ({ user, handleLogout }) => {
  // CORREÇÃO 1: Estados para controlar a visibilidade das sidebars
  const [isLeftSidebarVisible, setIsLeftSidebarVisible] = useState(true);
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(true);
  const [pendingRequests, setPendingRequests] = useState([]);
  
  const [monitorData, setMonitorData] = useState({ activePauses: [], stats: { totalOperators: 0, operatorsOnPause: 0 } });
  const [operatorActivePause, setOperatorActivePause] = useState(null);
  
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    const fetchData = () => {
      const token = getToken();
      if (!token || !user) return;
      const headers = { 'Authorization': `Bearer ${token}` };

      if (user.role === 'SUPERVISOR' || user.role === 'ADMIN') {
        fetch('http://localhost:5000/api/pauses/monitor', { headers })
          .then(res => res.json())
          .then(data => setMonitorData(data));
        
        fetch('http://localhost:5000/api/pauses/pending', { headers })
          .then(res => res.json())
          .then(data => setPendingRequests(data));
      } else if (user.role === 'OPERATOR') {
        fetch(`http://localhost:5000/api/pauses/active-request/${user.id}`, { headers })
          .then(res => res.ok ? res.json() : Promise.reject(res))
          .then(data => setOperatorActivePause(data))
          .catch(error => console.error('Erro ao sincronizar estado da pausa:', error));
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 3000);
    return () => clearInterval(intervalId);
  }, [user, forceUpdate]);

  const handleAction = () => {
    setForceUpdate(prev => prev + 1);
  };

  const handleApiAction = (endpoint, options = {}) => {
    const token = getToken();
    options.headers = { ...options.headers, 'Authorization': `Bearer ${token}` };
    
    fetch(`http://localhost:5000/api/pauses/${endpoint}`, options)
      .then(res => {
        if (!res.ok) return res.json().then(err => Promise.reject(err));
        return res.json();
      })
      .then(data => {
        console.log(`Ação '${endpoint}' bem-sucedida`, data);
        handleAction();
      })
      .catch(error => {
        alert(error.message || 'Ocorreu um erro na ação.');
        handleAction();
      });
  };

  const isOperatorOnPause = user?.role === 'OPERATOR' && operatorActivePause?.status === 'IN_PROGRESS';

  return (
    // CORREÇÃO 2: Classes dinâmicas para o container principal
    <div 
      className={`
        dashboard-container 
        ${!isLeftSidebarVisible ? 'left-sidebar-hidden' : ''}
        ${!isRightSidebarVisible ? 'right-sidebar-hidden' : ''}
      `}
    >
      {/* CORREÇÃO 2: Classes dinâmicas para a sidebar esquerda */}
      <aside className={`sidebar-left ${!isLeftSidebarVisible ? 'hidden' : ''}`}>
        <div>
          <h3>Ferramentas</h3>
          <ul>
            <li>Ferramenta 1</li>
            {user && user.role === 'ADMIN' && (<li><a href="/admin/pause-types">Gerenciar Pausas</a></li>)}
            {user && user.role === 'ADMIN' && (<li><a href="/admin/users">Gerenciar Usuários</a></li>)}
            <li>Escalas</li>
            <li>Ponto</li>
          </ul>
        </div>
        <div className="profile-section">
          <span className="user-greeting">Olá, {user.username}</span>
          <button onClick={handleLogout} className="logout-button">Sair</button>
        </div>
      </aside>

      <main className="main-content">
        <div className="main-content-header">
          <button onClick={() => setIsLeftSidebarVisible(!isLeftSidebarVisible)}>{isLeftSidebarVisible ? '<' : '>'}</button>
          <h1>Bem-vindo, {user ? user.fullName : 'Usuário'}!</h1>
          <button onClick={() => setIsRightSidebarVisible(!isRightSidebarVisible)}>{isRightSidebarVisible ? '>' : '<'}</button>
        </div>
        
        {user?.role === 'SUPERVISOR' && (
          <>
            <SupervisorMonitor 
              activePauses={monitorData.activePauses} 
              stats={monitorData.stats} 
              onForceEndPause={(id) => handleApiAction(`force-end/${id}`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ supervisorId: user.id }) })} 
            />
            <TeamStatus user={user} activePauses={monitorData.activePauses} /> 
          </>
        )}
        
        {user?.role === 'OPERATOR' && (
          isOperatorOnPause ? (
            <OperatorPauseView 
              activePause={operatorActivePause} 
              onEndPause={() => handleApiAction(`end/${operatorActivePause.id}`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ userId: user.id }) })} 
            />
          ) : (
            <p>Esta é a área principal onde o conteúdo das ferramentas será exibido.</p>
          )
        )}
      </main>

      {/* CORREÇÃO 2: Classes dinâmicas para a sidebar direita */}
      <aside className={`sidebar-right ${!isRightSidebarVisible ? 'hidden' : ''}`}>
        {user?.role === 'SUPERVISOR' && <SupervisorDashboard user={user} requests={pendingRequests} onAction={handleApiAction} />}
        {user?.role === 'OPERATOR' && <PauseControl user={user} activePause={operatorActivePause} onAction={handleApiAction} />}
        <hr />
        <h3>Chat</h3>
        <p>Nenhuma mensagem nova.</p>
      </aside>
    </div>
  );
};
export default Dashboard;