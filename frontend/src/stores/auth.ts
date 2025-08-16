import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { apolloClient } from '@/apollo/client';
import { gql } from '@apollo/client/core';
import type { User } from '@/types';

const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      accessToken
      user {
        id
        email
        name
        createdAt
      }
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      user {
        id
        email
        name
        createdAt
      }
    }
  }
`;

const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      name
      createdAt
    }
  }
`;

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));
  const loading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!user.value && !!token.value);

  const setAuth = (authData: { user: User; accessToken: string }) => {
    user.value = authData.user;
    token.value = authData.accessToken;
    localStorage.setItem('token', authData.accessToken);
    localStorage.setItem('currentUser', JSON.stringify(authData.user));
  };

  const clearAuth = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  };

  const register = async (email: string, password: string, name: string) => {
    loading.value = true;
    error.value = null;

    try {
      const { data } = await apolloClient.mutate({
        mutation: REGISTER_MUTATION,
        variables: {
          input: { email, password, name }
        }
      });

      if (data?.register) {
        setAuth(data.register);
        return true;
      } else {
        error.value = 'Registration failed. Please try again.';
        return false;
      }
    } catch (err: any) {
      error.value = err.message || 'Registration failed. Please try again.';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const login = async (email: string, password: string) => {
    loading.value = true;
    error.value = null;

    try {
      const { data } = await apolloClient.mutate({
        mutation: LOGIN_MUTATION,
        variables: {
          input: { email, password }
        }
      });

      if (data?.login) {
        setAuth(data.login);
        return true;
      } else {
        error.value = 'Login failed. Please try again.';
        return false;
      }
    } catch (err: any) {
      error.value = err.message || 'Login failed. Please check your credentials.';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    // Clear Apollo Client cache to ensure clean state
    try {
      await apolloClient.clearStore();
      await apolloClient.resetStore();
    } catch (err) {
      console.error('Error clearing Apollo cache:', err);
    }
    
    clearAuth();
  };

  const clearError = () => {
    error.value = null;
  };

  const fetchUser = async () => {
    if (!token.value) return;

    try {
      const { data } = await apolloClient.query({
        query: ME_QUERY,
        fetchPolicy: 'network-only'
      });

      if (data?.me) {
        user.value = data.me;
      } else {
        clearAuth();
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      clearAuth();
    }
  };

  const initializeAuth = async () => {
    // Try to restore user from localStorage if token exists
    const storedUser = localStorage.getItem('currentUser');
    if (token.value && storedUser) {
      try {
        user.value = JSON.parse(storedUser);
        // Verify the token is still valid by fetching user data
        await fetchUser();
      } catch (err) {
        console.error('Error restoring auth state:', err);
        clearAuth();
      }
    }
  };

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    register,
    login,
    logout,
    clearError,
    fetchUser,
    initializeAuth
  };
});
