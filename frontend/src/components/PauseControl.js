import React, { useState, useEffect } from 'react';
import './PauseControl.css';

/**
 * PauseControl Component
 * Este componente é o painel de AÇÕES do operador na sidebar.
 * Ele é "burro": recebe o estado atual da pausa (`activePause`) do Dashboard
 * e apenas exibe os botões corretos. Quando um botão é clicado, ele não
 * executa a lógica da API diretamente, mas sim chama a função `onAction`
 * que recebeu do Dashboard, passando os parâmetros necessários.
 */
const PauseControl = ({ user, activePause, onAction }) => {
  // Objeto de constantes para os textos de status
  const STATUS = {
    WORKING: 'Em atendimento',
    PENDING: 'Aguardando aprovação...',
    APPROVED: 'Pausa Aprovada!',
    ON_BREAK: 'Em pausa!',
    QUEUED: 'Em Fila de Espera',
  };
  
  // Estado local apenas para os dados do formulário
  const [pauseTypes, setPauseTypes] = useState([]);
  const [selectedPauseType, setSelectedPauseType] = useState('');

  // Busca os tipos de pausa da API quando o componente carrega
  useEffect(() => {
    fetch('http://localhost:5000/api/pauses/types') // Esta rota é pública, não precisa de token
      .then(res => res.json())
      .then(data => {
        setPauseTypes(data);
        // Pré-seleciona o primeiro tipo de pausa da lista
        if (data.length > 0) {
          setSelectedPauseType(data[0].id);
        }
      })
      .catch(error => console.error('Falha ao buscar os tipos de pausa:', error));
  }, []); // O array vazio [] garante que isso rode apenas uma vez

  // --- Funções que preparam os dados e chamam 'onAction' ---

  const handleRequestPause = () => {
    if (!selectedPauseType) return alert('Selecione um tipo de pausa.');
    // Chama a função 'onAction' do Dashboard, passando o endpoint e as opções do fetch
    onAction('request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, pauseTypeId: selectedPauseType }),
    });
  };

  const handleCancelRequest = () => {
    if (!activePause?.id) return;
    onAction(`cancel/${activePause.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id }),
    });
  };

  const handleStartPause = () => {
    if (!activePause?.id) return;
    onAction(`start/${activePause.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id }),
    });
  };
  
  // Determina o texto do status a ser exibido com base na prop 'activePause'
  const currentStatus = activePause ? {
    'PENDING': STATUS.PENDING,
    'APPROVED': STATUS.APPROVED,
    'IN_PROGRESS': STATUS.ON_BREAK,
    'QUEUED': STATUS.QUEUED,
  }[activePause.status] || STATUS.WORKING : STATUS.WORKING;

  // Função que decide qual conjunto de botões/textos renderizar
  const renderContent = () => {
    switch (currentStatus) {
      case STATUS.PENDING:
        return <button onClick={handleCancelRequest} className="cancel-button">Cancelar Solicitação</button>;
      case STATUS.QUEUED:
        return <p className="status-queued">Você está na fila de espera.</p>;
      case STATUS.APPROVED:
        return <button onClick={handleStartPause} className="start-button">Iniciar Pausa</button>;
      case STATUS.ON_BREAK:
        // Quando está em pausa, o timer está na tela principal, então aqui só mostramos um texto.
        return <p className="on-break-text">Pausa em andamento...</p>;
      default: // WORKING
        return (
          <>
            <select value={selectedPauseType} onChange={(e) => setSelectedPauseType(e.target.value)} className="pause-select">
              {pauseTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name} ({type.duration_minutes > 0 ? `${type.duration_minutes} min` : 'Progressivo'})
                </option>
              ))}
            </select>
            <button onClick={handleRequestPause} className="request-button">Solicitar Pausa</button>
          </>
        );
    }
  };

  return (
    <div className="pause-control-container">
      <h3>Pausas</h3>
      <p>Status: {currentStatus}</p>
      {renderContent()}
    </div>
  );
};
export default PauseControl;