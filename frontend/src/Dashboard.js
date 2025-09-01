import React, { useState, useEffect } from 'react';
import './Dashboard.css';

import PauseControl from './components/PauseControl';
import SupervisorDashboard from './components/SupervisorDashboard';
import SupervisorMonitor from './components/SupervisorMonitor';
import TeamStatus from './components/TeamStatus';

const Dashboard = ({ user }) => {
  const [isLeftSidebarVisible, setIsLeftSidebarVisible] = useState(true);
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(true);
  
  // ESTADO ELEVADO: Os dados do monitor agora vivem aqui, no componente pai.
  const [activePauses, setActivePauses] = useState([]);

  // useEffect para buscar os dados do monitor (lógica movida do SupervisorMonitor para cá)
  useEffect(() => {
    // Só executa a busca se o usuário for um supervisor
    if (user?.role !== 'SUPERVISOR') {
      return;
    }

    const fetchActivePauses = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/pauses/monitor');
        const data = await response.json();
        setActivePauses(data);
      } catch (error) {
        console.error("Erro ao buscar dados do monitor:", error);
      }
    };

    fetchActivePauses();
    const intervalId = setInterval(fetchActivePauses, 5000); // Polling a cada 5s
    // Função de limpeza
    return () => clearInterval(intervalId);
  }, [user]); // Roda sempre que o 'user' for definido/alterado

  return (
    <div 
      className={`
        dashboard-container 
        ${!isLeftSidebarVisible ? 'left-sidebar-hidden' : ''}
        ${!isRightSidebarVisible ? 'right-sidebar-hidden' : ''}
      `}
    >
      <aside className={`sidebar-left ${!isLeftSidebarVisible ? 'hidden' : ''}`}>
        <h3>Ferramentas</h3>
        <ul>
          <li>Ferramenta 1</li>
          <li>Ferramenta 2</li>
          <li>Escalas</li>
          <li>Ponto</li>
        </ul>
      </aside>

      <main className="main-content">
        <div className="main-content-header">
          <button onClick={() => setIsLeftSidebarVisible(!isLeftSidebarVisible)}>
            {isLeftSidebarVisible ? '<' : '>'}
          </button>
          
          <h1>Bem-vindo, {user ? user.fullName : 'Usuário'}!</h1>

          <button onClick={() => setIsRightSidebarVisible(!isRightSidebarVisible)}>
            {isRightSidebarVisible ? '>' : '<'}
          </button>
        </div>
        
        {user && user.role === 'SUPERVISOR' && (
          <>
            {/* Passamos os dados buscados para os dois componentes filhos */}
            <SupervisorMonitor activePauses={activePauses} />
            <TeamStatus user={user} activePauses={activePauses} /> 
          </>
        )}
        
        {user && user.role === 'OPERATOR' && (
          <p>Esta é a área principal onde o conteúdo das ferramentas será exibido.</p>
        )}
        
      </main>

      <aside className={`sidebar-right ${!isRightSidebarVisible ? 'hidden' : ''}`}>
        
        {user && user.role === 'SUPERVISOR' && <SupervisorDashboard user={user} />}
        {user && user.role === 'OPERATOR' && <PauseControl user={user} />}

        <hr />
        <h3>Chat</h3>
        <p>Nenhuma mensagem nova.</p>
      </aside>
    </div>
  );
};

export default Dashboard;