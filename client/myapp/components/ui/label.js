// components/ui/label.js
import React from 'react';
import { Text, StyleSheet } from 'react-native';

const Label = ({ children, style, ...props }) => {
  return (
    <Text style={[styles.label, style]} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
    marginBottom: 6,
  },
});

export default Label;
