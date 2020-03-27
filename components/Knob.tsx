import * as React from 'react';
import { Dimensions, View, StyleSheet } from 'react-native';

import CircularProgress from './CircularProgress';

const { PI } = Math;
const { width } = Dimensions.get('window');
const margin = 50;
const canvasSize = width - margin;
const strokeWidth = 90;
const defaultAngle = 0;
const rotation = -PI / 2;
const defaultValue = 33;
const fullKnobValue = 100;
const padding = 64;
const strokeWidthDecoration = 30;
const negative = true;
const colors = ['#F0EFF5', '#00b5ad', '#2185D0', '#B5CC18', '#FBBD08', '#F2711C', '#DB2828', '#E03997', '#6435C9', '#A5673F', '#AAA', '#888', '#666', '#444', '#222', '#000'];

export default () => {
  return (
    <View style={styles.container}>
      <CircularProgress {...{ canvasSize, strokeWidth, defaultAngle, rotation, defaultValue, fullKnobValue, padding, strokeWidthDecoration, negative, colors }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: canvasSize,
    width: canvasSize,
    // backgroundColor: '#555',
  },
});
