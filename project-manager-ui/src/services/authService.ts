import api from './apiService';

interface RegisterDto {
  username: string;
  password: string;
}

interface LoginDto {
  username: string;
  password: string;
}

interface AuthResponse {
  username: string;
  token: string;
}

export const TOKEN_KEY = 'authToken';

export const login = async (credentials: LoginDto): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', credentials);
  if (response.data.token) {
    localStorage.setItem(TOKEN_KEY, response.data.token);
  }
  return response.data;
};

export const register = async (credentials: RegisterDto) => {
  return await api.post('/auth/register', credentials);
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem(TOKEN_KEY);
  return !!token; 
};
