import React, { useState, useEffect } from 'react';
import { getToken } from '../auth';
import './Admin.css';

const PauseTypesAdmin = () => {
  const [pauseTypes, setPauseTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isEditing, setIsEditing] = useState(false);
  // Define o estado inicial já com o timer_type padrão
  const [currentType, setCurrentType] = useState({ id: null, name: '', duration_minutes: '', timer_type: 'REGRESSIVE' });

  // Função para buscar os dados da API
  const fetchData = async () => {
    // Resetando o estado para garantir que a tela fique limpa antes de carregar
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/pauses/types', {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const data = await response.json();
      setPauseTypes(data);
    } catch (err) {
      setError('Falha ao carregar os dados.');
    } finally {
      setIsLoading(false);
    }
  };

  // Busca os dados quando o componente é montado na tela
  useEffect(() => {
    fetchData();
  }, []);

  // Função para lidar com a mudança nos campos do formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newTypeData = { ...currentType, [name]: value };

    // Lógica condicional: Se o tipo de contador mudar para PROGRESSIVE,
    // a duração é automaticamente definida como 0.
    if (name === 'timer_type' && value === 'PROGRESSIVE') {
      newTypeData.duration_minutes = 0;
    }
    
    setCurrentType(newTypeData);
  };

  // Prepara o formulário para criar um novo tipo de pausa
  const handleNew = () => {
    setCurrentType({ id: null, name: '', duration_minutes: '10', timer_type: 'REGRESSIVE' });
    setIsEditing(true);
  };

  // Prepara o formulário para editar um tipo de pausa existente
  const handleEdit = (type) => {
    setCurrentType(type);
    setIsEditing(true);
  };
  
  // Função para deletar um tipo de pausa
  const handleDelete = async (typeId) => {
    if (window.confirm('Tem certeza que deseja excluir este tipo de pausa?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/pauses/types/${typeId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Falha ao excluir.');
        }
        fetchData(); // Recarrega a lista de dados
      } catch (err) {
        alert(err.message);
      }
    }
  };

  // Função para enviar os dados do formulário (criar ou atualizar)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação para garantir que pausas regressivas tenham duração
    if (currentType.timer_type === 'REGRESSIVE' && (!currentType.duration_minutes || parseInt(currentType.duration_minutes, 10) <= 0)) {
      alert('Para pausas de contagem regressiva, a duração deve ser um número maior que zero.');
      return;
    }

    const url = currentType.id
      ? `http://localhost:5000/api/pauses/types/${currentType.id}`
      : 'http://localhost:5000/api/pauses/types';
    const method = currentType.id ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          name: currentType.name,
          duration_minutes: parseInt(currentType.duration_minutes, 10),
          timer_type: currentType.timer_type
        })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao salvar.');
      }
      
      setIsEditing(false);
      fetchData(); // Recarrega a lista de dados
    } catch (err) {
      alert(err.message);
    }
  };

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="admin-page">
      <h2>Gerenciar Tipos de Pausa</h2>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="admin-form">
          <input
            type="text"
            name="name"
            value={currentType.name}
            onChange={handleInputChange}
            placeholder="Nome da Pausa (ex: Pausa Banheiro)"
            required
          />
          <select 
            name="timer_type" 
            value={currentType.timer_type} 
            onChange={handleInputChange}
          >
            <option value="REGRESSIVE">Contagem Regressiva</option>
            <option value="PROGRESSIVE">Contagem Progressiva</option>
          </select>
          <input
            type="number"
            name="duration_minutes"
            value={currentType.duration_minutes}
            onChange={handleInputChange}
            placeholder="Duração (em minutos)"
            required
            disabled={currentType.timer_type === 'PROGRESSIVE'}
            min="0"
          />
          <div className="form-actions">
            <button type="submit">Salvar</button>
            <button type="button" onClick={() => setIsEditing(false)}>Cancelar</button>
          </div>
        </form>
      ) : (
        <button onClick={handleNew} className="btn-new">Novo Tipo de Pausa</button>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Duração (min)</th>
            <th>Tipo de Contador</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {pauseTypes.map(type => (
            <tr key={type.id}>
              <td>{type.name}</td>
              <td>{type.duration_minutes > 0 ? type.duration_minutes : 'N/A'}</td>
              <td>{type.timer_type === 'PROGRESSIVE' ? 'Progressivo' : 'Regressivo'}</td>
              <td>
                <button onClick={() => handleEdit(type)}>Editar</button>
                <button onClick={() => handleDelete(type.id)} className="btn-delete">Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PauseTypesAdmin;