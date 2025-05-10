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
import { API_BASE_URL } from '../config';

// Calculate screen dimensions and image sizes
const screenWidth = Dimensions.get('window').width; // Get the screen width
const maxCardWidth = 400; // Maximum width for the card
const imageSpacing = 10; // Spacing between images
const actualCardWidth = Math.min(screenWidth, maxCardWidth); // Use the smaller value between screen width and maxCardWidth
const imageSize = (actualCardWidth - imageSpacing * 3) / 2; // Calculate the size of each image

/**
 * UploadPhotosScreen Component
 * This component allows users to upload photos, view them, and navigate to the PurposeSelector screen.
 */
const UploadPhotosScreen = () => {
  const [selectedPhotos, setSelectedPhotos] = useState([]); // State to store uploaded photos
  const [errorMessage, setErrorMessage] = useState(''); // State to store error messages
  const navigation = useNavigation(); // Hook to navigate between screens

  /**
   * handlePhotosUploaded Function
   * Updates the state with the uploaded photos and clears any error messages.
   *
   * @param {Array} photos - Array of uploaded photo URIs.
   */
  const handlePhotosUploaded = (photos) => {
    setSelectedPhotos(photos);
    setErrorMessage('');
  };

  /**
   * handleNavigateToPurposeSelector Function
   * Navigates to the PurposeSelector screen if at least one photo is uploaded.
   * Displays an error message if no photos are uploaded.
   */
  const handleNavigateToPurposeSelector = async () => {
    if (selectedPhotos.length === 0) {
      setErrorMessage('Please upload at least one photo before selecting a purpose.');
      return;
    }
  
    setErrorMessage('');  // Clear any previous error messages
      //  Navigate to PurposeSelector screen with uploaded photos
      navigation.navigate('PurposeSelector', { photos: selectedPhotos });
  
    // Prepare form data for uploading photos
    const formData = new FormData();
    selectedPhotos.forEach((photo, index) => {
      formData.append('photos', {
        uri: photo.uri || photo,
        name: `photo_${index}.jpg`,
        type: 'image/jpeg',
      });
    });
  
    
  let attempt = 0;
  const maxAttempts = 2;

  while (attempt < maxAttempts) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/photos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload photos');
      }

      const data = await response.json();
      console.log('Photos uploaded successfully:', data);
      return true; // הצליח

    } catch (error) {
      attempt++;

      const isNetworkError = error.message.includes('Network request failed');

      if (isNetworkError && attempt < maxAttempts) {
        // שגיאת תקשורת – ננסה שוב בלי הדפסה
        continue;
      } else {
        // שגיאה אמיתית או שכבר ניסינו מספיק פעמים
        if (!isNetworkError) {
          console.error('Error uploading photos:', error);
        }
        setErrorMessage('Failed to upload photos. Please try again.');
        return false;
      }
    }
  }
};


  return (
    <View style={styles.container}>
      {/* Screen Title */}
      <Text style={styles.title}>Upload Your Photos</Text>

      {/* Centered Card for Photo Upload and Navigation */}
      <View style={styles.centeredCard}>
        <Card style={styles.card}>
          <CardHeader>
            {/* Button to Navigate to PurposeSelector */}
            <TouchableOpacity
              style={styles.purposeButton}
              onPress={handleNavigateToPurposeSelector}
            >
              <Text style={styles.purposeButtonText}>Select Purpose</Text>
            </TouchableOpacity>
            {/* Display Error Message if No Photos are Uploaded */}
            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
          </CardHeader>

          <CardContent style={styles.cardContent}>
            {/* PhotoUploader Component */}
            <PhotoUploader onPhotosUploaded={handlePhotosUploaded} />

            {/* Scrollable List of Uploaded Photos */}
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
            >
              {selectedPhotos.map((item, index) => (
                <View key={index} style={styles.imageWrapper}>
                  {/* Display Uploaded Photo */}
                  <Image source={{ uri: item.uri || item }} style={styles.image} />
                  {/* Button to Remove Photo */}
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => {
                      const newPhotos = selectedPhotos.filter((_, i) => i !== index); // Remove the selected photo
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

// Styles for the UploadPhotosScreen component
const styles = StyleSheet.create({
  container: {
    padding: 20, // Padding around the screen
    paddingTop: 50, // Extra padding at the top
    backgroundColor: '#1a1a2e', // Dark background color
    flex: 1, // Allow the container to grow and fill available space
  },
  title: {
    fontSize: 26, // Font size for the title
    fontWeight: 'bold', // Bold font weight
    color: '#FFD700', // Gold text color
    textAlign: 'center', // Center the title text
    marginBottom: 20, // Space below the title
  },
  centeredCard: {
    alignItems: 'center', // Center the card horizontally
    justifyContent: 'center', // Center the card vertically
  },
  card: {
    backgroundColor: '#16213E', // Dark blue background color
    borderRadius: 16, // Rounded corners
    padding: 12, // Padding inside the card
    marginBottom: 20, // Space below the card
    width: '100%', // Full width of the container
    maxWidth: maxCardWidth, // Maximum width for the card
    flexGrow: 1, // Allow the card to grow
  },
  purposeButton: {
    backgroundColor: '#FFD700', // Gold background color
    paddingVertical: 10, // Vertical padding inside the button
    paddingHorizontal: 20, // Horizontal padding inside the button
    borderRadius: 8, // Rounded corners
    alignItems: 'center', // Center the button text horizontally
    alignSelf: 'center', // Center the button within its container
    marginBottom: 5, // Space below the button
  },
  purposeButtonText: {
    color: '#1a1a2e', // Dark text color for contrast
    fontSize: 16, // Font size for the button text
    fontWeight: 'bold', // Bold font weight
  },
  errorText: {
    color: '#FF6B6B', // Red text color for error messages
    textAlign: 'center', // Center the error text
    marginTop: 5, // Space above the error text
    fontSize: 14, // Font size for the error text
  },
  cardContent: {
    paddingHorizontal: imageSpacing, // Horizontal padding inside the card content
    maxHeight: 500, // Maximum height for the card content
  },
  scrollContainer: {
    flexDirection: 'row', // Arrange items in a row
    flexWrap: 'wrap', // Allow items to wrap to the next row
    justifyContent: 'space-between', // Space items evenly
    paddingBottom: 20, // Space below the scroll container
    marginTop: 10, // Space above the scroll container
  },
  imageWrapper: {
    width: '48%', // Width of each image wrapper
    marginBottom: 12, // Space below each image
    alignItems: 'center', // Center the image horizontally
  },
  image: {
    width: '100%', // Full width of the image wrapper
    height: imageSize * 0.8, // Height of the image
    borderRadius: 10, // Rounded corners for the image
    resizeMode: 'cover', // Cover the entire image area
  },
  removeButton: {
    marginTop: 6, // Space above the remove button
    backgroundColor: '#007BFF', // Blue background color for the button
    paddingVertical: 5, // Vertical padding inside the button
    paddingHorizontal: 10, // Horizontal padding inside the button
    borderRadius: 5, // Rounded corners for the button
    alignSelf: 'center', // Center the button within its container
  },
  removeButtonText: {
    color: 'white', // White text color
    fontWeight: 'bold', // Bold font weight
  },
});

export default UploadPhotosScreen;