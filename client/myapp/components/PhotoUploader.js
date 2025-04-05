import React, { useState } from 'react';
import { View, Button, Image, FlatList, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const PhotoUploader = () => {
  const [selectedPhotos, setSelectedPhotos] = useState([]);

  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const newPhotos = result.assets.map((asset) => asset.uri);
      setSelectedPhotos([...selectedPhotos, ...newPhotos]);
    } else {
      Alert.alert("Cancelled", "No images were selected.");
    }
  };

  const removePhoto = (index) => {
    const updatedPhotos = [...selectedPhotos];
    updatedPhotos.splice(index, 1);
    setSelectedPhotos(updatedPhotos);
  };

  return (
    <View style={styles.container}>
      <Button title="Upload Photos" onPress={pickImages} />
      <FlatList
        data={selectedPhotos}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        renderItem={({ item, index }) => (
          <View style={styles.photoContainer}>
            <Image source={{ uri: item }} style={styles.image} />
            <Button title="Remove" onPress={() => removePhoto(index)} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  photoContainer: {
    margin: 8,
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
});

export default PhotoUploader;
