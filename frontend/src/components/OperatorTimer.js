import React, { useState, useEffect } from 'react';

const OperatorTimer = ({ startTime, durationMinutes, timerType }) => {
  // A função de cálculo é a nossa "fonte da verdade"
  const calculateTime = () => {
    if (!startTime) return 0;
    const start = new Date(startTime);
    const now = new Date();
    const elapsedSeconds = Math.floor((now - start) / 1000);

    if (timerType === 'PROGRESSIVE') {
      return elapsedSeconds; // Conta para cima
    } else { // REGRESSIVE
      const totalDurationSeconds = durationMinutes * 60;
      return Math.max(0, totalDurationSeconds - elapsedSeconds);
    }
  };

  const [time, setTime] = useState(calculateTime());

  // Este useEffect roda a cada segundo para atualizar a contagem
  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(prevTime => {
        if (timerType === 'PROGRESSIVE') {
          return prevTime + 1;
        } else {
          return prevTime > 0 ? prevTime - 1 : 0;
        }
      });
    }, 1000);
    return () => clearInterval(timerId);
  }, [timerType]); // Depende apenas do timerType para configurar

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

  return <p className="timer">{formatTime(time)}</p>;
};

export default OperatorTimer;