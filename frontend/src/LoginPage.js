import React, { useState } from 'react';
import { saveToken } from './auth'; // Importa a nova função para salvar o token

const LoginPage = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault(); 
    
    console.log('Enviando para o backend:', { username, password });

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Resposta do backend:', data);

        // AÇÃO PRINCIPAL: Salva o token recebido no localStorage do navegador
        saveToken(data.token);
        
        // Avisa o componente App.js que o login foi um sucesso, passando os dados do usuário
        onLoginSuccess(data.user);
      } else {
        alert(data.message);
      }

    } catch (error) {
      console.error('Erro ao tentar fazer login:', error);
      alert('Falha na comunicação com o servidor.');
    }
  };

  return (
    <div>
      <h2>Login do Call Center</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Usuário: </label>
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Senha: </label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default LoginPage;