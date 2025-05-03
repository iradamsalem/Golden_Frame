import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { styles } from './styles';

const LoadingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { purpose } = route.params || {};

  // State for tracking loading status
  const [loadingStatus, setLoadingStatus] = useState('Processing your photos...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        // Start polling for results
        const pollInterval = setInterval(async () => {
          try {
            const response = await fetch('http://192.162.8.136:3001/api/photos/selected-image');
            const data = await response.json();

            if (data.photos && data.photos.length > 0) {
              clearInterval(pollInterval);
              // Navigate to ResultsDisplay with the photos data
              navigation.navigate('ResultsDisplay', { 
                photos: data.photos,
                purpose: purpose 
              });
            }
          } catch (error) {
            console.error('Error polling for photos:', error);
            setError('Failed to fetch results. Please try again.');
            clearInterval(pollInterval);
          }
        }, 2000); // Poll every 2 seconds

        // Cleanup interval on unmount
        return () => clearInterval(pollInterval);
      } catch (error) {
        console.error('Error in loading screen:', error);
        setError('Failed to process photos. Please try again.');
      }
    };

    fetchPhotos();
  }, [purpose, navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Analyzing Your Photos</Text>
      
      <View style={styles.content}>
        <ActivityIndicator size="large" color="gold" />
        <Text style={styles.statusText}>{loadingStatus}</Text>
        <Text style={styles.purposeText}>For: {purpose}</Text>
      </View>

      {/* TODO: Add error handling UI */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          {/* TODO: Add retry button */}
        </View>
      )}
    </View>
  );
};

export default LoadingScreen; 