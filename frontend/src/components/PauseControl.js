import React, { useState, useEffect } from 'react';
import './PauseControl.css';

const PauseControl = ({ user }) => {
  const STATUS = {
    WORKING: 'Em atendimento',
    PENDING: 'Aguardando aprovação...',
    APPROVED: 'Pausa Aprovada!',
    ON_BREAK: 'Em pausa!',
  };

  const [currentStatus, setCurrentStatus] = useState(STATUS.WORKING);
  const [pauseTypes, setPauseTypes] = useState([]);
  const [selectedPauseType, setSelectedPauseType] = useState('');
  const [pendingRequestId, setPendingRequestId] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  // --- EFEITO PRINCIPAL PARA SINCRONIZAÇÃO E POLLING ---
  useEffect(() => {
    // Busca os tipos de pausa (só na primeira vez)
    const fetchPauseTypes = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/pauses/types');
        const data = await response.json();
        setPauseTypes(data);
        if (data.length > 0) {
          setSelectedPauseType(data[0].id);
        }
      } catch (error) {
        console.error('Falha ao buscar os tipos de pausa:', error);
      }
    };

    // Sincroniza o estado atual do operador com o backend
    const syncState = async () => {
      if (!user?.id) return;
      try {
        const response = await fetch(`http://localhost:5000/api/pauses/active-request/${user.id}`);
        const activeRequest = await response.json();

        if (activeRequest) {
          setPendingRequestId(activeRequest.id);
          if (activeRequest.status === 'PENDING') {
            setCurrentStatus(STATUS.PENDING);
          } else if (activeRequest.status === 'APPROVED') {
            setCurrentStatus(STATUS.APPROVED);
          } else if (activeRequest.status === 'IN_PROGRESS') {
            const startTime = new Date(activeRequest.start_time);
            const now = new Date();
            const elapsedSeconds = Math.floor((now - startTime) / 1000);
            const initialDurationSeconds = activeRequest.duration_minutes * 60;
            const remainingTime = Math.max(0, initialDurationSeconds - elapsedSeconds);
            setTimeLeft(remainingTime);
            setCurrentStatus(STATUS.ON_BREAK);
          }
        } else {
          setCurrentStatus(STATUS.WORKING);
          setPendingRequestId(null);
        }
      } catch (error) {
        console.error('Erro ao sincronizar estado da pausa:', error);
      }
    };
    
    fetchPauseTypes();
    syncState();

    const intervalId = setInterval(syncState, 5000); // Polling a cada 5s

    return () => clearInterval(intervalId);
  }, [user]);

  // --- EFEITO PARA O CRONÔMETRO ---
  useEffect(() => {
    if (currentStatus !== STATUS.ON_BREAK) {
      return;
    }
    
    // Se o tempo acabar, finaliza a pausa
    if (timeLeft <= 0) {
      handleEndPause();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [currentStatus, timeLeft]);

  const handleRequestPause = async () => {
  if (!selectedPauseType) {
    alert('Por favor, selecione um tipo de pausa.');
    return;
  }
  setCurrentStatus(STATUS.PENDING);
  try {
    const response = await fetch('http://localhost:5000/api/pauses/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, pauseTypeId: selectedPauseType }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }
    setPendingRequestId(data.request.id);
  } catch (error) {
    alert(`Erro ao solicitar pausa: ${error.message}`);
    setCurrentStatus(STATUS.WORKING);
  }
  };

  useEffect(() => {
    // Se não estivermos em pausa, não faz nada
    if (currentStatus !== STATUS.ON_BREAK || timeLeft <= 0) {
      return;
    }
    const timerId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    // Se o tempo acabar, chama a função para finalizar a pausa
    if (timeLeft === 0) {
      clearInterval(timerId);
      handleEndPause();
    }

    // Função de limpeza: para o cronômetro se o status mudar ou o componente desmontar
    return () => clearInterval(timerId);
  }, [currentStatus, timeLeft]); // Roda sempre que o status ou o tempo mudar

  const handleCancelRequest = async () => {
    if (!pendingRequestId) return;
    try {
      const response = await fetch(`http://localhost:5000/api/pauses/cancel/${pendingRequestId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      setCurrentStatus(STATUS.WORKING);
      setPendingRequestId(null);
    } catch (error) {
      alert(`Erro ao cancelar: ${error.message}`);
    }
  };

   // NOVA FUNÇÃO para iniciar a pausa
  const handleStartPause = async () => {
    if (!pendingRequestId) return;
    try {
      const response = await fetch(`http://localhost:5000/api/pauses/start/${pendingRequestId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      console.log('Pausa iniciada:', data);
      // Define o tempo inicial do cronômetro (em segundos)
      setTimeLeft(data.duration_minutes * 60);
      setCurrentStatus(STATUS.ON_BREAK);
    } catch (error) {
      alert(`Erro ao iniciar pausa: ${error.message}`);
    }
  };
  
  // NOVA FUNÇÃO para finalizar a pausa
  const handleEndPause = async () => {
    if (!pendingRequestId) return;
    try {
      const response = await fetch(`http://localhost:5000/api/pauses/end/${pendingRequestId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      
      console.log('Pausa finalizada:', data);
      // Reseta todos os estados para o inicial
      setCurrentStatus(STATUS.WORKING);
      setPendingRequestId(null);
      setTimeLeft(0);
    } catch (error) {
      alert(`Erro ao finalizar pausa: ${error.message}`);
    }
  };

  // Função para formatar os segundos em MM:SS
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const renderContent = () => {
    switch (currentStatus) {
      case STATUS.PENDING:
        return (
          <>
            <p>Status: {STATUS.PENDING}</p>
            <button onClick={handleCancelRequest} className="cancel-button">Cancelar Solicitação</button>
          </>
        );
      case STATUS.APPROVED:
        return (
          <>
            <p className="status-approved">{STATUS.APPROVED}</p>
            {/* O botão agora chama a nova função handleStartPause */}
            <button onClick={handleStartPause} className="start-button">Iniciar Pausa</button>
          </>
        );
      case STATUS.ON_BREAK:
        return (
          <>
            <p>Status: {STATUS.ON_BREAK}</p>
            {/* Exibe o tempo formatado */}
            <p className="timer">{formatTime(timeLeft)}</p>
            {/* O botão agora chama a nova função handleEndPause */}
            <button onClick={handleEndPause} className="end-button">Finalizar Pausa</button>
          </>
        );
      case STATUS.WORKING:
      default:
        return (
          <>
            <p>Status: {STATUS.WORKING}</p>
            <select
              value={selectedPauseType}
              onChange={(e) => setSelectedPauseType(e.target.value)}
              className="pause-select"
            >
              <option value="" disabled>Selecione um tipo...</option>
              {pauseTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name} ({type.duration_minutes} min)
                </option>
              ))}
            </select>
            <button onClick={handleRequestPause} className="request-button">
              Solicitar Pausa
            </button>
          </>
        );
    }
  };

  return (
    <div className="pause-control-container">
      <h3>Pausas</h3>
      {renderContent()}
    </div>
  );
};

export default PauseControl;