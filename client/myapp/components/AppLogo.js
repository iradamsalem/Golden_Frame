import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

const AppLogo = ({ className = "" }) => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.iconWrapper}>
          <View style={styles.logoBox}>
            <Svg
              width={40}
              height={40}
              viewBox="0 0 24 24"
              fill="none"
              stroke="gold"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <Path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
              <Circle cx="12" cy="13" r="3" />
            </Svg>
          </View>
        </View>

        {/* קישוטים סביב הלוגו – דורשים תרגום ל־React Native, ניתן להחסיר או לעצב מחדש */}

        <View style={styles.sideIconLeft}>
          <Svg viewBox="0 0 24 24" width={16} height={24} fill="gold" style={{ transform: [{ rotate: "-90deg" }] }}>
            <Path d="M12,20.7C9.2,20.7,7,18.5,7,15.7c0-1.9,1.1-3.6,2.7-4.4c0.5-0.2,1.1-0.4,1.7-0.4c0.6,0,1.2,0.1,1.7,0.4  c1.6,0.8,2.6,2.5,2.6,4.4C15.7,18.5,13.5,20.7,12,20.7z M13.7,12.1c-0.5-0.3-1.1-0.4-1.7-0.4c-0.6,0-1.2,0.1-1.7,0.4  c-1,0.5-1.8,1.5-2,2.6c0,0.1,0,0.3,0,0.4c0,2,1.6,3.7,3.7,3.7s3.7-1.6,3.7-3.7c0-0.1,0-0.3,0-0.4C15.5,13.6,14.7,12.6,13.7,12.1z" />
            <Path d="M11.1,9.5c0,0.5-0.4,0.9-0.9,0.9s-0.9-0.4-0.9-0.9s0.4-0.9,0.9-0.9S11.1,9,11.1,9.5z" />
            <Path d="M9.9,7.5C9.4,7,9.1,6.3,9.1,5.5c0-1.4,1.1-2.5,2.5-2.5s2.5,1.1,2.5,2.5c0,0.8-0.4,1.5-0.9,2" />
          </Svg>
        </View>

        <View style={styles.sideIconRight}>
          <Svg viewBox="0 0 24 24" width={16} height={24} fill="gold" style={{ transform: [{ rotate: "90deg" }] }}>
            <Path d="M12,20.7C9.2,20.7,7,18.5,7,15.7c0-1.9,1.1-3.6,2.7-4.4c0.5-0.2,1.1-0.4,1.7-0.4c0.6,0,1.2,0.1,1.7,0.4  c1.6,0.8,2.6,2.5,2.6,4.4C15.7,18.5,13.5,20.7,12,20.7z M13.7,12.1c-0.5-0.3-1.1-0.4-1.7-0.4c-0.6,0-1.2,0.1-1.7,0.4  c-1,0.5-1.8,1.5-2,2.6c0,0.1,0,0.3,0,0.4c0,2,1.6,3.7,3.7,3.7s3.7-1.6,3.7-3.7c0-0.1,0-0.3,0-0.4C15.5,13.6,14.7,12.6,13.7,12.1z" />
            <Path d="M11.1,9.5c0,0.5-0.4,0.9-0.9,0.9s-0.9-0.4-0.9-0.9s0.4-0.9,0.9-0.9S11.1,9,11.1,9.5z" />
            <Path d="M9.9,7.5C9.4,7,9.1,6.3,9.1,5.5c0-1.4,1.1-2.5,2.5-2.5s2.5,1.1,2.5,2.5c0,0.8-0.4,1.5-0.9,2" />
          </Svg>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
  },
  logoContainer: {
    width: 80,
    height: 80,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    position: 'absolute',
    inset: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBox: {
    width: 64,
    height: 64,
    backgroundColor: '#001f3f', // navy
    borderWidth: 2,
    borderColor: 'gold',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sideIconLeft: {
    position: 'absolute',
    left: -8,
    top: '50%',
    marginTop: -12,
  },
  sideIconRight: {
    position: 'absolute',
    right: -8,
    top: '50%',
    marginTop: -12,
  },
});

export default AppLogo;
