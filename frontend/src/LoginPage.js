import React, { useState } from 'react';

// Criamos um componente funcional chamado LoginPage
const LoginPage = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Modifique esta função
  const handleSubmit = async (event) => { // adicione 'async'
    event.preventDefault(); 
    
    console.log('Enviando para o backend:', { username, password });

    try {
      // Usamos o 'fetch' para fazer a requisição para o nosso backend
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST', // Estamos enviando dados, então usamos POST
        headers: {
          'Content-Type': 'application/json', // Avisamos que estamos enviando JSON
        },
        body: JSON.stringify({ username, password }), // Convertemos nosso objeto JS para uma string JSON
      });

      const data = await response.json();

        if (response.ok) { // Verifica se a resposta foi um sucesso (status 200-299)
          console.log('Resposta do backend:', data);
          // Chama a função do App.js, passando os dados do usuário
          onLoginSuccess(data.user); 
        } else {
          // Se a resposta não foi OK (ex: 401 Credenciais inválidas), mostra o erro
          alert(data.message);
        }

      // Mostramos a resposta do servidor no console do navegador
      console.log('Resposta do backend:', data);
      alert(data.message); // Mostra um alerta com a mensagem do backend

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
            onChange={(e) => setUsername(e.target.value)} // Atualiza o estado a cada letra digitada
          />
        </div>
        <div>
          <label>Senha: </label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Atualiza o estado a cada letra digitada
          />
        </div>
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default LoginPage;