import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

const Avatar = ({ source, fallbackText = '?', size = 40 }) => {
  const hasImage = !!source?.uri;

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
      {hasImage ? (
        <Image
          source={source}
          style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.fallback, { width: size, height: size, borderRadius: size / 2 }]}>
          <Text style={styles.fallbackText}>{fallbackText}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#444',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fallback: {
    backgroundColor: '#888',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Avatar;
