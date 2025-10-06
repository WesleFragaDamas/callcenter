import React, { useState, useEffect } from 'react';
import { getToken } from '../auth';
import './Admin.css'; // Reutilizamos o mesmo CSS

// -- SUB-COMPONENTE MODAL PARA EDIÇÃO/CRIAÇÃO --
// Este componente é a janela pop-up que contém o formulário.
const UserModal = ({ user, roles, onSave, onCancel }) => {
  const [userData, setUserData] = useState(user);
  const isNewUser = !user.id;

  // Garante que o formulário seja atualizado se o usuário a ser editado mudar
  useEffect(() => {
    setUserData(user);
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(userData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h4>{isNewUser ? 'Criar Novo Usuário' : `Editar Usuário: ${user.full_name}`}</h4>
        <form onSubmit={handleSubmit}>
          <input type="text" name="full_name" value={userData.full_name || ''} onChange={handleChange} placeholder="Nome Completo" required />
          <input type="text" name="username" value={userData.username || ''} onChange={handleChange} placeholder="Nome de Usuário (login)" required />
          {isNewUser && (
            <input type="password" name="password" value={userData.password || ''} onChange={handleChange} placeholder="Senha" required />
          )}
          <select name="role_id" value={userData.role_id || ''} onChange={handleChange} required>
            <option value="">Selecione uma função...</option>
            {roles.map(role => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
          <div className="modal-actions">
            <button type="button" onClick={onCancel} className="btn-cancel">Cancelar</button>
            <button type="submit" className="btn-confirm">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
};


// -- COMPONENTE PRINCIPAL DA PÁGINA DE ADMINISTRAÇÃO DE USUÁRIOS --
const UsersAdmin = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados para controlar o Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Função para buscar todos os dados da API (usuários e funções)
  const fetchUsersAndRoles = async () => {
    setIsLoading(true);
    const token = getToken();
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      const [usersRes, rolesRes] = await Promise.all([
        fetch('http://localhost:5000/api/users', { headers }),
        fetch('http://localhost:5000/api/roles', { headers })
      ]);
      const usersData = await usersRes.json();
      const rolesData = await rolesRes.json();
      setUsers(Array.isArray(usersData) ? usersData : []);
      setRoles(Array.isArray(rolesData) ? rolesData : []);
    } catch (err) {
      console.error("Erro ao buscar dados de administração:", err);
      alert("Falha ao carregar dados. Verifique o console.");
    } finally {
      setIsLoading(false);
    }
  };

  // Busca os dados quando o componente carrega pela primeira vez
  useEffect(() => {
    fetchUsersAndRoles();
  }, []);

  // Abre o modal para criar um novo usuário
  const handleNewUser = () => {
    setEditingUser({ username: '', full_name: '', password: '', role_id: '' });
    setIsModalOpen(true);
  };

  // Abre o modal para editar um usuário existente
  const handleEditUser = (user) => {
    const role = roles.find(r => r.name === user.role);
    setEditingUser({ ...user, role_id: role ? role.id : '' });
    setIsModalOpen(true);
  };
  
  // Função para ativar/desativar um usuário
  const handleToggleActive = async (user) => {
    const action = user.is_active ? 'desativar' : 'reativar';
    if (window.confirm(`Tem certeza que deseja ${action} o usuário ${user.full_name}?`)) {
      const token = getToken();
      try {
        const response = await fetch(`http://localhost:5000/api/users/toggle-active/${user.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ is_active: !user.is_active })
        });
        if (!response.ok) throw new Error(`Falha ao ${action} o usuário.`);
        fetchUsersAndRoles(); // Recarrega a lista para refletir a mudança
      } catch (err) {
        alert(err.message);
      }
    }
  };

  // Função chamada pelo Modal para salvar (seja criando ou atualizando)
  const handleSaveUser = async (userData) => {
    const token = getToken();
    const isNewUser = !userData.id;
    const url = isNewUser ? 'http://localhost:5000/api/users' : `http://localhost:5000/api/users/${userData.id}`;
    const method = isNewUser ? 'POST' : 'PUT';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Falha ao salvar usuário.');
      
      setIsModalOpen(false);
      setEditingUser(null);
      fetchUsersAndRoles(); // Recarrega a lista
      alert(`Usuário ${isNewUser ? 'criado' : 'atualizado'} com sucesso!`);
    } catch (err) {
      alert(err.message);
    }
  };

  if (isLoading) return <p>Carregando...</p>;

  return (
    <div className="admin-page">
      {/* O Modal só é renderizado na tela se isModalOpen for true */}
      {isModalOpen && (
        <UserModal 
          user={editingUser} 
          roles={roles} 
          onSave={handleSaveUser} 
          onCancel={() => setIsModalOpen(false)} 
        />
      )}

      <h2>Gerenciar Usuários</h2>
      <button onClick={handleNewUser} className="btn-new">Novo Usuário</button>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Nome Completo</th>
            <th>Usuário (Login)</th>
            <th>Função</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className={!user.is_active ? 'inactive-row' : ''}>
              <td>{user.full_name}</td>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>
                <span className={`status-badge-team status-${user.is_active ? 'active' : 'inactive'}`}>
                  {user.is_active ? 'Ativo' : 'Inativo'}
                </span>
              </td>
              <td>
                <button onClick={() => handleEditUser(user)}>Editar</button>
                <button 
                  onClick={() => handleToggleActive(user)} 
                  className={user.is_active ? 'btn-delete' : 'btn-reactivate'}
                >
                  {user.is_active ? 'Desativar' : 'Reativar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersAdmin;