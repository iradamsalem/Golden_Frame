import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { API_BASE_URL } from '../config';

/**
 * LoadingScreen Component
 * 
 * Displays a loading screen with a status message and a purpose.
 * 
 * @component
 */
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
            // GET request to fetch processed photos
            // This endpoint returns the photos that have been analyzed
            const response = await fetch(`${API_BASE_URL}/api/photos/selected-image`, {
              method: 'GET', // Explicitly stating this is a GET request
              headers: {
                'Accept': 'application/json',
              }
            });
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
        <ActivityIndicator size="large" color="#E2B64D" />
        <Text style={styles.statusText}>{loadingStatus}</Text>
        <Text style={styles.purposeText}>For: {purpose}</Text>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E2B64D',
    marginBottom: 40,
    textAlign: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  statusText: {
    color: '#E2B64D',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  purposeText: {
    color: '#E2B64D',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
  },
  errorContainer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#2b2b3c',
    borderRadius: 10,
    alignItems: 'center',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default LoadingScreen; 