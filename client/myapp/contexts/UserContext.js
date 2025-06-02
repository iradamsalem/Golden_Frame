import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { name, email }
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = await AsyncStorage.getItem('userInfo');
        if (stored) setUser(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load user from storage:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (userInfo) => {
    setUser(userInfo);
    await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('userInfo');
  };

  return (
    <UserContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};
