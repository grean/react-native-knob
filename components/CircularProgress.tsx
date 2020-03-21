import * as React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Svg, {
  Defs, LinearGradient, Stop, Path, Circle,
} from 'react-native-svg';
import Animated, { lessThan, lessOrEq } from 'react-native-reanimated';
import { TapGestureHandler, State } from 'react-native-gesture-handler';
import { atan2 } from 'react-native-redash';

const { interpolate, multiply, Value, event, block, debug, set, sub, add, atan, divide, cos, sin, cond, greaterOrEq, concat } = Animated;

interface polarToCartesianReturn {
  x: Animated.Node<number>,
  y: Animated.Node<number>,
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInRadians: Animated.Value<number>): polarToCartesianReturn {
  var offset = 0;
  // var offset = Math.PI / 2;

  return {
    x: add(centerX, multiply(radius, cos(sub(angleInRadians, offset)))),
    y: add(centerY, multiply(radius, sin(sub(angleInRadians, offset)))),
  };
}



// interface CircularPogressProps {
//   progress: Animated.Node<number>;
// }

// export default ({ progress }: CircularPogressProps) => {
export default () => {
  const { width } = Dimensions.get('window');
  const size = width - 32;
  const strokeWidth = 50;
  const { PI } = Math;
  const r = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const canvasRadius = r + strokeWidth / 2;
  const x = new Value(0);
  const y = new Value(0);
  const α = new Value(0);
  const angleKnob = new Value(0);
  const translateX = new Value(0);
  const translateY = new Value(0);
  const startAngle = new Value(0);
  // const endAngle = new Value(PI * 0.25);
  const largeArcFlag = new Value(0);
  const state = new Value(State.UNDETERMINED);
  const AnimatedPath = Animated.createAnimatedComponent(Path);
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);

  let start = polarToCartesian(cx, cy, r, angleKnob);
  let end = polarToCartesian(cx, cy, r, startAngle);

  let sweep = '0';
  // A rx ry x-axis-rotation large-arc-flag sweep-flag x y
  const d = concat('M ', start.x, ' ', start.y, ' A ', r, ' ', r, ' 0 ', largeArcFlag, ' ', sweep, ' ', end.x, ' ', end.y);
  // const d = concat(`M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} ${sweep} ${end.x} ${end.y}`);

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

  const rotateZ = concat(-Math.PI / 2, 'rad');
  return (
    <>
      <Animated.Code>
        {
          () => block([
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
            // debug('translateX  ', translateX),
            set(translateY, sub(canvasRadius, y)),
            // set(translateY, add(multiply(y, -1), canvasRadius)),
            // debug('translateY  ', translateY),
            set(α, atan2(translateY, translateX)),
            set(angleKnob, cond(lessThan(α, 0), [
              add(α, 2 * PI),
            ], [
              α,
            ])),
            set(angleKnob, multiply(-1, add(angleKnob, -2 * PI))),
            set(largeArcFlag, cond(lessOrEq(sub(angleKnob, startAngle), PI), 0, 1)),
            debug('       debug angleKnob ', angleKnob),
            set(x, add(multiply(canvasRadius, cos(α)), canvasRadius)),
            set(y, add(multiply(-1 * canvasRadius, sin(α)), canvasRadius)),
            // debug('translate x ', x),
            // debug('translate y ', y),
          ])
        }
      </Animated.Code>
      <View style={{
        position: 'absolute',
        zIndex: 1000,
        height: size * 0.25,
        width: size * 0.4,
        top: size / 2 - size * 0.25 / 2,
        left: size / 2 - size * 0.4 / 2,
        justifyContent: 'center',
      }}>
        <Text style={{
          color: 'white',
          borderColor: 'white',
          borderWidth: 1,
          textAlign: 'center',
          fontSize: 50,
        }}>000</Text>

      </View>
      <TapGestureHandler onHandlerStateChange={onGestureEvent} {...{ onGestureEvent }}>
        <Animated.View style={{
          ...StyleSheet.absoluteFillObject,
          transform: [
            { rotateZ },
          ],
        }}
        >
          <Svg width={size} height={size}>
            <Defs>
              <LinearGradient id="grad" x1="0" y1="0" x2="50%" y2="0">
                <Stop offset="0" stopColor="#f7cd46" />
                <Stop offset="1" stopColor="#46ef37" />
              </LinearGradient>
            </Defs>
            <AnimatedCircle
              {...{ strokeWidth, cx, cy, r }}
              stroke="rgb(50, 50, 50)"
              fill="none"
            />
            <AnimatedPath
              stroke="url(#grad)"
              fill="none"
              {...{ d, strokeWidth }}
            />
          </Svg>
        </Animated.View>
      </TapGestureHandler>
    </>
  );
};
