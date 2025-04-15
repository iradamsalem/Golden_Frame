import React from 'react'; // Import React for creating the component
import { View, Button, Alert, StyleSheet } from 'react-native'; // Import React Native components
import * as ImagePicker from 'expo-image-picker'; // Import Expo's ImagePicker for selecting images

/**
 * PhotoUploader Component
 * This component allows users to upload photos from their device's gallery.
 * It uses Expo's ImagePicker to select images and passes the selected images
 * back to the parent component via the `onPhotosUploaded` callback.
 *
 * @param {Function} onPhotosUploaded - Callback function to handle the uploaded photos.
 */
const PhotoUploader = ({ onPhotosUploaded }) => {
  /**
   * pickImages Function
   * Opens the device's image library to allow the user to select images.
   * If images are selected, their URIs are passed to the parent component.
   */
  const pickImages = async () => {
    // Launch the image library with specific options
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Allow only images
      allowsMultipleSelection: true, // Enable multiple image selection
      quality: 1, // Set the image quality to the highest
    });

    // Check if the user selected images or canceled the operation
    if (!result.canceled) {
      // Map the selected images to their URIs
      const newPhotos = result.assets.map((asset) => asset.uri);

      // Call the parent callback with the selected photos
      if (onPhotosUploaded) {
        onPhotosUploaded(newPhotos);
      }
    } else {
      // Show an alert if the user canceled the selection
      Alert.alert("Cancelled", "No images were selected.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Button to trigger the image picker */}
      <Button title="Upload Photos" onPress={pickImages} />
    </View>
  );
};

// Styles for the PhotoUploader component
const styles = StyleSheet.create({
  container: {
    paddingVertical: 10, // Add vertical padding around the button
  },
});

export default PhotoUploader; // Export the component for use in other parts of the app