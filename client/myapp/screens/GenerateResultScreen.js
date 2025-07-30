import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { API_BASE_URL } from '../config';

const getPurposeHint = (purpose) => {
  const key = (purpose || '').toLowerCase().trim();
  switch (key) {
    case 'instagram':
      return '📸 Generate stylish and trendy captions that match your aesthetic for Instagram.';
    case 'facebook':
      return '👥 Write a warm and social post that fits family moments, events or memories.';
    case 'twitter':
    case 'twitter/x':
    case 'x':
      return '🐦 Create short, witty, or bold statements that stand out in a minimal format.';
    case 'linkedin':
      return '💼 Write a professional summary or headline that showcases your strengths.';
    case 'dating':
    case 'dating apps':
      return '💘 Create a fun, honest, and confident description that represents who you are.';
    case 'resume':
      return '📄 Write a clean and strong professional summary suitable for a resume or job application.';
    default:
      return '🧠 Generate personalized content based on your photos and preferences.';
  }
};

const GenerateResultScreen = () => {
  const route = useRoute();
  const { purpose, likedLabels = [], likedPhotos = [] } = route.params || {};

  const [userPrompt, setUserPrompt] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setGeneratedText('');
    setError('');

    const MAX_RETRIES = 3;
    const RETRY_DELAY = 2000;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            purpose,
            prompt: userPrompt,
            labels: likedLabels,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setGeneratedText(data.result);
          setLoading(false);
          return;
        } else {
          throw new Error(data.error || 'Something went wrong.');
        }

      } catch (err) {
        if (attempt === MAX_RETRIES) {
          console.error('❌ Final attempt failed:', err);
          setError('Server error. Please try again later.');
        } else {
          console.warn(`⚠️ Attempt ${attempt} failed. Retrying...`);
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
        }
      }
    }

    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Generate Result</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Selected Purpose:</Text>
        <Text style={styles.value}>{purpose || 'N/A'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.purposeHint}>{getPurposeHint(purpose)}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Write a prompt (optional):</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Write something that matches my vibe"
          placeholderTextColor="#888"
          multiline
          value={userPrompt}
          onChangeText={setUserPrompt}
        />
        <Text style={styles.helperText}>
          Tell us what you’d like to generate. This will help the AI better understand your intention.
          {'\n\n'}
          Example: "Write a short paragraph that reflects my personality"
          {'\n'}
          Example: "Generate something creative I can post"
        </Text>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.button} onPress={handleGenerate}>
          <Text style={styles.buttonText}>Generate</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <ActivityIndicator color="#E2B64D" size="large" style={{ marginTop: 20 }} />
      )}

      {generatedText ? (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.likedPhotosContainer}>
            {likedPhotos.map((photo, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Text style={styles.rankBadge}>#{photo.rank}</Text>
                <View style={styles.imageBorder}>
                  <Image
                    source={{ uri: photo.image }}
                    style={styles.likedImage}
                    resizeMode="cover"
                  />
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.resultBox}>
            <Text style={styles.resultText}>{generatedText}</Text>
          </View>
        </>
      ) : null}

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#0d0d1a',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E2B64D',
    marginBottom: 30,
    textAlign: 'center',
    paddingTop: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E2B64D',
    marginBottom: 6,
  },
  value: {
    fontSize: 16,
    color: '#fff',
    backgroundColor: '#1c1c2e',
    padding: 10,
    borderRadius: 8,
  },
  purposeHint: {
    fontSize: 15,
    color: '#E2B64D',
    backgroundColor: '#1a1a2e',
    padding: 12,
    borderRadius: 10,
    lineHeight: 22,
  },
  input: {
    backgroundColor: '#1c1c2e',
    color: '#fff',
    borderWidth: 1,
    borderColor: '#E2B64D',
    borderRadius: 10,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  helperText: {
    color: '#999',
    fontSize: 13,
    marginTop: 8,
    lineHeight: 18,
  },
  button: {
    backgroundColor: '#E2B64D',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#0d0d1a',
    fontWeight: 'bold',
    fontSize: 16,
  },
  likedPhotosContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  imageWrapper: {
    marginRight: 12,
    alignItems: 'center',
  },
  imageBorder: {
    borderColor: '#E2B64D',
    borderWidth: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  likedImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  rankBadge: {
    color: '#E2B64D',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  resultBox: {
    backgroundColor: '#1c1c2e',
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
  },
  resultText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 22,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    fontSize: 14,
  },
});

export default GenerateResultScreen;
