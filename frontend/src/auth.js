import { jwtDecode } from 'jwt-decode'; // Precisaremos instalar esta biblioteca

const TOKEN_KEY = 'callcenter_token';

// Salva o token no localStorage
export const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Pega o token do localStorage
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Remove o token do localStorage (fazendo o logout)
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// Pega os dados do usuário de dentro do token
export const getUserFromToken = () => {
  const token = getToken();
  if (!token) {
    return null;
  }
  try {
    // A biblioteca jwt-decode lê o conteúdo do token sem verificar a assinatura
    const userData = jwtDecode(token);
    return userData;
  } catch (error) {
    console.error("Token inválido:", error);
    // Se o token for inválido, remove-o
    removeToken();
    return null;
  }
};