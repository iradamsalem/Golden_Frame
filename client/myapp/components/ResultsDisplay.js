import React, { useRef, useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  PanResponder,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { API_BASE_URL } from '../config';
import { UserContext } from '../contexts/UserContext';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;

const ResultsDisplay = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { photos = [], purpose } = route.params || {};
  const { user } = useContext(UserContext);

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(0);
  const [likedIndexes, setLikedIndexes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showEndScreen, setShowEndScreen] = useState(false);
  const [hideCard, setHideCard] = useState(false);

  const position = useRef(new Animated.ValueXY()).current;

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    if (showEndScreen) {
      const likedLabels = likedIndexes.flatMap(index => {
        const photo = photos[index];
        return photo?.labels || [];
      });

      const uniqueLabels = [...new Set(likedLabels)];

      if (user?.email && purpose && uniqueLabels.length > 0) {
        fetch(`${API_BASE_URL}/api/favorite-labels`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            purpose,
            labels: uniqueLabels,
          }),
        })
          .then(res => res.json())
          .then(data => {
            console.log('✅ Labels saved:', data);
          })
          .catch(err => {
            console.error('❌ Error saving favorite labels:', err);
          });
      }
    }
  }, [showEndScreen]);

  const handlePress = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate('UploadPhotos');
    }, 1000);
  };

  const swipe = (direction) => {
    const liked = direction === 'right';
    const indexNow = currentIndexRef.current;

    setHideCard(true);

    Animated.timing(position, {
      toValue: {
        x: liked ? SCREEN_WIDTH + 100 : -SCREEN_WIDTH - 100,
        y: 0,
      },
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
      position.setValue({ x: 0, y: 0 });

      const nextIndex = indexNow + 1;

      if (liked && photos[indexNow]) {
        setLikedIndexes((prev) => [...prev, indexNow]);
      }

      if (nextIndex >= photos.length) {
        setShowEndScreen(true);
      } else {
        currentIndexRef.current = nextIndex;
        setCurrentIndex(nextIndex);
        setTimeout(() => setHideCard(false), 10);
      }
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          swipe('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          swipe('left');
        } else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const likeOpacity = position.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const renderPhotoCard = () => {
    if (showEndScreen || currentIndex >= photos.length) return null;

    const photo = photos[currentIndex];

    return (
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.cardContainer,
          {
            opacity: hideCard ? 0 : 1,
            transform: [
              {
                rotate: position.x.interpolate({
                  inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
                  outputRange: ['-20deg', '0deg', '20deg'],
                }),
              },
              ...position.getTranslateTransform(),
            ],
          },
        ]}
      >
        <View style={styles.overlayLabelContainer}>
          <Animated.Text style={[styles.overlayLabel, styles.likeLabel, { opacity: likeOpacity }]}>
            LIKE
          </Animated.Text>
          <Animated.Text style={[styles.overlayLabel, styles.nopeLabel, { opacity: nopeOpacity }]}>
            NOPE
          </Animated.Text>
        </View>

        <View style={styles.rankBadge}>
          <Text style={styles.rankText}>{photo.rank}</Text>
        </View>
        <Image source={{ uri: photo.image }} style={styles.image} resizeMode="contain" />
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>Score: {Math.round(photo.score)}%</Text>
        </View>
      </Animated.View>
    );
  };

  if (showEndScreen) {
    const likedLabels = likedIndexes
      .flatMap(index => photos[index]?.labels || [])
      .filter(Boolean);

    const likedPhotos = likedIndexes.map(index => photos[index]); // ✅ NEW LINE

    return (
      <ImageBackground source={require('../assets/texture-bg.png')} style={styles.background}>
        <View style={styles.endScreen}>
          <Text style={styles.endText}>You've reached the end!</Text>

          <TouchableOpacity style={styles.button} onPress={handlePress}>
            <Text style={styles.buttonText}>Try Again with New Photos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { marginTop: 15 }]}
            onPress={() =>
              navigation.navigate('GenerateResult', {
                purpose,
                likedLabels,
                likedPhotos, // ✅ ADD THIS
              })
            }
          >
            <Text style={styles.buttonText}>Generate Result</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={require('../assets/texture-bg.png')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Your Photos Ranked</Text>
        <View style={styles.swiperContainer}>{renderPhotoCard()}</View>
        <Text style={styles.swipeHint}>Swipe right if you like it, left if you don't</Text>

        <View style={styles.feedbackWrapper}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Why These Rankings Work for {purpose}</Text>
            <Text style={styles.cardText}>
              Feedback will appear here once it's generated by our AI engine.
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            {isLoading ? (
              <View style={styles.button}>
                <ActivityIndicator size="small" color="#fff" />
              </View>
            ) : (
              <TouchableOpacity style={styles.button} onPress={handlePress}>
                <Text style={styles.buttonText}>Try Again with New Photos</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    resizeMode: 'cover',
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: { padding: 20, flex: 1 },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#E2B64D',
    paddingTop: 40,
    textAlign: 'center',
  },
  swiperContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  cardContainer: {
    width: '100%',
    height: 400,
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#E2B64D',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  rankText: { color: '#1a1a2e', fontWeight: 'bold', fontSize: 16 },
  image: { width: '100%', height: 300, borderRadius: 10 },
  scoreContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
    borderRadius: 5,
  },
  scoreText: { color: '#E2B64D', fontWeight: 'bold' },
  swipeHint: { color: '#ccc', fontSize: 14, textAlign: 'center', marginTop: 10 },
  overlayLabelContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    zIndex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  overlayLabel: { fontSize: 32, fontWeight: 'bold', padding: 10, borderRadius: 10 },
  likeLabel: { color: '#4CAF50', backgroundColor: 'rgba(76,175,80,0.2)' },
  nopeLabel: { color: '#f44336', backgroundColor: 'rgba(244,67,54,0.2)' },
  feedbackWrapper: { marginTop: 20, gap: 12 },
  card: { padding: 16, borderRadius: 10 },
  cardTitle: { fontSize: 18, color: '#E2B64D', fontWeight: '600', marginBottom: 8 },
  cardText: { color: '#ccc', fontSize: 14 },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    height: 50,
    paddingBottom: 100,
  },
  button: {
    backgroundColor: '#E2B64D',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    minWidth: 250,
  },
  buttonText: { color: '#1a1a2e', fontWeight: 'bold', fontSize: 16 },
  endScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  endText: {
    fontSize: 24,
    color: '#E2B64D',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default ResultsDisplay;
