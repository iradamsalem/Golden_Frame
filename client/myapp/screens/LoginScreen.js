import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import AppLogo from '../components/AppLogo';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '../components/ui/card';
import Toaster from '../components/ui/sonner'; // Import Toaster for displaying messages
import { API_BASE_URL } from '../config';

/**
 * LoginScreen Component
 * This component handles user login and signup functionality.
 * It allows users to toggle between login and signup modes, validates input,
 * and navigates to the UploadPhotos screen upon successful login or signup.
 */

const LoginScreen = () => {
  const navigation = useNavigation(); // Hook to navigate between screens
  const [isLoading, setIsLoading] = useState(false); // State to track loading status
  const [isLogin, setIsLogin] = useState(true); // State to toggle between login and signup modes
  const [loginEmail, setLoginEmail] = useState(''); // State for login email input
  const [loginPassword, setLoginPassword] = useState(''); // State for login password input
  const [signupEmail, setSignupEmail] = useState(''); // State for signup email input
  const [signupPassword, setSignupPassword] = useState(''); // State for signup password input
  const [signupName, setSignupName] = useState(''); // State for signup name input
  const [toastVisible, setToastVisible] = useState(false); // State to control toaster visibility
  const [toastMessage, setToastMessage] = useState(''); // State for toaster message
  const [toastType, setToastType] = useState('default'); // State for toaster type (e.g., success, error)

  
  /**
   * showToast Function
   * Displays a toast message with the specified message and type.
   * The toast disappears after 3 seconds.
   */
  
  const showToast = (message, type = 'default') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000); // Hide toast after 3 seconds
  };

  /**
   * handleLogin Function
   * Validates login input and navigates to the UploadPhotos screen upon success.
   * Displays error messages for invalid input or failed login attempts.
   */
  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      showToast('Please enter both email and password.', 'error');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginEmail)) {
      showToast('Invalid email address.', 'error');
      return;
    }
    
  

    setIsLoading(true);

    
  try {
    console.log('About to send login request');
    const response = await fetch(`${API_BASE_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: loginEmail,
        password: loginPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      showToast(data.error || 'Login failed', 'error');
      return;
    }

    showToast('Login Successful! Welcome back.', 'success');
    setTimeout(() => {
      navigation.navigate('UploadPhotos');
    }, 500
  );
  } catch (error) {
    showToast('Something went wrong. Please try again.', 'error');
  } finally {
    setIsLoading(false);
  }
};
  /**
   * handleSignup Function
   * Validates signup input and navigates to the UploadPhotos screen upon success.
   * Displays error messages for invalid input or failed signup attempts.
   */
  const handleSignup = async () => {
    if (!signupName || signupName.trim().length < 2) {
      showToast('Name must be at least 2 characters.', 'error');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupEmail)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }  
    if (!signupPassword || signupPassword.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }
    console.log('Validation passed, attempting login'); // לוג שני

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signupName,
          email: signupEmail,
          password: signupPassword,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        showToast(data.error || 'Signup failed', 'error');
        return;
      }
  
      showToast('Signup Successful! Welcome to Purpose Pics!', 'success');
      setTimeout(() => {
        navigation.navigate('UploadPhotos');
      }, 500);
    } catch (error) {
      showToast('Something went wrong. Please try again later.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* App Logo */}
      <AppLogo style={styles.logo} />

      {/* App Title and Subtitle */}
      <Text style={styles.title}>Purpose Pics</Text>
      <Text style={styles.subtitle}>Find your perfect photo for any purpose</Text>

      {/* Card for Login/Signup Form */}
      <Card style={styles.card}>
        <CardHeader>
          <CardTitle style={styles.cardTitle}>{isLogin ? 'Login' : 'Sign Up'}</CardTitle>
          <CardDescription style={styles.cardDescription}>
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isLogin ? (
            <>
              {/* Login Form */}
              <View style={styles.section}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="your@email.com"
                  placeholderTextColor="#ccc"
                  value={loginEmail}
                  onChangeText={setLoginEmail}
                  editable={!isLoading}
                />
              </View>

              <View style={styles.section}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#ccc"
                  secureTextEntry
                  value={loginPassword}
                  onChangeText={setLoginPassword}
                  editable={!isLoading}
                />
              </View>

              <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Sign In</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* Signup Form */}
              <View style={styles.section}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Your Name"
                  placeholderTextColor="#ccc"
                  value={signupName}
                  onChangeText={setSignupName}
                  editable={!isLoading}
                />
              </View>

              <View style={styles.section}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="your@email.com"
                  placeholderTextColor="#ccc"
                  value={signupEmail}
                  onChangeText={setSignupEmail}
                  editable={!isLoading}
                />
              </View>

              <View style={styles.section}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#ccc"
                  secureTextEntry
                  value={signupPassword}
                  onChangeText={setSignupPassword}
                  editable={!isLoading}
                />
              </View>

              <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={handleSignup}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Create Account</Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </CardContent>

        {/* Toggle Between Login and Signup */}
        <CardFooter>
          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.switchText}>
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
            </Text>
          </TouchableOpacity>
        </CardFooter>
      </Card>

      {/* Toaster Component */}
      <Toaster visible={toastVisible} message={toastMessage} type={toastType} />
    </ScrollView>
  );
};

// Styles for the LoginScreen component
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
  logo: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFD700',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#16213E',
    borderRadius: 10,
    padding: 10,
  },
  cardTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  cardDescription: {
    textAlign: 'center',
    fontSize: 14,
    color: '#ccc',
  },
  section: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: '#FFD700',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 14,
    color: '#fff',
    backgroundColor: '#0f3460',
  },
  button: {
    backgroundColor: '#FFD700',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#a3a3a3',
  },
  buttonText: {
    color: '#1a1a2e',
    fontSize: 16,
  },
  switchText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#FFD700',
    marginTop: 10,
  },
});

export default LoginScreen;