import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { getToken } from './auth'; // Precisamos do getToken para as chamadas de API

// Importando todos os componentes filhos
import PauseControl from './components/PauseControl';
import SupervisorDashboard from './components/SupervisorDashboard';
import SupervisorMonitor from './components/SupervisorMonitor';
import TeamStatus from './components/TeamStatus';
import OperatorPauseView from './components/OperatorPauseView';

/**
 * Dashboard Component
 * Este é o componente "chefe" ou "orquestrador" após o login.
 * Ele é responsável por:
 * 1. Buscar os dados relevantes para o usuário logado (operador ou supervisor).
 * 2. Manter esses dados atualizados através de polling (verificações periódicas).
 * 3. Passar os dados e as funções de ação para os componentes filhos.
 */
const Dashboard = ({ user, handleLogout }) => {
  // Estados para controlar a visibilidade das sidebars
  const [isLeftSidebarVisible, setIsLeftSidebarVisible] = useState(true);
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(true);
  const [pendingRequests, setPendingRequests] = useState([]);
  
  // Estados para armazenar os dados vindos da API
  const [monitorData, setMonitorData] = useState({ activePauses: [], stats: { totalOperators: 0, operatorsOnPause: 0 } });
  const [operatorActivePause, setOperatorActivePause] = useState(null);
  
  // Um "gatilho" para forçar a re-busca de dados imediatamente após uma ação
  const [forceUpdate, setForceUpdate] = useState(0);

  // Efeito principal: busca os dados do backend
  useEffect(() => {
    const fetchData = () => {
      const token = getToken();
      if (!token || !user) return;
      const headers = { 'Authorization': `Bearer ${token}` };

      if (user.role === 'SUPERVISOR' || user.role === 'ADMIN') {
        // Busca os dados do monitor
        fetch('http://localhost:5000/api/pauses/monitor', { headers })
          .then(res => res.json()).then(data => setMonitorData(data));
        // Busca os dados da sidebar
        fetch('http://localhost:5000/api/pauses/pending', { headers })
          .then(res => res.json()).then(data => setPendingRequests(data));
      } else if (user.role === 'OPERATOR') {
        fetch(`http://localhost:5000/api/pauses/active-request/${user.id}`, { headers })
          .then(res => res.ok ? res.json() : Promise.reject(res))
          .then(data => setOperatorActivePause(data))
          .catch(error => console.error('Erro ao sincronizar estado da pausa:', error));
      }
    };

    fetchData(); // Busca na carga inicial
    const intervalId = setInterval(fetchData, 3000); // Polling a cada 3 segundos
    
    // Função de limpeza para parar o polling quando o componente for desmontado
    return () => clearInterval(intervalId);
  }, [user, forceUpdate]); // Roda novamente se o usuário mudar ou se uma ação forçar

  /**
   * Função genérica para realizar chamadas à API de AÇÕES.
   * Ela centraliza a lógica de fetch, tratamento de erro e o gatilho de re-sincronização.
   * @param {string} endpoint - A parte final da URL da API (ex: 'request', 'end/5')
   * @param {object} options - As opções do fetch (method, headers, body)
   */
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
        setForceUpdate(prev => prev + 1); // Força a re-busca de dados
      })
      .catch(error => {
        alert(error.message || 'Ocorreu um erro na ação.');
        setForceUpdate(prev => prev + 1); // Força a re-busca mesmo em caso de erro
      });
  };

  // Variável para determinar se o operador está em pausa, para renderização condicional
  const isOperatorOnPause = user?.role === 'OPERATOR' && operatorActivePause?.status === 'IN_PROGRESS';

  return (
    <div className="dashboard-container">
      <aside className="sidebar-left">
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
        
        {/* Conteúdo Principal para SUPERVISOR */}
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
        
        {/* Conteúdo Principal para OPERADOR */}
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

      <aside className="sidebar-right">
        {user?.role === 'SUPERVISOR' && <SupervisorDashboard user={user} onAction={handleApiAction} />}
        {user?.role === 'OPERATOR' && <PauseControl user={user} activePause={operatorActivePause} onAction={handleApiAction} />}
        <hr />
        <h3>Chat</h3>
        <p>Nenhuma mensagem nova.</p>
      </aside>
    </div>
  );
};
export default Dashboard;