import React, { useState, useEffect } from 'react';
import './SupervisorMonitor.css';

// Componente Timer COMPLETO
const Timer = ({ startTime, durationMinutes }) => {
  const calculateTimeLeft = () => {
    if (!startTime) return durationMinutes * 60;
    const start = new Date(startTime);
    const now = new Date();
    const elapsedSeconds = Math.floor((now - start) / 1000);
    const totalDurationSeconds = durationMinutes * 60;
    return Math.max(0, totalDurationSeconds - elapsedSeconds);
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    if (!startTime) return;
    const timerId = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timerId);
  }, [startTime, durationMinutes]);

  const formatTime = (totalSeconds) => {
    if (totalSeconds <= 0) return "00:00";
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return <span className="timer-monitor">{formatTime(timeLeft)}</span>;
};


const SupervisorMonitor = ({ activePauses }) => {
  return (
    <div className="supervisor-monitor">
      <h2>Monitor de Pausas</h2>
      <table className="monitor-table">
        <thead>
          <tr>
            <th>Operador</th>
            <th>Status</th>
            <th>Tipo de Pausa</th>
            <th>Tempo Restante</th>
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
                  <Timer startTime={pause.start_time} durationMinutes={pause.duration_minutes} />
                ) : (
                  'Aguardando Início'
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