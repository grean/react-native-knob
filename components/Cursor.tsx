import * as React from 'react';
import Animated from 'react-native-reanimated';
import { StyleSheet } from 'react-native';

interface CursorProps {
  x: Animated.Node<number>;
  y: Animated.Node<number>;
  strokeWidth: number;
}

export default ({ x, y, strokeWidth }: CursorProps) => {
  return (
    <Animated.View
      style={{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'white',
        width: strokeWidth,
        height: strokeWidth,
        borderRadius: strokeWidth / 2,
        transform: [
          { translateX: x },
          { translateY: y },
        ],
      }}
    />
  );
};
