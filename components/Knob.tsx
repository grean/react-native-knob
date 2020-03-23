/* eslint-disable quotes */
import * as React from 'react';
import { Dimensions, View, StyleSheet } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';
import { timing } from "react-native-redash";

import CircularProgress from './CircularProgress';

const {
  Value, multiply, sub, concat, lessThan, cond, add, Clock,
} = Animated;

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
