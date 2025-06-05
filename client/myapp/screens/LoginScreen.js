import React, { useState, useContext } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Keyboard } from 'react-native';
import { useRef, useEffect } from 'react';


import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  ImageBackground,
  Image
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
import Toaster from '../components/ui/sonner';
import { API_BASE_URL } from '../config';
import { UserContext } from '../contexts/UserContext'; 

const LoginScreen = () => {
  const navigation = useNavigation();
  const { login } = useContext(UserContext); 
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('default');

  const scrollViewRef = useRef();
  const cardRef = useRef(null);


useEffect(() => {
  const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
    scrollViewRef.current?.scrollToPosition(0, 250, true); // גלול תמיד לאותו מקום
  });

  const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
    scrollViewRef.current?.scrollToPosition(0, 0, true);
  });

  return () => {
    showSubscription.remove();
    hideSubscription.remove();
  };
}, []);





  const showToast = (message, type = 'default') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

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
      const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await response.json();
      console.log('[Login] response:', data);

      if (!response.ok) {
        showToast(data.error || 'Login failed', 'error');
        return;
      }

      // ✅ תקין: ניגש למידע מתוך data.user
      const { name, email } = data.user;
      login({ name, email });
      showToast('Login Successful! Welcome back.', 'success');

      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'UploadPhotos' }],
        });
      }, 500);
    } catch (error) {
      console.error('[Login] error:', error);
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

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

      login({ name: signupName, email: signupEmail });
      showToast('Signup Successful! Welcome to Purpose Pics!', 'success');

      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'UploadPhotos' }],
        });
      }, 500);
    } catch (error) {
      console.error('[Signup] error:', error);
      showToast('Something went wrong. Please try again later.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
   <ImageBackground source={require('../assets/texture-bg.png')} style={styles.background}>
  <KeyboardAwareScrollView
  ref={scrollViewRef}
  contentContainerStyle={styles.overlay}
  enableOnAndroid={true}
  keyboardShouldPersistTaps="handled"
>
    <Image source={require('../assets/logo.png')} style={styles.logo} />
    <Text style={styles.title}>Purpose Pics</Text>
    <Text style={styles.subtitle}>Find your perfect photo for any purpose</Text>

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
                {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign In</Text>}
              </TouchableOpacity>
            </>
          ) : (
            <>
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
                {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Create Account</Text>}
              </TouchableOpacity>
            </>
          )}
        </CardContent>
        

        <CardFooter>
          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.switchText}>
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
            </Text>
          </TouchableOpacity>
        </CardFooter>
        
</Card>

    <Toaster visible={toastVisible} message={toastMessage} type={toastType} />
  </KeyboardAwareScrollView>
</ImageBackground>
  );
};

const styles = StyleSheet.create({
  headerSection: {
  alignItems: 'center',
  marginTop: 30,
},

scrollContainer: {
  flexGrow: 1,
  justifyContent: 'center',
  padding: 20,
  paddingBottom: 200, // מוסיף מקום לדחיפה
},

  background: {
    resizeMode : "cover",
    flex: 1,
    width: '100%',
    height: '100%',
  },
 overlay: {
  flexGrow: 1,
  padding: 20,
  alignItems: 'center',
  justifyContent: 'flex-start',
  minHeight: 150, // ✅ מוסיף גובה בסיסי למסך
  paddingBottom: 500, // ✅ מרחב לדחיפה בעת פתיחת מקלדת
},
card: {
  width: '100%',
  maxWidth: 400,
//  aspectRatio: 0.8, // שומר פרופורציות קבועות (למשל 400x250)
  borderRadius: 10,
  overflow: 'hidden',
  justifyContent: 'center',
 // alignItems: 'center',
},

cardImage: {
  resizeMode: 'contain', // מציג את כל התמונה
  width: '100%',
  height: '100%',
},


logo: {
  width: '60%',
  height: undefined,
  aspectRatio: 1,
  marginBottom: 20,
  //alignItems: 'center',
  resizeMode: 'contain',
},
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E2B64D',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#E2B64D',
    marginBottom: 20,
    textAlign: 'center',
  },
  cardTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E2B64D',
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
    color: '#E2B64D',
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
    backgroundColor: '#E2B64D',
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
    color: '#E2B64D',
    marginTop: 2,
  },
});

export default LoginScreen;
