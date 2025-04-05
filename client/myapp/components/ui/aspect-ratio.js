import React from 'react';
import { View } from 'react-native';

const AspectRatio = ({ ratio = 1, children, style }) => {
  return (
    <View style={[{ aspectRatio: ratio, width: '100%' }, style]}>
      {children}
    </View>
  );
};

export default AspectRatio;
