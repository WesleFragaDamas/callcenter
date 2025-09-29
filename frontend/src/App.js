import React, { useState } from 'react'; // <-- CORREÇÃO APLICADA AQUI
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PauseTypesAdmin from './components/PauseTypesAdmin';

// Importando nossas novas funções de autenticação
import { getUserFromToken, removeToken } from './auth';

import LoginPage from './LoginPage';
import Dashboard from './Dashboard';
import UsersAdmin from './components/UsersAdmin';
import './App.css';

function App() {
  const [user, setUser] = useState(getUserFromToken());

  const isAuthenticated = !!user;

  const handleLoginSuccess = () => {
    setUser(getUserFromToken());
  };

  const handleLogout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated 
              ? <Navigate to="/" /> 
              : <LoginPage onLoginSuccess={handleLoginSuccess} />
          } 
        />
        <Route 
          path="/" 
          element={
            isAuthenticated 
              ? <Dashboard user={user} handleLogout={handleLogout} />
              : <Navigate to="/login" />
          } 
        />
        <Route
          path="/admin/pause-types"
          element={
            // Proteção: Só renderiza se estiver autenticado E a role for 'ADMIN'
            isAuthenticated && user.role === 'ADMIN'
              ? <PauseTypesAdmin />
              : <Navigate to="/" /> // Se não, redireciona para a página principal
          }
        />
        {/* NOVA ROTA DE ADMIN */}
        <Route
          path="/admin/users"
          element={isAuthenticated && user.role === 'ADMIN' ? <UsersAdmin /> : <Navigate to="/" />}
        />
        <Route path="*" element={<Navigate to="/" />} /> 
      </Routes>
    </Router>
  );
}

export default App;