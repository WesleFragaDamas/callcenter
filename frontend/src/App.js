import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importando os componentes das nossas "páginas"
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';

// Importando o CSS global
import './App.css';

function App() {
  // Estado para saber se o usuário está autenticado. Inicia como falso.
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Estado para guardar as informações do usuário que fez login. Inicia como nulo.
  const [user, setUser] = useState(null);

  /**
   * Esta função é passada como uma "prop" para o componente LoginPage.
   * Quando o login é bem-sucedido lá, a LoginPage chama esta função
   * para atualizar o estado aqui no componente principal (App).
   */
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <Routes>
        {/* ROTA PARA A PÁGINA DE LOGIN */}
        <Route 
          path="/login" 
          element={
            // Se o usuário JÁ estiver autenticado, não mostre a tela de login.
            // Em vez disso, redirecione-o para a página principal ("/").
            isAuthenticated 
              ? <Navigate to="/" /> 
              // Se não estiver autenticado, mostre a LoginPage.
              : <LoginPage onLoginSuccess={handleLoginSuccess} />
          } 
        />
        
        {/* ROTA PARA A PÁGINA PRINCIPAL / DASHBOARD */}
        <Route 
          path="/" 
          element={
            // Se o usuário estiver autenticado, mostre o Dashboard.
            isAuthenticated 
              ? <Dashboard user={user} />
              // Se não estiver autenticado, proteja esta rota e
              // redirecione o usuário para a página de login.
              : <Navigate to="/login" />
          } 
        />

        {/* ROTA "CATCH-ALL" (Pega-Tudo) */}
        {/* Se o usuário digitar qualquer URL que não seja / ou /login,
            ele será redirecionado para a página principal. */}
        <Route path="*" element={<Navigate to="/" />} /> 
      </Routes>
    </Router>
  );
}

export default App;