import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TestScreen from './screens/TestScreen';
import UploadPhotosScreen from './screens/UploadPhotosScreen';
import PurposeSelector from './components/PurposeSelector';
import LoginScreen from './screens/LoginScreen';
import ResultsDisplay from './components/ResultsDisplay';
import LoadingScreen from './app/loading';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UploadPhotos"
          component={UploadPhotosScreen}
          options={{ headerShown: false, title: 'Upload Photos' }}
        />
        <Stack.Screen
          name="PurposeSelector"
          component={PurposeSelector}
          options={{ headerShown: false, title: 'Select Purpose' }}
        />
        <Stack.Screen
          name="Loading"
          component={LoadingScreen}
          options={{ headerShown: false, title: 'Processing Photos' }}
        />
        <Stack.Screen
          name="ResultsDisplay"
          component={ResultsDisplay}
          options={{ headerShown: false, title: 'Results' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;