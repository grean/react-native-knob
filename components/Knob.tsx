/* eslint-disable quotes */
import * as React from 'react';
import { Dimensions, View, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

import Cursor from './Cursor';

const {
  Value, multiply, sub, concat, lessThan, cond, add,
} = Animated;

const { PI } = Math;

const { width } = Dimensions.get('window');
const marginWidth = 16;
const canvasSize = width - marginWidth * 2;
const padding = 25;
const radius = canvasSize / 2 - padding;
const startX = radius;
const startY = 0;
// const startAngle = PI / 2;
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default () => {
  const start = new Value(PI / 2);
  // const start = new Value(PI / 2);
  const end = new Value(0);
  // const end = new Value(PI / 2);
  const circumference = radius * 2 * PI;
  const delta =
    sub(
      cond(lessThan(start, end),
        end,
        add(end, PI * 2)
      ),
      start
    );

  // const strokeDashoffset = multiply(end, radius);
  const strokeDashoffset = multiply(delta, radius);
  const rotateZ = concat(sub(Math.PI * 2, start), 'rad');
  return (
    <View style={styles.container}>
      <Animated.View style={{
        ...StyleSheet.absoluteFillObject,
        transform: [
          { rotateZ },
        ],
      }}
      >
        <Svg width={canvasSize} height={canvasSize}>
          <Defs>
            <LinearGradient id="grad" x1="0" y1="0" x2="100%" y2="0">
              <Stop offset="0" stopColor="#f7cd46" />
              <Stop offset="1" stopColor="#ef9837" />
            </LinearGradient>
          </Defs>
          <AnimatedCircle
            strokeWidth={padding * 2}
            stroke="rgb(50, 50, 50)"
            fill="none"
            cx={canvasSize / 2}
            cy={canvasSize / 2}
            r={radius}
          />
          <AnimatedCircle
            strokeWidth={padding * 2}
            stroke="url(#grad)"
            fill="none"
            cx={canvasSize / 2}
            cy={canvasSize / 2}
            r={radius}
            strokeDasharray={`${circumference}, ${circumference}`}
            {...{ strokeDashoffset }}

          />
        </Svg>
      </Animated.View>
      {/* <Cursor angle={start} {...{ radius }} /> */}
      <Cursor angle={end} {...{ radius, startX, startY }} />
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
