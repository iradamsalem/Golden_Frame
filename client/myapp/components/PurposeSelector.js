// PurposeSelector.js

import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from '../config';

// List of purposes with their details and icons
const purposes = [
  {
    id: 'instagram',
    name: 'Instagram',
    description: 'Engaging, vibrant with good composition',
    icon: (
      <Svg viewBox="0 0 24 24" width={24} height={24} fill="gold">
        {/* Instagram SVG icon */}
        <Path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm10 2c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3h10zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm4.5-2a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
      </Svg>
    ),
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    description: 'Professional, approachable, well-lit',
    icon: (
      <Svg viewBox="0 0 24 24" width={24} height={24} fill="gold">
        {/* LinkedIn SVG icon */}
        <Path d="M4 3c0-.6.4-1 1-1h14a1 1 0 011 1v18a1 1 0 01-1 1H5a1 1 0 01-1-1V3zm5.1 7.5H6.9V18h2.2v-7.5zm-1.1-1.8c.7 0 1.1-.5 1.1-1.1s-.4-1.1-1.1-1.1c-.7 0-1.1.5-1.1 1.1s.4 1.1 1.1 1.1zM17.1 18v-4.2c0-2.3-1.2-3.4-2.9-3.4-1.3 0-1.9.7-2.3 1.2V10.5H9.7V18h2.2v-4.1c0-1 .7-1.6 1.5-1.6s1.3.6 1.3 1.6V18h2.4z" />
      </Svg>
    ),
  },
  {
    id: 'dating',
    name: 'Dating Apps',
    description: 'Authentic, flattering, showing personality',
    icon: (
      <Svg viewBox="0 0 24 24" width={24} height={24} fill="gold">
        {/* Dating app SVG icon (heart shape) */}
        <Path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 
                 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 
                 2.09C13.09 3.81 14.76 3 16.5 3 
                 19.58 3 22 5.42 22 8.5 
                 c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </Svg>
    ),
  },
  {
    id: 'resume',
    name: 'Resume',
    description: 'Formal, composed, professional attire',
    icon: (
      <Svg viewBox="0 0 24 24" width={24} height={24} fill="gold">
        {/* Resume document SVG icon */}
        <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-2 17H8v-2h4v2zm6-4H6v-2h12v2zm0-4H6V9h12v2z" />
      </Svg>
    ),
  },
  {
    id: 'facebook',
    name: 'Facebook',
    description: 'Friendly, casual, good for social context',
    icon: (
      <Svg viewBox="0 0 24 24" width={24} height={24} fill="gold">
        {/* Facebook logo SVG icon */}
        <Path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C18.34 21.21 22 17.06 22 12.06C22 6.53 17.5 2.04 12 2.04Z" />
      </Svg>
    ),
  },
  {
    id: 'twitter',
    name: 'Twitter/X',
    description: 'Dynamic, expressive, with good framing',
    icon: (
      <Svg viewBox="0 0 24 24" width={24} height={24} fill="gold">
        {/* Twitter/X logo SVG icon */}
        <Path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zM17.083 19.77h1.833L7.084 4.126H5.117z" />
      </Svg>
    ),
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Corporate, serious, excellent quality',
    icon: (
      <Svg viewBox="0 0 24 24" width={24} height={24} fill="gold">
        {/* Business/office-related SVG icon */}
        <Path d="M10 16v-1H3.01L3 19c0 1.11.89 2 2 2h14a2 2 0 0 0 2-2v-4h-7v1h-4zm10-9h-4.01V5l-2-2h-4l-2 2v2H4c-1.1 0-2 .9-2 2v3c0 1.11.89 2 2 2h6v-2h4v2h6c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm-6 0h-4V5h4v2z" />
      </Svg>
    ),
  },
];

const PurposeSelector = () => {
  const [selectedPurpose, setSelectedPurpose] = useState(null); // Track selected purpose
  const navigation = useNavigation(); // React Navigation hook

  // Render a single item in the FlatList
  const renderItem = ({ item }) => {
    const isSelected = selectedPurpose === item.id;

    return (
      <TouchableOpacity
        style={[styles.card, isSelected ? styles.cardSelected : styles.cardUnselected]}
        onPress={() => {
          setSelectedPurpose(item.id);
          // First make the POST request
          fetch(`${API_BASE_URL}/api/purpose`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              purpose: item.name,
            }),
          })
          .then(() => {
            // After successful POST, navigate to Loading screen
            navigation.navigate('Loading', { purpose: item.name });
          })
          .catch((error) => {
            console.error('Error sending purpose:', error);
          });
        }}
      >
        {/* Icon view */}
        <View style={[styles.iconWrapper, isSelected ? styles.iconSelected : styles.iconUnselected]}>
          {item.icon}
        </View>

        {/* Title */}
        <Text style={[styles.name, isSelected && styles.textSelected]}>{item.name}</Text>

        {/* Description */}
        <Text style={[styles.description, isSelected && styles.textSelected]}>{item.description}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: '#1a1a2e', flex: 1 }]}>
      {/* Header title */}
      <Text style={styles.title}>Select a Purpose</Text>

      {/* List of purposes in 2 columns */}
      <FlatList
        data={purposes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
      />
    </View>
  );
};

// Style definitions
const styles = StyleSheet.create({
  container: { padding: 16 },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: 'gold',
    paddingTop: 40,
    textAlign: 'center',
  },
  card: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    padding: 12,
    marginBottom: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cardSelected: {
    borderColor: 'gold',
    borderWidth: 2,
    backgroundColor: '#333333',
  },
  cardUnselected: {
    borderColor: '#999',
    borderWidth: 1,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconSelected: {
    backgroundColor: '#001f3f',
  },
  iconUnselected: {
    backgroundColor: '#334',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: 'gold',
  },
  description: {
    fontSize: 12,
    textAlign: 'center',
    color: '#aaa',
  },
  textSelected: {
    color: 'gold',
  },
});

export default PurposeSelector;
