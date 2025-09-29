import React, { useState, useEffect } from 'react';
import './OperatorPauseView.css';

const OperatorPauseView = ({ activePause, onEndPause }) => {
  const calculateTime = () => {
    if (!activePause?.start_time) return 0;
    const start = new Date(activePause.start_time);
    const now = new Date();
    const elapsedSeconds = Math.floor((now - start) / 1000);

    if (activePause.timer_type === 'PROGRESSIVE') {
      return elapsedSeconds;
    } else {
      const totalDurationSeconds = activePause.duration_minutes * 60;
      return Math.max(0, totalDurationSeconds - elapsedSeconds);
    }
  };

  const [time, setTime] = useState(calculateTime());

  useEffect(() => {
    setTime(calculateTime());
    const timerId = setInterval(() => {
      setTime(prevTime => {
        if (activePause.timer_type === 'PROGRESSIVE') {
          return prevTime + 1;
        } else {
          return prevTime > 0 ? prevTime - 1 : 0;
        }
      });
    }, 1000);
    return () => clearInterval(timerId);
  }, [activePause]);

  useEffect(() => {
    if (activePause?.timer_type === 'REGRESSIVE' && time <= 0) {
      const endTimer = setTimeout(() => onEndPause(), 500);
      return () => clearTimeout(endTimer);
    }
  }, [time, activePause, onEndPause]);

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

  if (!activePause) {
    return null;
  }

  return (
    <div className="operator-pause-view">
      <div className="pause-view-card">
        <h2>Em Pausa</h2>
        <p className="pause-view-type">{activePause.pause_type_name}</p>
        <p className="pause-view-timer">{formatTime(time)}</p>
        <button onClick={onEndPause} className="end-button-large">Finalizar Pausa</button>
      </div>
    </div>
  );
};
export default OperatorPauseView;