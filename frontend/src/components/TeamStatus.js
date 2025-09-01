import React, { useState, useEffect } from 'react';
import './TeamStatus.css';

const ForcePauseModal = ({ operator, pauseTypes, onClose, onConfirm }) => {
  const [selectedPauseType, setSelectedPauseType] = useState(pauseTypes[0]?.id || '');
  useEffect(() => {
    if (pauseTypes.length > 0 && !selectedPauseType) {
      setSelectedPauseType(pauseTypes[0].id);
    }
  }, [pauseTypes, selectedPauseType]);
  const handleConfirm = () => {
    if (!selectedPauseType) {
      alert('Por favor, selecione um tipo de pausa.');
      return;
    }
    onConfirm(selectedPauseType);
  };
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h4>Forçar Pausa para {operator.full_name}</h4>
        <p>Selecione o tipo de pausa:</p>
        <select value={selectedPauseType} onChange={(e) => setSelectedPauseType(e.target.value)}>
          {pauseTypes.map(type => (
            <option key={type.id} value={type.id}>
              {type.name} ({type.duration_minutes} min)
            </option>
          ))}
        </select>
        <div className="modal-actions">
          <button onClick={onClose} className="btn-cancel">Cancelar</button>
          <button onClick={handleConfirm} className="btn-confirm">Confirmar</button>
        </div>
      </div>
    </div>
  );
};

const TeamStatus = ({ user, activePauses }) => {
  const [operators, setOperators] = useState([]);
  const [pauseTypes, setPauseTypes] = useState([]);
  const [selectedOperator, setSelectedOperator] = useState(null);
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [operatorsRes, pauseTypesRes] = await Promise.all([
          fetch('http://localhost:5000/api/users/operators'),
          fetch('http://localhost:5000/api/pauses/types')
        ]);
        const operatorsData = await operatorsRes.json();
        const pauseTypesData = await pauseTypesRes.json();
        setOperators(operatorsData);
        setPauseTypes(pauseTypesData);
      } catch (error) {
        console.error("Erro ao buscar dados da equipe:", error);
      }
    };
    fetchInitialData();
  }, []);
  const handleForcePauseClick = (operator) => {
    setSelectedOperator(operator);
  };
  const handleConfirmForcePause = async (pauseTypeId) => {
    if (!selectedOperator) return;
    try {
      const response = await fetch('http://localhost:5000/api/pauses/force', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operatorId: selectedOperator.id, pauseTypeId, supervisorId: user.id })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      alert(data.message);
      setSelectedOperator(null);
    } catch (error) {
      alert(`Erro ao forçar pausa: ${error.message}`);
    }
  };
  const getOperatorStatus = (operatorId) => {
    const pause = activePauses.find(p => p.user_id === operatorId);
    if (pause) {
      return pause.status === 'IN_PROGRESS' ? 'Em Pausa' : 'Pausa Aprovada';
    }
    return 'Em Atendimento';
  };
  return (
    <div className="team-status-container">
      <h3>Status da Equipe</h3>
      <table className="team-status-table">
        <thead>
          <tr><th>Operador</th><th>Status</th><th>Ação</th></tr>
        </thead>
        <tbody>
          {operators.map(op => {
            const status = getOperatorStatus(op.id);
            const isPausable = status === 'Em Atendimento';
            return (
              <tr key={op.id}>
                <td>{op.full_name}</td>
                <td><span className={`status-badge-team status-${status.replace(/\s+/g, '-').toLowerCase()}`}>{status}</span></td>
                <td><button onClick={() => handleForcePauseClick(op)} disabled={!isPausable} className="btn-force-pause">Forçar Pausa</button></td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {selectedOperator && <ForcePauseModal operator={selectedOperator} pauseTypes={pauseTypes} onClose={() => setSelectedOperator(null)} onConfirm={handleConfirmForcePause} />}
    </div>
  );
};

export default TeamStatus;