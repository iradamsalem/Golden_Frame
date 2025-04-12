import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Card, CardHeader, CardContent } from '../components/ui/card';
import PhotoUploader from '../components/PhotoUploader';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const maxCardWidth = 400;
const imageSpacing = 10;
const actualCardWidth = Math.min(screenWidth, maxCardWidth);
const imageSize = (actualCardWidth - imageSpacing * 3) / 2;

const UploadPhotosScreen = () => {
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();

  const handlePhotosUploaded = (photos) => {
    setSelectedPhotos(photos);
    setErrorMessage('');
  };

  const handleNavigateToPurposeSelector = () => {
    if (selectedPhotos.length > 0) {
      setErrorMessage('');
      navigation.navigate('PurposeSelector', { photos: selectedPhotos });
    } else {
      setErrorMessage('Please upload at least one photo before selecting a purpose.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Your Photos</Text>

      <View style={styles.centeredCard}>
        <Card style={styles.card}>
          <CardHeader>
            <TouchableOpacity
              style={styles.purposeButton}
              onPress={handleNavigateToPurposeSelector}
            >
              <Text style={styles.purposeButtonText}>Select Purpose</Text>
            </TouchableOpacity>
            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
          </CardHeader>

          <CardContent style={styles.cardContent}>
            <PhotoUploader onPhotosUploaded={handlePhotosUploaded} />

            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
            >
              {selectedPhotos.map((item, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri: item.uri || item }} style={styles.image} />
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => {
                      const newPhotos = selectedPhotos.filter((_, i) => i !== index);
                      setSelectedPhotos(newPhotos);
                    }}
                  >
                    <Text style={styles.removeButtonText}>REMOVE</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </CardContent>
        </Card>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#1a1a2e',
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 20,
  },
  centeredCard: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#16213E',
    borderRadius: 16,
    padding: 12,
    marginBottom: 20,
    width: '100%',
    maxWidth: maxCardWidth,
    flexGrow: 1,
  },
  purposeButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 5,
  },
  purposeButtonText: {
    color: '#1a1a2e',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#FF6B6B',
    textAlign: 'center',
    marginTop: 5,
    fontSize: 14,
  },
  cardContent: {
    paddingHorizontal: imageSpacing,
    maxHeight: 500,
  },
  scrollContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
    marginTop: 10,
  },
  imageWrapper: {
    width: '48%',
    marginBottom: 12,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: imageSize*0.8,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  removeButton: {
    marginTop: 6,
    backgroundColor: '#007BFF',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default UploadPhotosScreen;