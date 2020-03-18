import * as React from 'react';
import Animated from 'react-native-reanimated';
import { atan2 } from 'react-native-redash';
import { State, TapGestureHandler } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

const {
  Value, event, block, cond, eq, set, add, sub, multiply, sin, cos, concat, lessThan, debug,
} = Animated;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const { PI } = Math;



interface CircleProps {
  radius: number;
  startX: number;
  startY: number;
  strokeWidth: number;
  canvasSize: number;
  // startAngle: number;
  angle: Animated.Value<number>;
}

export default ({ radius, angle, startX, startY, strokeWidth, canvasSize }: CircleProps) => {
  const α = new Value(0);
  const x = new Value(startX);
  const y = new Value(startY);
  const xOffset = new Value(startX);
  const yOffset = new Value(startY);
  const translateX = new Value(0);
  const translateY = new Value(0);
  // const translationX = new Value(0);
  // const translationY = new Value(0);
  const state = new Value(State.UNDETERMINED);
  const onGestureEvent = event(
    [
      {
        nativeEvent: {
          x,
          y,
          state,
        },
      },
    ],
  );

  // console.log(`dev : ${global.__DEV__}`);
  const circumference = radius * 2 * PI;
  // const delta =
  //   sub(
  //     cond(lessThan(start, end),
  //       end,
  //       add(end, PI * 2)
  //     ),
  //     start
  //   );

  // const strokeDashoffset = multiply(end, radius);
  const strokeDashoffset = multiply(angle, radius);
  // const rotateZ = concat(sub(Math.PI * 2, start), 'rad');
  // const rotateZ = concat(multiply(-1, Math.PI / 2), 'rad');
  return (
    <>
      <Animated.Code>
        {
          () => block([
            cond(eq(x, radius), debug('xTrue', x), debug('xFalse', x)),
            cond(eq(state, State.ACTIVE), [
              debug('xoaouaoua', x),
              // set(x, xOffset),
              // set(y, yOffset),
            ]),
            // cond(eq(state, State.END), [
            //   set(xOffset, x),
            //   set(yOffset, y),
            // ]),
            set(α, atan2(add(multiply(y, -1), radius), sub(x, radius))),
            set(angle, α),
            set(x, add(multiply(radius, cos(α)), radius)),
            set(y, add(multiply(-1 * radius, sin(α)), radius)),
          ])
        }
      </Animated.Code>
      <TapGestureHandler onHandlerStateChange={onGestureEvent} {...{ onGestureEvent }}>
        <Animated.View style={{
          ...StyleSheet.absoluteFillObject,
          // transform: [
          //   { rotateZ },
          // ],
          backgroundColor: 'blue',
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
              {...{ strokeWidth }}
              stroke="rgb(50, 50, 50)"
              fill="none"
              cx={canvasSize / 2}
              cy={canvasSize / 2}
              r={radius}
            />
            <AnimatedCircle
              stroke="url(#grad)"
              fill="none"
              cx={canvasSize / 2}
              cy={canvasSize / 2}
              r={radius}
              strokeDasharray={`${circumference}, ${circumference}`}
              {...{ strokeDashoffset, strokeWidth }}
            />
          </Svg>
        </Animated.View>
      </TapGestureHandler>
    </>
  );
};
