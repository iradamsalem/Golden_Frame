import React, { useState } from 'react';
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
import Toaster from '../components/ui/sonner'; // Import Toaster

const LoginScreen = () => {
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

  const showToast = (message, type = 'default') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000); // Hide toast after 3 seconds
  };

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      showToast('Please enter both email and password.', 'error');
      return;
    }

    setIsLoading(true);

    try {
      showToast('Login Successful! Welcome to Purpose Pics!', 'default');
    } catch (error) {
      showToast('Login Failed: Invalid credentials.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!signupEmail || !signupPassword || !signupName) {
      showToast('Please enter email, password, and name.', 'error');
      return;
    }

    setIsLoading(true);

    try {
      showToast('Signup Successful! Welcome to Purpose Pics!', 'default');
    } catch (error) {
      showToast('Signup Failed: Invalid signup data.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AppLogo style={styles.logo} />

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
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Sign In</Text>
                )}
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
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Create Account</Text>
                )}
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

      {/* Toaster Component */}
      <Toaster visible={toastVisible} message={toastMessage} type={toastType} />
    </ScrollView>
  );
};

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
