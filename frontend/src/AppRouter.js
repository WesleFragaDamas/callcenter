import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getUserFromToken, removeToken } from './auth';

// Importando os componentes de "página"
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';
import SetupPage from './components/SetupPage';

// --- CORREÇÃO APLICADA AQUI: Imports dos componentes de admin ---
import PauseTypesAdmin from './components/PauseTypesAdmin';
import UsersAdmin from './components/UsersAdmin';

const AppRouter = () => {
  const [needsSetup, setNeedsSetup] = useState(null);
  const [user, setUser] = useState(getUserFromToken());

  // Efeito que verifica o status do setup na primeira carga
  useEffect(() => {
    const checkSetup = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/setup/status');
        const data = await response.json();
        setNeedsSetup(!data.isInitialized);
      } catch (error) {
        console.error("Não foi possível conectar ao backend para verificar o setup.", error);
        setNeedsSetup(true); 
      }
    };
    checkSetup();
  }, []);

  const handleLoginSuccess = () => {
    setUser(getUserFromToken());
  };

  const handleLogout = () => {
    removeToken();
    setUser(null);
  };
  
  const isAuthenticated = !!user;

  // Tela de carregamento
  if (needsSetup === null) {
    return <div>Carregando aplicação...</div>;
  }

  // Roteador de Setup (se necessário)
  if (needsSetup) {
    return (
      <Router>
        <Routes>
          <Route path="/setup" element={<SetupPage />} />
          <Route path="*" element={<Navigate to="/setup" />} />
        </Routes>
      </Router>
    );
  }

  // Roteador Principal (após o setup)
  return (
    <Router>
      {/* O botão de logout foi movido para dentro do Dashboard.js */}
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage onLoginSuccess={handleLoginSuccess} />} />
        
        <Route path="/" element={isAuthenticated ? <Dashboard user={user} handleLogout={handleLogout} /> : <Navigate to="/login" />} />
        
        {/* Rotas de admin, agora com os componentes importados */}
        <Route
          path="/admin/pause-types"
          element={isAuthenticated && user.role === 'ADMIN' ? <PauseTypesAdmin /> : <Navigate to="/" />}
        />
        <Route
          path="/admin/users"
          element={isAuthenticated && user.role === 'ADMIN' ? <UsersAdmin /> : <Navigate to="/" />}
        />

        <Route path="*" element={<Navigate to="/" />} /> 
      </Routes>
    </Router>
  );
};

export default AppRouter;