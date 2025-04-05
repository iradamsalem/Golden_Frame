import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import Toaster from '../components/ui/sonner'; // Import Toaster

const TestScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleShowToast = () => {
    setToastMessage('Hello! This is a test toast.');
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000); // Hide toast after 3 seconds
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <CardHeader>
          <CardTitle>Test UI Components</CardTitle>
        </CardHeader>
        <CardContent>
          <View style={styles.section}>
            <Label>Your Name</Label>
            <Input
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
            />
          </View>

          <View style={styles.section}>
            <Label>Your Email</Label>
            <Input
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
            />
          </View>

          <TouchableOpacity onPress={handleShowToast} style={styles.button}>
            <Text style={styles.buttonText}>Show Toast</Text>
          </TouchableOpacity>
        </CardContent>
      </Card>

      {/* Toaster Component */}
      <Toaster visible={toastVisible} message={toastMessage} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 100,
    backgroundColor: '#f5f5f5',
  },
  section: {
    marginBottom: 20,
  },
  card: {
    marginTop: 20,
  },
  button: {
    backgroundColor: '#3b82f6',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default TestScreen;
