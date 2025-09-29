import React, { useState, useEffect } from 'react';
import './TeamStatus.css';
import { getToken } from '../auth'; // Importa a função para pegar o token do localStorage

/**
 * TeamStatus Component
 * Este componente exibe uma tabela com todos os operadores da equipe e seu status atual.
 * Ele permite que o supervisor force uma pausa para um operador.
 * 
 * Props:
 * - user: O objeto do supervisor logado (para usar seu ID).
 * - activePauses: A lista de pausas ativas (vindo do Dashboard.js) para determinar o status.
 */
const TeamStatus = ({ user, activePauses }) => {
  // Estado para armazenar a lista de operadores vinda da API
  const [operators, setOperators] = useState([]);
  // Estado para armazenar os tipos de pausa (usado no modal de forçar pausa)
  const [pauseTypes, setPauseTypes] = useState([]);
  // Estado para controlar qual operador foi selecionado para o modal
  const [selectedOperator, setSelectedOperator] = useState(null);

  // Efeito que busca os dados iniciais (operadores e tipos de pausa)
  useEffect(() => {
    const fetchInitialData = async () => {
      const token = getToken(); // Pega o token de autenticação
      if (!token) {
        console.error("Token não encontrado, não é possível buscar dados da equipe.");
        return; // Para a execução se não houver token
      }

      try {
        // Define o cabeçalho de autorização que será usado nas chamadas
        const headers = { 'Authorization': `Bearer ${token}` };

        // Faz as duas chamadas à API em paralelo para mais eficiência
        const [operatorsRes, pauseTypesRes] = await Promise.all([
          fetch('http://localhost:5000/api/users/operators', { headers }), // Envia o token
          fetch('http://localhost:5000/api/pauses/types', { headers })      // Envia o token
        ]);

        // Verifica se as respostas da API foram bem-sucedidas
        if (!operatorsRes.ok) throw new Error('Falha ao buscar operadores.');
        if (!pauseTypesRes.ok) throw new Error('Falha ao buscar tipos de pausa.');

        const operatorsData = await operatorsRes.json();
        const pauseTypesData = await pauseTypesRes.json();
        
        // Atualiza os estados com os dados recebidos
        setOperators(Array.isArray(operatorsData) ? operatorsData : []);
        setPauseTypes(Array.isArray(pauseTypesData) ? pauseTypesData : []);
      } catch (error) {
        console.error("Erro ao buscar dados da equipe:", error);
      }
    };
    fetchInitialData();
  }, []); // O array vazio [] garante que a busca só aconteça uma vez
  
  // Função para abrir o modal
  const handleForcePauseClick = (operator) => {
    setSelectedOperator(operator);
  };

  // Função para confirmar a ação no modal e chamar a API
  const handleConfirmForcePause = async (pauseTypeId) => {
    if (!selectedOperator) return;
    try {
      const token = getToken();
      const response = await fetch('http://localhost:5000/api/pauses/force', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          operatorId: selectedOperator.id, 
          pauseTypeId, 
          supervisorId: user.id 
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      
      alert(data.message); // Exibe "Pausa forçada com sucesso!"
      setSelectedOperator(null); // Fecha o modal
      // O Dashboard.js vai pegar a mudança no próximo polling e atualizar tudo
    } catch (error) {
      alert(`Erro ao forçar pausa: ${error.message}`);
    }
  };

  // Função para determinar o texto do status de um operador
  const getOperatorStatus = (operatorId) => {
    const pause = activePauses.find(p => p.user_id === operatorId);
    if (pause) {
      if (pause.status === 'IN_PROGRESS') return 'Em Pausa';
      if (pause.status === 'APPROVED') return 'Pausa Aprovada';
    }
    return 'Em Atendimento';
  };
  
  return (
    <div className="team-status-container">
      <h3>Status da Equipe</h3>
      <table className="team-status-table">
        <thead>
          <tr>
            <th>Operador</th>
            <th>Status</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {operators.map(op => {
            const status = getOperatorStatus(op.id);
            const isPausable = status === 'Em Atendimento';
            return (
              <tr key={op.id}>
                <td>{op.full_name}</td>
                <td>
                  <span className={`status-badge-team status-${status.replace(/\s+/g, '-').toLowerCase()}`}>{status}</span>
                </td>
                <td>
                  <button 
                    onClick={() => handleForcePauseClick(op)} 
                    disabled={!isPausable}
                    className="btn-force-pause"
                  >
                    Forçar Pausa
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {selectedOperator && (
        <ForcePauseModal 
          operator={selectedOperator}
          pauseTypes={pauseTypes}
          onClose={() => setSelectedOperator(null)}
          onConfirm={handleConfirmForcePause}
        />
      )}
    </div>
  );
};
// O componente Modal não precisa ser exportado, ele é usado apenas aqui dentro
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
              {type.name} ({type.duration_minutes > 0 ? `${type.duration_minutes} min` : 'Progressivo'})
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

export default TeamStatus;