import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

const Badge = ({ children, variant = 'default', style }) => {
  const variantStyle = styles[variant] || styles.default;

  return (
    <View style={[styles.badge, variantStyle, style]}>
      <Text style={[styles.text, variantTextColors[variant] || variantTextColors.default]}>
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  default: {
    backgroundColor: '#1E90FF', // primary
    borderColor: 'transparent',
  },
  secondary: {
    backgroundColor: '#6c757d',
    borderColor: 'transparent',
  },
  destructive: {
    backgroundColor: '#dc3545',
    borderColor: 'transparent',
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: '#999',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});

const variantTextColors = {
  default: { color: '#fff' },
  secondary: { color: '#fff' },
  destructive: { color: '#fff' },
  outline: { color: '#fff' },
};

export default Badge;
