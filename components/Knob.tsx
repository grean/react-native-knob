import * as React from 'react';
import { Dimensions, View, StyleSheet } from 'react-native';

import CircularProgress from './CircularProgress';

const { PI } = Math;
const { width } = Dimensions.get('window');
const margin = 50;
const canvasSize = width - margin;
const strokeWidth = 50;
const defaultAngle = PI / 2;
const rotation = -PI / 2;

export default () => {
  return (
    <View style={styles.container}>
      <CircularProgress {...{ canvasSize, strokeWidth, defaultAngle, rotation }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: canvasSize,
    width: canvasSize,
  },
});
