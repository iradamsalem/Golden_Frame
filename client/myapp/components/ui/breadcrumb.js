import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons'; // Chevron-right icon

const Breadcrumb = ({ items = [], onPressItem = () => {} }) => {
  return (
    <View style={styles.container}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <View key={index} style={styles.breadcrumbItem}>
            {!isLast ? (
              <TouchableOpacity onPress={() => onPressItem(item)}>
                <Text style={styles.link}>{item.label}</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.current}>{item.label}</Text>
            )}
            {!isLast && <Feather name="chevron-right" size={16} color="#ccc" style={styles.icon} />}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 20,
  },
  breadcrumbItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  link: {
    color: 'gold',
    fontSize: 14,
    marginRight: 4,
  },
  current: {
    color: '#ddd',
    fontSize: 14,
    fontWeight: '600',
  },
  icon: {
    marginLeft: 2,
  },
});

export default Breadcrumb;
