import React from 'react';
import UploadPhotosScreen from './UploadPhotosScreen';

const TestScreen = () => {
  return (<ImageBackground
        source={require('../assets/texture-bg.png')}
        style={styles.background}>
  <UploadPhotosScreen />
  </ImageBackground>);
};

export default TestScreen;
