import React, { createContext, useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('default');
  const [fadeAnim] = useState(new Animated.Value(0));

  const showToast = (msg, { type = 'default', duration = 3000 } = {}) => {
    setMessage(msg);
    setType(type);
    setVisible(true);

    // Fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    // Hide after duration
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setVisible(false));
    }, duration);
  };

  return (
    <ToastContext.Provider value={{ toast: showToast }}>
      {children}
      {visible && (
        <Animated.View
          style={[
            styles.toast,
            type === 'error' && styles.errorToast,
            { opacity: fadeAnim },
          ]}
        >
          <Text style={styles.toastText}>{message}</Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
    zIndex: 9999,
    alignItems: 'center',
  },
  errorToast: {
    backgroundColor: '#D9534F',
  },
  toastText: {
    color: '#fff',
    fontSize: 14,
  },
});
