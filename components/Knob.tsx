/* eslint-disable quotes */
import * as React from 'react';
import { Dimensions, View, StyleSheet } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';
import { timing } from "react-native-redash";

import Cursor from './Cursor';
import Circle from './Circle';
import CircularProgress from './CircularProgress';

const {
  Value, multiply, sub, concat, lessThan, cond, add, Clock,
} = Animated;

const { PI } = Math;

const { width } = Dimensions.get('window');
const marginWidth = 16;
const canvasSize = width - marginWidth * 2;
const strokeWidth = 50;
const radius = (canvasSize - strokeWidth) / 2;
// const startX = 0;
const startX = canvasSize / 2;
// const startY = 0;
const startY = strokeWidth / 2;
// const startAngle = PI / 2;

export default () => {
  // const start = new Value(0);
  // const start = new Value(PI / 2);
  // const end = new Value(0);
  const end = new Value(0);

  const clock = new Clock();
  const config = {
    clock,
    from: 0,
    duration: 10 * 1000,
    toValue: 1,
    easing: Easing.linear,
  };

  return (
    <View style={styles.container}>
      <CircularProgress progress={timing(config)} />
      {/* <Circle angle={end} {...{ radius, startX, startY, canvasSize, strokeWidth }} /> */}
      {/* <Cursor angle={end} {...{ radius, startX, startY, strokeWidth }} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: canvasSize,
    width: canvasSize,
    backgroundColor: "rgb(25, 25, 25)",
  },
});
