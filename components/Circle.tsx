import * as React from 'react';
import Animated, { lessOrEq } from 'react-native-reanimated';
// import { atan2 } from 'react-native-redash';
import { State, TapGestureHandler } from 'react-native-gesture-handler';
import { StyleSheet, Text } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop, Path } from 'react-native-svg';

const {
  useCode, Value, event, block, cond, eq, set, add, sub, multiply, sin, cos, concat, lessThan, debug, atan, divide, abs, max
} = Animated;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);

const { PI } = Math;

interface polarToCartesianReturn {
  x: Animated.Node<number>;
  y: Animated.Node<number>;
}

function polarToCartesian(centerX: Animated.Value<number>, centerY: Animated.Value<number>, radius: number, angleInRadians: Animated.Value<number>): polarToCartesianReturn {
  // let angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

  return {
    x: add(centerX, multiply(radius, cos(angleInRadians))),
    y: add(centerY, multiply(radius, sin(angleInRadians))),
  };
}

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

  const canvasRadius = radius + strokeWidth / 2;
  const α = new Value(0);
  const x = new Value(startX);
  const oX = new Value(startX);
  const oY = new Value(startY);
  const pX = new Value(startX);
  const pY = new Value(canvasSize - strokeWidth / 2);
  // debug('init x ', x);
  const y = new Value(startY);
  // const xOffset = strokeWidth / 2;
  // const yOffset = xOffset;
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
  // cond(lessThan(translateX,0),[

  // ]);
  // const rotateZ = concat(sub(Math.PI * 2, start), 'rad');
  const rotateZ = concat(multiply(-1, Math.PI / 2), 'rad');
  const startAngle = 0;
  const endAngle = PI;

  // let start = polarToCartesian(x, y, radius, endAngle);
  // let end = polarToCartesian(oX, oY, radius, α);

  // var largeArcFlag = endAngle - startAngle >= PI ? '0' : '1';
  // var largeArcFlag = false ? '0' : '1';
  var largeArcFlag = true ? '0' : '1';

  const d = concat('M ', oX, ' ', oY, ' A ', radius, ' ', radius, largeArcFlag, ' 0 ', pX, ' ', pY);
  // const d = concat('M ', oX, ' ', oY, ' A ', radius, ' ', radius, ' 0 ', largeArcFlag, ' 0 ', pX, ' ', pY);
  // console.log('d ' + d);
  useCode(
    () => (debug('d ', d)),
    [d]
  );
  return (
    <>
      <Animated.Code>
        {
          () => block([
            debug('init x ', x),
            debug('init y ', y),
            //             debug('init x ', sub(x, strokeWidth / 2)),
            // debug('init y ', sub(y, strokeWidth / 2)),
            // set(x, sub(x, xOffset)),
            // debug('x ', x),
            // set(y, sub(y, yOffset)),
            // debug('y ', y),
            // cond(eq(state, State.ACTIVE), [
            //   set(x, xOffset),
            //   set(y, yOffset),
            // ]),
            // cond(eq(state, State.END), [
            //   set(xOffset, x),
            //   set(yOffset, y),
            // ]),
            set(translateX, sub(x, canvasRadius)),
            debug('translateX  ', translateX),
            set(translateY, sub(canvasRadius, y)),
            // set(translateY, add(multiply(y, -1), canvasRadius)),
            debug('translateY  ', translateY),
            set(α, atan(divide(translateY, translateX))),
            // cond(lessThan(translateX, 0), [
            //   set(α, add(α, PI)),
            // ]),
            debug('debug α ', α),
            set(angle, α),
            // set(x, add(multiply(radius, cos(α)), radius)),
            // set(y, add(multiply(-1 * radius, sin(α)), radius)),
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
          {/* <AnimatedText style={{ color: 'white' }}>{debug('est', d)}</AnimatedText> */}
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
            {/* <Path fill="none" stroke="url(#grad)" strokeWidth="40" d="  " /> */}
            <AnimatedPath
              id="arc1"
              fill="none"
              stroke="url(#grad)"
              {...{ strokeWidth, d }}
            />
            {/* <AnimatedCircle
              stroke="url(#grad)"
              fill="none"
              cx={canvasSize / 2}
              cy={canvasSize / 2}
              r={radius}
              strokeDasharray={`${circumference}`}
              {...{ strokeDashoffset, strokeWidth }}
            /> */}
          </Svg>
        </Animated.View>
      </TapGestureHandler>
    </>
  );
};
