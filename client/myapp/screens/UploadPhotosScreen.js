import React, { useState, useContext } from 'react';
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
import { UserContext } from '../contexts/UserContext';
import Avatar from '../components/ui/avatar';

const screenWidth = Dimensions.get('window').width;
const maxCardWidth = 400;
const imageSpacing = 10;
const actualCardWidth = Math.min(screenWidth, maxCardWidth);
const imageSize = (actualCardWidth - imageSpacing * 3) / 2;

const UploadPhotosScreen = () => {
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();
  const { user, logout } = useContext(UserContext);

  const handlePhotosUploaded = (photos) => {
    setSelectedPhotos(photos);
    setErrorMessage('');
  };

  const handleLogout = async () => {
    await logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const handleNavigateToPurposeSelector = () => {
    if (selectedPhotos.length === 0) {
      setErrorMessage('Please upload at least one photo before selecting a purpose.');
      return;
    }

    setErrorMessage('');
    // פשוט לנווט עם התמונות בלבד
    navigation.navigate('PurposeSelector', { photos: selectedPhotos });
  };

  const firstLetter = user?.name?.charAt(0).toUpperCase() || '?';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Avatar fallbackText={firstLetter} size={40} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.name || 'Guest'}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

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
    backgroundColor: '#2A2B33',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#121629',
    padding: 10,
    borderRadius: 8,
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
  },
  userName: {
    color: '#E2B64D',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#E2B64D',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 5,
  },
  logoutText: {
    color: '#2A2B33',
    fontWeight: 'bold',
    fontSize: 14,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#E2B64D',
    textAlign: 'center',
    marginBottom: 20,
  },
  centeredCard: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#121629',
    borderRadius: 16,
    padding: 12,
    marginBottom: 20,
    width: '100%',
    maxWidth: maxCardWidth,
    flexGrow: 1,
  },
  purposeButton: {
    backgroundColor: '#E2B64D',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 5,
  },
  purposeButtonText: {
    color: '#2A2B33',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ff6b6b',
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
    height: imageSize * 0.8,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  removeButton: {
    marginTop: 6,
    backgroundColor: '#b8c1ec',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: 'center',
  },
  removeButtonText: {
    color: '#232946',
    fontWeight: 'bold',
  },
});

export default UploadPhotosScreen;
