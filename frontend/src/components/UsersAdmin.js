import React, { useState, useEffect } from 'react';
import { getToken } from '../auth';
import './Admin.css';

const UsersAdmin = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [newUser, setNewUser] = useState({
    username: '',
    full_name: '',
    password: '',
    role_id: ''
  });

  // Função para buscar os dados iniciais
  useEffect(() => {
    const fetchInitialData = async () => {
      const token = getToken();
      console.log("Tentando buscar dados com o token:", token); // LOG 1: Verifica o token

      if (!token) {
        setIsLoading(false);
        alert("Token não encontrado. Por favor, faça login novamente.");
        return;
      }
      
      try {
        const headers = { 'Authorization': `Bearer ${token}` };

        const [usersRes, rolesRes] = await Promise.all([
          fetch('http://localhost:5000/api/users', { headers }),
          fetch('http://localhost:5000/api/roles', { headers })
        ]);

        // Verificação de erro para a busca de usuários
        if (!usersRes.ok) {
          const errorData = await usersRes.json();
          throw new Error(`Erro ao buscar usuários: ${errorData.message}`);
        }
        
        // Verificação de erro para a busca de roles
        if (!rolesRes.ok) {
          const errorData = await rolesRes.json();
          throw new Error(`Erro ao buscar funções: ${errorData.message}`);
        }

        const usersData = await usersRes.json();
        const rolesData = await rolesRes.json();

        console.log("Dados recebidos:", { usersData, rolesData }); // LOG 2: Verifica os dados

        setUsers(Array.isArray(usersData) ? usersData : []);
        setRoles(Array.isArray(rolesData) ? rolesData : []);

      } catch (err) {
        console.error("Erro detalhado em fetchInitialData:", err); // LOG 3: Mostra o erro exato
        alert(err.message); // Mostra o erro para o usuário
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newUser)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Falha ao criar usuário.');
      }
      
      setNewUser({ username: '', full_name: '', password: '', role_id: '' });
      // Re-busca apenas os usuários, pois as roles não mudaram
      fetch('http://localhost:5000/api/users', { headers: { 'Authorization': `Bearer ${token}` }})
        .then(res => res.json())
        .then(data => setUsers(data));
      
      alert('Usuário criado com sucesso!');
    } catch (err) {
      alert(err.message);
    }
  };

  if (isLoading) return <p>Carregando...</p>;

  return (
    <div className="admin-page">
      <h2>Gerenciar Usuários</h2>

      <form onSubmit={handleSubmit} className="admin-form">
        <h3>Criar Novo Usuário</h3>
        <input type="text" name="full_name" value={newUser.full_name} onChange={handleInputChange} placeholder="Nome Completo" required />
        <input type="text" name="username" value={newUser.username} onChange={handleInputChange} placeholder="Nome de Usuário (login)" required />
        <input type="password" name="password" value={newUser.password} onChange={handleInputChange} placeholder="Senha" required />
        <select name="role_id" value={newUser.role_id} onChange={handleInputChange} required>
          <option value="">Selecione uma função...</option>
          {roles.map(role => (
            <option key={role.id} value={role.id}>{role.name}</option>
          ))}
        </select>
        <div className="form-actions">
          <button type="submit">Criar Usuário</button>
        </div>
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Nome Completo</th>
            <th>Usuário (Login)</th>
            <th>Função</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.full_name}</td>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>
                <button>Editar</button>
                <button className="btn-delete">Desativar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersAdmin;