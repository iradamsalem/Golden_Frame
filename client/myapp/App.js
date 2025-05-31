import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { UserProvider } from './contexts/UserContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TestScreen from './screens/TestScreen';
import UploadPhotosScreen from './screens/UploadPhotosScreen';
import PurposeSelector from './components/PurposeSelector';
import LoginScreen from './screens/LoginScreen';
import ResultsDisplay from './components/ResultsDisplay';
import LoadingScreen from './screens/LoadingScreen';
import LoadingGate from './screens/LoadingGate';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="LoadingGate"
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="UploadPhotos" component={UploadPhotosScreen} />
          <Stack.Screen name="PurposeSelector" component={PurposeSelector} />
          <Stack.Screen name="Loading" component={LoadingScreen} />
          <Stack.Screen name="ResultsDisplay" component={ResultsDisplay} />
          <Stack.Screen name="Test" component={TestScreen} />

          {/* מסך ביניים לבדיקה אם המשתמש מחובר */}
          <Stack.Screen name="LoadingGate" component={LoadingGate} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
