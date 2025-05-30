import React, { useRef, useState, useEffect } from 'react';
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
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;

const ResultsDisplay = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { photos = [], purpose } = route.params || {};

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
      console.log('🟡 Liked indexes:', likedIndexes);

      const likedLabels = likedIndexes.flatMap(index => {
        const photo = photos[index];
        console.log(`📸 Index ${index} labels:`, photo?.labels || []);
        return photo?.labels || [];
      });

      const uniqueLabels = [...new Set(likedLabels)];
      console.log('🧠 Positive labels from liked photos (raw):', likedLabels);
      console.log('🔗 All liked labels (deduplicated):', uniqueLabels);
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

    setHideCard(true); // ⛔️ הסתרה מיידית

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
        setTimeout(() => setHideCard(false), 10); // ✅ הצגת הקלף הבא
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
    return (
      <View style={styles.endScreen}>
        <Text style={styles.endText}>You've reached the end!</Text>
        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <Text style={styles.buttonText}>Try Again with New Photos</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Photos Ranked</Text>
      <View style={styles.swiperContainer}>{renderPhotoCard()}</View>
      <Text style={styles.swipeHint}>Swipe right if you like it, left if you don’t</Text>

      <View style={styles.feedbackWrapper}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Why These Rankings Work for {purpose}
          </Text>
          <Text style={styles.cardText}>
            Feedback will appear here once it's generated by our AI engine.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          {isLoading ? (
            <View style={styles.button}>
              <ActivityIndicator size="small" color="#1a1a2e" />
            </View>
          ) : (
            <TouchableOpacity style={styles.button} onPress={handlePress}>
              <Text style={styles.buttonText}>Try Again with New Photos</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#0a0a23',
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'gold',
    paddingTop: 40,
    textAlign: 'center',
  },
  swiperContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    backgroundColor: 'gold',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  rankText: {
    color: '#1a1a2e',
    fontWeight: 'bold',
    fontSize: 16,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
  },
  scoreContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
    borderRadius: 5,
  },
  scoreText: {
    color: 'gold',
    fontWeight: 'bold',
  },
  swipeHint: {
    color: 'gold',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
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
  overlayLabel: {
    fontSize: 32,
    fontWeight: 'bold',
    padding: 10,
    borderRadius: 10,
  },
  likeLabel: {
    color: 'green',
    backgroundColor: 'rgba(0,255,0,0.2)',
  },
  nopeLabel: {
    color: 'red',
    backgroundColor: 'rgba(255,0,0,0.2)',
  },
  feedbackWrapper: {
    marginTop: 20,
    gap: 12,
  },
  card: {
    backgroundColor: '#2b2b3c',
    padding: 16,
    borderRadius: 10,
  },
  cardTitle: {
    fontSize: 18,
    color: 'gold',
    fontWeight: '600',
    marginBottom: 8,
  },
  cardText: {
    color: '#ddd',
    fontSize: 14,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    height: 50,
    paddingBottom: 100,
  },
  button: {
    backgroundColor: 'gold',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    minWidth: 250,
  },
  buttonText: {
    color: '#1a1a2e',
    fontWeight: 'bold',
    fontSize: 16,
  },
  endScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#0a0a23',
  },
  endText: {
    fontSize: 24,
    color: 'gold',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default ResultsDisplay;
