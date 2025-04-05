import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Toaster = ({ visible, message, type = "default" }) => {
  if (!visible) return null;

  return (
    <View style={[styles.toast, type === 'error' && styles.errorToast]}>
      <Text style={styles.toastText}>{message}</Text>
    </View>
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

export default Toaster;
