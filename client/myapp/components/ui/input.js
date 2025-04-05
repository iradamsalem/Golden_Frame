// Input.js
import React, { forwardRef } from 'react';
import { TextInput, StyleSheet } from 'react-native';

const Input = forwardRef((props, ref) => {
  const { style, ...rest } = props;

  return (
    <TextInput
      ref={ref}
      style={[styles.input, style]}
      placeholderTextColor="#999"
      {...rest}
    />
  );
});

Input.displayName = 'Input';

const styles = StyleSheet.create({
  input: {
    height: 40,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#000',
  },
});

export { Input };
