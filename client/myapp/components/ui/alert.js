import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

const Alert = ({ variant = 'default', title, description }) => {
  const isDestructive = variant === 'destructive';

  return (
    <View style={[styles.container, isDestructive ? styles.destructive : styles.default]}>
      <Feather
        name={isDestructive ? 'alert-triangle' : 'info'}
        size={20}
        color={isDestructive ? '#e74c3c' : '#3498db'}
        style={styles.icon}
      />
      <View style={styles.content}>
        {title && <Text style={[styles.title, isDestructive && styles.destructiveText]}>{title}</Text>}
        {description && <Text style={[styles.description, isDestructive && styles.destructiveText]}>{description}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  default: {
    backgroundColor: '#1a1a2e',
    borderColor: '#3498db',
  },
  destructive: {
    backgroundColor: '#2e1a1a',
    borderColor: '#e74c3c',
  },
  icon: {
    marginRight: 12,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#ccc',
  },
  destructiveText: {
    color: '#e74c3c',
  },
});

export default Alert;
