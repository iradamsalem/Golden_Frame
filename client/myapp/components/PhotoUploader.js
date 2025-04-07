import React from 'react';
import { View, Button, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const PhotoUploader = ({ onPhotosUploaded }) => {
  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const newPhotos = result.assets.map((asset) => asset.uri);
      if (onPhotosUploaded) {
        onPhotosUploaded(newPhotos); // רק שולח את התמונות, לא שומר מקומית
      }
    } else {
      Alert.alert("Cancelled", "No images were selected.");
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Upload Photos" onPress={pickImages} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
});

export default PhotoUploader;
