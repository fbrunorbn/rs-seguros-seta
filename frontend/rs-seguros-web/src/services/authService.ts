import { api, TOKEN_KEY } from './api';

interface LoginResponse {
  token: string;
  expiraEm: string;
  email: string;
}

export async function login(email: string, senha: string) {
  const { data } = await api.post<LoginResponse>('/auth/login', { email, senha });
  localStorage.setItem(TOKEN_KEY, data.token);
  return data;
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem(TOKEN_KEY));
}
