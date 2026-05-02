import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../api/client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const authData = await AsyncStorage.getItem('authData');
        if (authData) {
          const parsedData = JSON.parse(authData);
          setUser(parsedData.user);
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${parsedData.token}`;
          // Optionally refresh profile data on load
          refreshUser();
        }
      } catch (e) {
        console.error("Failed to load auth data", e);
      } finally {
        setLoading(false);
      }
    };
    loadStorageData();
  }, []);

  const refreshUser = async () => {
    try {
      const response = await apiClient.get('/users/profile');
      setUser(response.data);
      // Update storage with fresh data
      const authData = await AsyncStorage.getItem('authData');
      if (authData) {
        const parsed = JSON.parse(authData);
        parsed.user = response.data;
        await AsyncStorage.setItem('authData', JSON.stringify(parsed));
      }
    } catch (error) {
      console.error("Context Refresh Error:", error);
    }
  };

  const login = async (form) => {
    try {
      const response = await apiClient.post('/auth/login', form);
      const { token, user } = response.data;
      setUser(user);
      await AsyncStorage.setItem('authData', JSON.stringify({ token, user }));
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Get full profile immediately after login to get skills/details
      refreshUser();
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await AsyncStorage.clear();
    setUser(null);
    delete apiClient.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};