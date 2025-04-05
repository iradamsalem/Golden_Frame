import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Tabs = ({ tabs = [], initialTab = 0 }) => {
  const [activeIndex, setActiveIndex] = useState(initialTab);

  return (
    <View style={styles.container}>
      <View style={styles.tabHeader}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.tabButton,
              activeIndex === index && styles.activeTab,
            ]}
            onPress={() => setActiveIndex(index)}
          >
            <Text
              style={[
                styles.tabText,
                activeIndex === index && styles.activeTabText,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.tabContent}>
        {tabs[activeIndex]?.content}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  tabHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderColor: 'transparent',
    marginHorizontal: 5,
  },
  activeTab: {
    borderColor: 'gold',
  },
  tabText: {
    fontSize: 16,
    color: '#ccc',
  },
  activeTabText: {
    color: 'gold',
    fontWeight: 'bold',
  },
  tabContent: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#1a1a1a',
  },
});

export default Tabs;
