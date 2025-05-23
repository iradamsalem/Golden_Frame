import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const ResultsDisplay = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { purpose } = route.params || {};

// Initializes a state variable `photos` as an empty array and provides the `setPhotos` function
// to update it. Used in React to track and modify the list of photos.
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    fetch('http://192.168.1.241:3001/api/photos/selected-image')
      .then((res) => res.json())
      .then((data) => {
        setPhotos(data.photos);
      })
      .catch((error) => {
        console.error('Error fetching photos:', error);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Photos Ranked</Text>

      <ScrollView style={styles.scrollView}>
        {photos.map((photo, index) => (
          <View key={index} style={styles.photoContainer}>
            <View style={styles.rankBadge}>
              <Text style={styles.rankText}>{photo.rank}</Text>
            </View>
            
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: photo.image }}
                style={styles.image}
                resizeMode="contain"
              />
            </View>

            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>Score: {Math.round(photo.score)}%</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.feedbackWrapper}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Why These Rankings Work for {purpose}
          </Text>
          <Text style={styles.cardText}>
            Feedback will appear here once it's generated by our AI engine.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('UploadPhotos')}
        >
          <Text style={styles.buttonText}>Try Again with New Photos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#0a0a23',
    borderRadius: 10,
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'gold',
    paddingTop: 40,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  photoContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  rankBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'gold',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  rankText: {
    color: '#1a1a2e',
    fontWeight: 'bold',
    fontSize: 16,
  },
  imageWrapper: {
    backgroundColor: '#1a1a2e',
    padding: 8,
    borderRadius: 10,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
  },
  scoreContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
    borderRadius: 5,
  },
  scoreText: {
    color: 'gold',
    fontWeight: 'bold',
  },
  feedbackWrapper: {
    marginTop: 20,
    gap: 12,
  },
  card: {
    backgroundColor: '#2b2b3c',
    padding: 16,
    borderRadius: 10,
  },
  cardTitle: {
    fontSize: 18,
    color: 'gold',
    fontWeight: '600',
    marginBottom: 8,
  },
  cardText: {
    color: '#ddd',
    fontSize: 14,
  },
  button: {
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: 'gold',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  buttonText: {
    color: '#1a1a2e',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ResultsDisplay;
