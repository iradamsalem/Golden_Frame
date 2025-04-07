import React, { useRef, useState } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';

const { width } = Dimensions.get('window');

const Carousel = ({ children }) => {
  const scrollViewRef = useRef();
  const [index, setIndex] = useState(0);

  const handleScroll = (event) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(scrollX / width);
    setIndex(newIndex);
  };

  const scrollTo = (direction) => {
    if (!scrollViewRef.current) return;
    const newIndex = direction === 'next' ? index + 1 : index - 1;
    const offset = newIndex * width;
    scrollViewRef.current.scrollTo({ x: offset, animated: true });
    setIndex(newIndex);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
      >
        {React.Children.map(children, (child, idx) => (
          <View style={{ width }} key={idx}>
            {child}
          </View>
        ))}
      </ScrollView>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.arrowButton}
          onPress={() => scrollTo('prev')}
          disabled={index === 0}
        >
          <Text style={styles.arrowText}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.arrowButton}
          onPress={() => scrollTo('next')}
          disabled={index === React.Children.count(children) - 1}
        >
          <Text style={styles.arrowText}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    position: 'relative',
  },
  controls: {
    position: 'absolute',
    width: '100%',
    bottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  arrowButton: {
    backgroundColor: '#FFD700',
    padding: 10,
    borderRadius: 20,
  },
  arrowText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
});

export default Carousel;
