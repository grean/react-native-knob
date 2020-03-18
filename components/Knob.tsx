/* eslint-disable quotes */
import * as React from 'react';
import { Dimensions, View, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import Cursor from './Cursor';
import Circle from './Circle';

const {
  Value, multiply, sub, concat, lessThan, cond, add,
} = Animated;

const { PI } = Math;

const { width } = Dimensions.get('window');
const marginWidth = 16;
const canvasSize = width - marginWidth * 2;
const strokeWidth = 50;
const radius = (canvasSize - strokeWidth) / 2;
const startX = radius;
const startY = 0;
// const startAngle = PI / 2;

export default () => {
  // const start = new Value(0);
  // const start = new Value(PI / 2);
  // const end = new Value(0);
  const end = new Value(PI / 2);

  return (
    <View style={styles.container}>
      <Circle angle={end} {...{ radius, startX, startY, canvasSize, strokeWidth }} />
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
