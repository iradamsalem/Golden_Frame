import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TestScreen from './screens/TestScreen';
import UploadPhotosScreen from './screens/UploadPhotosScreen';
import PurposeSelector from './components/PurposeSelector';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Test">
        <Stack.Screen
          name="Test"
          component={TestScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UploadPhotos"
          component={UploadPhotosScreen}
          options={{ headerShown: true, title: 'Upload Photos' }}
        />
        <Stack.Screen
          name="PurposeSelector"
          component={PurposeSelector}
          options={{ headerShown: false, title: 'Select Purpose' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
