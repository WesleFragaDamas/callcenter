import React, { useState, useEffect } from 'react';
import './SupervisorMonitor.css';

const Timer = ({ startTime, durationMinutes, timerType }) => {
  const calculateTime = () => {
    if (!startTime) return 0;
    const start = new Date(startTime);
    const now = new Date();
    const elapsedSeconds = Math.floor((now - start) / 1000);

    if (timerType === 'PROGRESSIVE') {
      return elapsedSeconds;
    } else {
      const totalDurationSeconds = durationMinutes * 60;
      return Math.max(0, totalDurationSeconds - elapsedSeconds);
    }
  };

  const [time, setTime] = useState(calculateTime());

  useEffect(() => {
    if (!startTime) return;
    const timerId = setInterval(() => {
      setTime(prevTime => timerType === 'PROGRESSIVE' ? prevTime + 1 : prevTime - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [startTime, timerType]);

  const formatTime = (totalSeconds) => {
    if (totalSeconds < 0) return "00:00";
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    } else {
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
  };

  return <span className="timer-monitor">{formatTime(time)}</span>;
};

// CORREÇÃO APLICADA NA LINHA ABAIXO
const SupervisorMonitor = ({ activePauses, stats, onForceEndPause }) => {
  const calculatePercentage = () => {
    if (!stats || stats.totalOperators === 0) {
      return 0;
    }
    return ((stats.operatorsOnPause / stats.totalOperators) * 100).toFixed(1);
  };

  const percentage = calculatePercentage();

  return (
    <div className="supervisor-monitor">
      <h2>Monitor de Pausas</h2>
      
      <div className="stats-container">
        <div className="stat-card">
          <span className="stat-value">{stats?.operatorsOnPause || 0} / {stats?.totalOperators || 0}</span>
          <span className="stat-label">Operadores em Pausa</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{percentage}%</span>
          <span className="stat-label">Percentual em Pausa</span>
        </div>
      </div>

      <table className="monitor-table">
        <thead>
          <tr>
            <th>Operador</th>
            <th>Status</th>
            <th>Tipo de Pausa</th>
            <th>Tempo Restante</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {activePauses.map(pause => (
            <tr key={pause.request_id} className={`status-row-${pause.status.toLowerCase()}`}>
              <td>{pause.user_full_name}</td>
              <td>
                <span className={`status-badge status-${pause.status.toLowerCase()}`}>
                  {pause.status === 'IN_PROGRESS' ? 'Em Pausa' : 'Aprovada'}
                </span>
              </td>
              <td>{pause.pause_type_name}</td>
              <td>
                {pause.status === 'IN_PROGRESS' ? (
                  <Timer 
                    startTime={pause.start_time} 
                    durationMinutes={pause.duration_minutes} 
                    timerType={pause.timer_type}
                  />
                ) : (
                  'Aguardando Início'
                )}
              </td>
              <td>
                {pause.status === 'IN_PROGRESS' && (
                  <button 
                    onClick={() => onForceEndPause(pause.request_id)} 
                    className="btn-force-end"
                  >
                    Finalizar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {activePauses.length === 0 && (
        <p className="no-data-message">Nenhum operador em pausa ou com pausa aprovada.</p>
      )}
    </div>
  );
};

export default SupervisorMonitor;