import { create } from 'zustand';
import { authService } from '../services/api';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,

  setUser: (user) => {
    set({ user });
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  },

  setToken: (token) => {
    set({ token });
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register(data);
      set({
        user: response.data.data.user,
        token: response.data.data.token,
        isLoading: false,
      });
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      localStorage.setItem('token', response.data.data.token);
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Registration failed',
        isLoading: false,
      });
      throw error;
    }
  },

  login: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(data);
      set({
        user: response.data.data.user,
        token: response.data.data.token,
        isLoading: false,
      });
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      localStorage.setItem('token', response.data.data.token);
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Login failed',
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    // Clear auth state and storage synchronously to instantly log out the user
    set({ user: null, token: null });
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    // Fire API logout in the background without blocking the UI redirect
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  updateProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.updateProfile(data);
      const updatedUser = { ...useAuthStore.getState().user, ...response.data.data };
      set({ user: updatedUser, isLoading: false });
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Update failed',
        isLoading: false,
      });
      throw error;
    }
  },

  verifyEmail: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.verifyEmail(data);
      set({
        user: response.data.data.user,
        token: response.data.data.token,
        isLoading: false,
      });
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      localStorage.setItem('token', response.data.data.token);
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Verification failed',
        isLoading: false,
      });
      throw error;
    }
  },

  resendVerification: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.resendVerification(data);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Resending code failed',
        isLoading: false,
      });
      throw error;
    }
  },

  googleLogin: async (googleToken) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.googleLogin(googleToken);
      set({
        user: response.data.data.user,
        token: response.data.data.token,
        isLoading: false,
      });
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      localStorage.setItem('token', response.data.data.token);
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Google login failed',
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
