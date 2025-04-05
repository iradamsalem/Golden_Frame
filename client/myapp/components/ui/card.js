import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Card = ({ style, children }) => (
  <View style={[styles.card, style]}>{children}</View>
);

const CardHeader = ({ style, children }) => (
  <View style={[styles.header, style]}>{children}</View>
);

const CardTitle = ({ style, children }) => (
  <Text style={[styles.title, style]}>{children}</Text>
);

const CardDescription = ({ style, children }) => (
  <Text style={[styles.description, style]}>{children}</Text>
);

const CardContent = ({ style, children }) => (
  <View style={[styles.content, style]}>{children}</View>
);

const CardFooter = ({ style, children }) => (
  <View style={[styles.footer, style]}>{children}</View>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#888',
    backgroundColor: '#1a1a1a',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
    marginVertical: 10,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  description: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 4,
  },
  content: {
    padding: 16,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#444',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
