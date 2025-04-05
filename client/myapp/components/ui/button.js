import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const variants = {
  default: {
    backgroundColor: '#ffd700',
    color: '#1a1a2e',
  },
  destructive: {
    backgroundColor: '#ff4d4d',
    color: '#fff',
  },
  secondary: {
    backgroundColor: '#444',
    color: '#fff',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#fff',
    color: '#fff',
  },
  ghost: {
    backgroundColor: 'transparent',
    color: '#aaa',
  },
  link: {
    backgroundColor: 'transparent',
    color: '#ffd700',
    textDecorationLine: 'underline',
  },
};

const sizes = {
  default: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    fontSize: 16,
  },
  sm: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  lg: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    fontSize: 18,
  },
  icon: {
    padding: 12,
    fontSize: 20,
  },
};

const Button = ({
  children,
  onPress,
  variant = 'default',
  size = 'default',
  disabled = false,
}) => {
  const variantStyle = variants[variant] || variants.default;
  const sizeStyle = sizes[size] || sizes.default;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: variantStyle.backgroundColor,
          borderColor: variantStyle.borderColor,
          borderWidth: variant === 'outline' ? 1 : 0,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
      disabled={disabled}
      onPress={onPress}
    >
      <Text
        style={[
          styles.text,
          { color: variantStyle.color, fontSize: sizeStyle.fontSize },
          variant === 'link' && { textDecorationLine: 'underline' },
        ]}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 6,
  },
  text: {
    fontWeight: '600',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});

export default Button;
