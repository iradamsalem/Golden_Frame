import React, { useContext, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { UserContext } from '../contexts/UserContext';
import { useNavigation } from '@react-navigation/native';

const LoadingGate = () => {
  const { user, isLoading } = useContext(UserContext);
  const navigation = useNavigation();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'UploadPhotos' }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
    }
  }, [isLoading, user]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="gold" />
    </View>
  );
};

export default LoadingGate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
