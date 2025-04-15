import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

// AppLogo component
// This component renders the app's logo with a central icon and decorative elements on the sides.
const AppLogo = ({ className = "" }) => {
  return (
    <View style={styles.container}>
      {/* Main logo container */}
      <View style={styles.logoContainer}>
        {/* Wrapper for the central icon */}
        <View style={styles.iconWrapper}>
          {/* Box containing the main logo */}
          <View style={styles.logoBox}>
            <Svg
              width={40} // Width of the SVG
              height={40} // Height of the SVG
              viewBox="0 0 24 24" // Viewbox dimensions for the SVG
              fill="none" // No fill color for the SVG
              stroke="gold" // Gold stroke color
              strokeWidth="2" // Stroke width for the SVG paths
              strokeLinecap="round" // Rounded line caps
              strokeLinejoin="round" // Rounded line joins
            >
              {/* Camera icon path */}
              <Path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
              {/* Circle representing the camera lens */}
              <Circle cx="12" cy="13" r="3" />
            </Svg>
          </View>
        </View>

        {/* Decorative elements around the logo */}
        {/* Left decorative element */}
        <View style={styles.sideIconLeft}>
          <Svg
            viewBox="0 0 24 24"
            width={16} // Width of the left decoration
            height={24} // Height of the left decoration
            fill="gold" // Gold fill color
            style={{ transform: [{ rotate: "-90deg" }] }} // Rotate the decoration -90 degrees
          >
            <Path d="M12,20.7C9.2,20.7,7,18.5,7,15.7c0-1.9,1.1-3.6,2.7-4.4c0.5-0.2,1.1-0.4,1.7-0.4c0.6,0,1.2,0.1,1.7,0.4  c1.6,0.8,2.6,2.5,2.6,4.4C15.7,18.5,13.5,20.7,12,20.7z M13.7,12.1c-0.5-0.3-1.1-0.4-1.7-0.4c-0.6,0-1.2,0.1-1.7,0.4  c-1,0.5-1.8,1.5-2,2.6c0,0.1,0,0.3,0,0.4c0,2,1.6,3.7,3.7,3.7s3.7-1.6,3.7-3.7c0-0.1,0-0.3,0-0.4C15.5,13.6,14.7,12.6,13.7,12.1z" />
            <Path d="M11.1,9.5c0,0.5-0.4,0.9-0.9,0.9s-0.9-0.4-0.9-0.9s0.4-0.9,0.9-0.9S11.1,9,11.1,9.5z" />
            <Path d="M9.9,7.5C9.4,7,9.1,6.3,9.1,5.5c0-1.4,1.1-2.5,2.5-2.5s2.5,1.1,2.5,2.5c0,0.8-0.4,1.5-0.9,2" />
          </Svg>
        </View>

        {/* Right decorative element */}
        <View style={styles.sideIconRight}>
          <Svg
            viewBox="0 0 24 24"
            width={16} // Width of the right decoration
            height={24} // Height of the right decoration
            fill="gold" // Gold fill color
            style={{ transform: [{ rotate: "90deg" }] }} // Rotate the decoration 90 degrees
          >
            <Path d="M12,20.7C9.2,20.7,7,18.5,7,15.7c0-1.9,1.1-3.6,2.7-4.4c0.5-0.2,1.1-0.4,1.7-0.4c0.6,0,1.2,0.1,1.7,0.4  c1.6,0.8,2.6,2.5,2.6,4.4C15.7,18.5,13.5,20.7,12,20.7z M13.7,12.1c-0.5-0.3-1.1-0.4-1.7-0.4c-0.6,0-1.2,0.1-1.7,0.4  c-1,0.5-1.8,1.5-2,2.6c0,0.1,0,0.3,0,0.4c0,2,1.6,3.7,3.7,3.7s3.7-1.6,3.7-3.7c0-0.1,0-0.3,0-0.4C15.5,13.6,14.7,12.6,13.7,12.1z" />
            <Path d="M11.1,9.5c0,0.5-0.4,0.9-0.9,0.9s-0.9-0.4-0.9-0.9s0.4-0.9,0.9-0.9S11.1,9,11.1,9.5z" />
            <Path d="M9.9,7.5C9.4,7,9.1,6.3,9.1,5.5c0-1.4,1.1-2.5,2.5-2.5s2.5,1.1,2.5,2.5c0,0.8-0.4,1.5-0.9,2" />
          </Svg>
        </View>
      </View>
    </View>
  );
};

// Styles for the AppLogo component
const styles = StyleSheet.create({
  container: {
    position: 'relative', // Allows absolute positioning of child elements
    alignItems: 'center', // Centers child elements horizontally
  },
  logoContainer: {
    width: 80, // Width of the logo container
    height: 80, // Height of the logo container
    position: 'relative', // Allows absolute positioning of child elements
    justifyContent: 'center', // Centers child elements vertically
    alignItems: 'center', // Centers child elements horizontally
  },
  iconWrapper: {
    position: 'absolute', // Ensures the icon is positioned relative to the container
    inset: 0, // Stretches the wrapper to fill the container
    justifyContent: 'center', // Centers the icon vertically
    alignItems: 'center', // Centers the icon horizontally
  },
  logoBox: {
    width: 64, // Width of the logo box
    height: 64, // Height of the logo box
    backgroundColor: '#001f3f', // Navy background color
    borderWidth: 2, // Border width
    borderColor: 'gold', // Gold border color
    borderRadius: 8, // Rounded corners
    justifyContent: 'center', // Centers the icon vertically
    alignItems: 'center', // Centers the icon horizontally
  },
  sideIconLeft: {
    position: 'absolute', // Positions the decoration relative to the container
    left: -8, // Moves the decoration slightly to the left
    top: '50%', // Centers the decoration vertically
    marginTop: -12, // Adjusts the vertical alignment
  },
  sideIconRight: {
    position: 'absolute', // Positions the decoration relative to the container
    right: -8, // Moves the decoration slightly to the right
    top: '50%', // Centers the decoration vertically
    marginTop: -12, // Adjusts the vertical alignment
  },
});

export default AppLogo;
