// GenerateResultScreen.js
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
  Platform,
  Share as RNShare,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Clipboard from 'expo-clipboard';
import { API_BASE_URL } from '../config';

/* ---------------- Helpers ---------------- */

const getPurposeHint = (purpose) => {
  const key = (purpose || '').toLowerCase().trim();
  switch (key) {
    case 'instagram':
      return '📸 Generate stylish captions tailored for Instagram posts.';
    case 'facebook':
      return '👥 Create a warm, social post that fits events and memories.';
    case 'twitter':
    case 'twitter/x':
    case 'x':
      return '🐦 Short, witty statements that stand out in minimal format.';
    case 'linkedin':
      return '💼 Professional, concise copy suitable for LinkedIn.';
    case 'dating':
    case 'dating apps':
      return '💘 Fun, honest, confident lines for your dating profile.';
    case 'resume':
      return '📄 A clean, strong professional summary.';
    default:
      return '🧠 Personalized content based on your photos and preferences.';
  }
};

/* ---- robust retries for /api/generate ---- */
const MAX_RETRIES = 6;
const BASE_DELAY_MS = 300;
const REQ_TIMEOUT_MS = 12000;
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
const isRetryableStatus = (s) => !s || s >= 500 || s === 429 || s === 408;
const nextDelay = (attempt) => BASE_DELAY_MS * attempt + Math.floor(Math.random() * 200);

/** download remote/data: image to a local file:// in cache */
async function downloadToCache(uri) {
  try {
    const isPng = uri?.toLowerCase?.().includes('.png') || uri?.startsWith?.('data:image/png');
    const ext = isPng ? 'png' : 'jpg';
    const target = `${FileSystem.cacheDirectory}${Date.now()}_${Math.random()
      .toString(36)
      .slice(2)}.${ext}`;

    if (uri?.startsWith?.('data:image/')) {
      const base64 = uri.split(',')[1];
      await FileSystem.writeAsStringAsync(target, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return target;
    }

    const res = await FileSystem.downloadAsync(uri, target);
    return res.uri;
  } catch (e) {
    console.warn('downloadToCache failed', e);
    return null;
  }
}

/* ---------------- Screen ---------------- */

const GenerateResultScreen = () => {
  const route = useRoute();
  const { purpose, likedLabels = [], likedPhotos = [] } = route.params || {};

  const [userPrompt, setUserPrompt] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [caption, setCaption] = useState(''); // editable caption
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sharingAvailable, setSharingAvailable] = useState(false);
  const [selectedUri, setSelectedUri] = useState(null); // chosen image for post
  const [previewAspect, setPreviewAspect] = useState(null); // width/height for contain preview

  useEffect(() => {
    (async () => {
      try {
        const avail = await Sharing.isAvailableAsync();
        setSharingAvailable(!!avail);
      } catch {
        setSharingAvailable(false);
      }
    })();
  }, []);

  // default selection = highest-ranked image (if exists)
  const leadPhoto = useMemo(() => {
    if (!Array.isArray(likedPhotos) || likedPhotos.length === 0) return null;
    const copy = [...likedPhotos];
    copy.sort((a, b) => ((a?.rank ?? 999) - (b?.rank ?? 999)));
    return copy[0] || null;
  }, [likedPhotos]);

  useEffect(() => {
    if (leadPhoto?.image && !selectedUri) {
      setSelectedUri(leadPhoto.image);
    }
  }, [leadPhoto, selectedUri]);

  // compute natural aspect ratio for perfect "contain" preview (no cropping)
  useEffect(() => {
    if (!selectedUri) return;
    Image.getSize(
      selectedUri,
      (w, h) => setPreviewAspect(w > 0 && h > 0 ? w / h : null),
      () => setPreviewAspect(null)
    );
  }, [selectedUri]);

  const handleGenerate = async () => {
    setLoading(true);
    setGeneratedText('');
    setCaption('');
    setError('');

    const url = `${API_BASE_URL}/api/generate`;
    const payload = { purpose, prompt: userPrompt, labels: likedLabels };

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timeoutId = controller ? setTimeout(() => controller.abort(), REQ_TIMEOUT_MS) : null;

      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          ...(controller ? { signal: controller.signal } : {}),
        });
        if (timeoutId) clearTimeout(timeoutId);

        let data = {};
        try { data = await res.json(); } catch {}

        if (res.ok && data?.result) {
          setGeneratedText(data.result);
          setCaption(data.result); // make it editable
          setLoading(false);
          return;
        }

        if (isRetryableStatus(res.status) && attempt < MAX_RETRIES) {
          await sleep(nextDelay(attempt));
          continue;
        }

        setError(data?.error || `Request failed (HTTP ${res.status || 'unknown'})`);
        setLoading(false);
        return;

      } catch (err) {
        if (timeoutId) clearTimeout(timeoutId);

        if (attempt < MAX_RETRIES) {
          await sleep(nextDelay(attempt));
          continue;
        }

        setError('Network error. Please try again shortly.');
        setLoading(false);
        return;
      }
    }

    setLoading(false);
  };

  /* ---------- Share flows ---------- */

  // Share only the SELECTED image + copy caption
  const shareSelectedImage = async () => {
    try {
      if (!caption?.trim()) {
        Alert.alert('No caption', 'Write or generate a caption first.');
        return;
      }
      if (!selectedUri) {
        Alert.alert('No image selected', 'Pick your favorite image to share.');
        return;
      }
      if (!sharingAvailable) {
        Alert.alert('Sharing unavailable', 'System share sheet is not available on this device.');
        return;
      }

      setBusy(true);

      const isLocal = typeof selectedUri === 'string' && selectedUri.startsWith('file://');
      const localUri = isLocal ? selectedUri : await downloadToCache(selectedUri);
      if (!localUri) {
        Alert.alert('Error', 'Failed to prepare the selected image.');
        return;
      }

      try { await Clipboard.setStringAsync(caption); } catch {}

      await Sharing.shareAsync(localUri, {
        mimeType: Platform.OS === 'ios' ? 'image/jpeg' : 'image/*',
        dialogTitle: 'Share image',
        UTI: 'public.jpeg',
      });

      Alert.alert('Copied!', 'Caption copied. Paste it in the app’s caption field.');

    } catch (e) {
      console.warn('shareSelectedImage error', e);
      Alert.alert('Error', 'Could not share the image.');
    } finally {
      setBusy(false);
    }
  };

  // Share caption only (good for LinkedIn / dating apps that accept text shares)
  const shareCaptionOnly = async () => {
    try {
      if (!caption?.trim()) {
        Alert.alert('No caption', 'Write or generate a caption first.');
        return;
      }
      setBusy(true);
      await Clipboard.setStringAsync(caption);
      await RNShare.share({ message: caption });
    } catch (e) {
      console.warn('shareCaptionOnly error', e);
    } finally {
      setBusy(false);
    }
  };

  const copyCaption = async () => {
    try {
      await Clipboard.setStringAsync(caption || '');
      Alert.alert('Copied', 'Caption copied to clipboard.');
    } catch {}
  };

  const isInstagram = (purpose || '').toLowerCase().trim() === 'instagram';

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

      {/* Prompt input */}
      <View style={styles.section}>
        <Text style={styles.label}>Write a prompt (optional):</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Write something that matches my vibe"
          placeholderTextColor="#888"
          multiline
          value={userPrompt}
          onChangeText={setUserPrompt}
        />
        <Text style={styles.helperText}>
          Tell us what you’d like to generate so the AI understands your intention.
          {'\n\n'}
          Example: "Write a short paragraph that reflects my personality"
          {'\n'}
          Example: "Generate something creative I can post"
        </Text>
      </View>

      {/* Generate button */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.button} onPress={handleGenerate}>
          <Text style={styles.buttonText}>Generate</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator color="#E2B64D" size="large" style={{ marginTop: 20 }} />}

      {/* Results area */}
      {!!generatedText && (
        <>
          {/* Image picker: choose favorite */}
          <View style={[styles.section, { marginBottom: 12 }]}>
            <Text style={[styles.label, { marginBottom: 8 }]}>Choose your favorite image:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.likedPhotosContainer}>
              {likedPhotos.map((photo, idx) => {
                const uri = photo?.image;
                const isSelected = selectedUri === uri;
                return (
                  <TouchableOpacity key={idx} onPress={() => setSelectedUri(uri)} style={styles.imageWrapper}>
                    <View style={[styles.imageBorder, isSelected && styles.imageBorderSelected]}>
                      <Image source={{ uri }} style={styles.likedImage} resizeMode="cover" />
                    </View>
                    <Text style={[styles.rankBadge, isSelected && { color: '#8EE5A1' }]}>
                      {isSelected ? 'Selected' : `#${photo?.rank ?? ''}`}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Large preview - no cropping */}
            {selectedUri ? (
              <View style={styles.previewWrapper}>
                <Image
                  source={{ uri: selectedUri }}
                  style={[
                    styles.previewImage,
                    previewAspect ? { aspectRatio: previewAspect } : { height: 250 },
                  ]}
                  resizeMode="contain"
                />
              </View>
            ) : null}
          </View>

          {/* Editable caption */}
          <View style={styles.section}>
            <Text style={styles.label}>Edit caption:</Text>
            <TextInput
              style={[styles.input, { minHeight: 120 }]}
              placeholder="Edit your caption here..."
              placeholderTextColor="#888"
              multiline
              value={caption}
              onChangeText={setCaption}
            />
            <View style={{ flexDirection: 'row', marginTop: 8 }}>
              <TouchableOpacity onPress={copyCaption} style={[styles.button, { flexGrow: 1 }]}>
                <Text style={styles.buttonText}>Copy Caption</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Share actions */}
          <View style={styles.section}>
            {sharingAvailable && selectedUri ? (
              <TouchableOpacity
                disabled={busy}
                style={[styles.button, styles.shareButton, busy && { opacity: 0.6 }]}
                onPress={shareSelectedImage}
              >
                <Text style={styles.buttonTextDark}>
                  {busy ? 'Working…' : 'Share Selected Image'}
                </Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              disabled={busy}
              style={[styles.button, busy && { opacity: 0.6 }]}
              onPress={shareCaptionOnly}
            >
              <Text style={styles.buttonText}>
                {busy ? 'Working…' : 'Share Caption Only'}
              </Text>
            </TouchableOpacity>

            {isInstagram && (
              <Text style={styles.shareNote}>
                Tip: Instagram often ignores pre-filled text. We copy your caption so you can paste it during post creation.
              </Text>
            )}
          </View>
        </>
      )}

      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </ScrollView>
  );
};

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#0d0d1a' },
  title: {
    fontSize: 28, fontWeight: 'bold', color: '#E2B64D',
    marginBottom: 30, textAlign: 'center', paddingTop: 20,
  },
  section: { marginBottom: 24 },
  label: { fontSize: 16, fontWeight: '600', color: '#E2B64D', marginBottom: 6 },
  value: { fontSize: 16, color: '#fff', backgroundColor: '#1c1c2e', padding: 10, borderRadius: 8 },
  purposeHint: {
    fontSize: 15, color: '#E2B64D', backgroundColor: '#1a1a2e',
    padding: 12, borderRadius: 10, lineHeight: 22,
  },
  input: {
    backgroundColor: '#1c1c2e', color: '#fff', borderWidth: 1, borderColor: '#E2B64D',
    borderRadius: 10, padding: 12, minHeight: 100, textAlignVertical: 'top',
  },
  helperText: { color: '#999', fontSize: 13, marginTop: 8, lineHeight: 18 },
  button: {
    backgroundColor: '#E2B64D', padding: 14, borderRadius: 10,
    alignItems: 'center', marginTop: 10,
  },
  shareButton: { backgroundColor: '#8EE5A1' },
  buttonText: { color: '#0d0d1a', fontWeight: 'bold', fontSize: 16 },
  buttonTextDark: { color: '#0d0d1a', fontWeight: 'bold', fontSize: 16 },

  likedPhotosContainer: { marginTop: 10, marginBottom: 10 },
  imageWrapper: { marginRight: 12, alignItems: 'center' },
  imageBorder: { borderColor: '#E2B64D', borderWidth: 2, borderRadius: 10, overflow: 'hidden' },
  imageBorderSelected: { borderColor: '#8EE5A1', borderWidth: 3 },
  likedImage: { width: 100, height: 100, borderRadius: 10 },
  rankBadge: { color: '#E2B64D', marginTop: 6, fontWeight: 'bold' },

  // New: perfect preview box with contain (no cropping)
  previewWrapper: {
    marginTop: 8,
    width: '100%',
    backgroundColor: '#0b0f1a',
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewImage: {
    width: '100%',
    borderRadius: 12,
  },

  resultBox: { backgroundColor: '#1c1c2e', padding: 16, borderRadius: 10, marginTop: 20 },
  resultText: { color: '#fff', fontSize: 16, lineHeight: 22 },

  shareNote: { color: '#aaa', marginTop: 8, fontSize: 12 },
  errorText: { color: 'red', marginTop: 10, fontSize: 14 },
});

export default GenerateResultScreen;
