import React, { useState } from 'react';

const SetupPage = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/api/setup/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Falha ao inicializar o sistema.');
      }

      setSuccess('Administrador criado com sucesso! Você será redirecionado para a página de login em 5 segundos...');
      // Redireciona para a página de login após 5 segundos
      setTimeout(() => {
        window.location.href = '/login';
      }, 5000);

    } catch (err) {
      setError(err.message);
    }
  };

  // Se já deu sucesso, não mostra o formulário
  if (success) {
    return (
      <div className="setup-container">
        <h2>Sistema Inicializado!</h2>
        <p className="success-message">{success}</p>
      </div>
    );
  }

  return (
    <div className="setup-container">
      <h2>Configuração Inicial do Sistema</h2>
      <p>Bem-vindo! Parece que esta é a primeira vez que o sistema está sendo executado. Por favor, crie a conta do administrador principal.</p>
      
      <form onSubmit={handleSubmit} className="setup-form">
        <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Seu Nome Completo" required />
        <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Nome de Usuário (admin)" required />
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Senha Forte" required />
        <button type="submit">Criar Administrador e Iniciar Sistema</button>
      </form>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

// Precisamos de um CSS simples para esta página. Você pode criar um arquivo SetupPage.css ou adicionar no App.css
// Adicione o seguinte no seu App.css:
/*
.setup-container { max-width: 500px; margin: 100px auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px; text-align: center; }
.setup-form { display: flex; flex-direction: column; gap: 15px; margin-top: 20px; }
.setup-form input, .setup-form button { padding: 10px; font-size: 1em; }
.error-message { color: red; margin-top: 15px; }
.success-message { color: green; margin-top: 15px; }
*/

export default SetupPage;