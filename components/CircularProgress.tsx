import * as React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Svg, {
  Defs, LinearGradient, Stop, Path,
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
  //   var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
  var offset = 0;
  // var offset = Math.PI / 2;

  return {
    x: add(centerX, multiply(radius, cos(sub(angleInRadians, offset)))),
    y: add(centerY, multiply(radius, sin(sub(angleInRadians, offset)))),
  };
}



interface CircularPogressProps {
  progress: Animated.Node<number>;
}

export default ({ progress }: CircularPogressProps) => {
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


  // const startAngle = 0;
  // const endAngle = PI * 0.25;
  var start = polarToCartesian(cx, cy, r, angleKnob);
  var end = polarToCartesian(cx, cy, r, startAngle);

  // A rx ry x-axis-rotation large-arc-flag sweep-flag x y
  // const x1 = cx - r * Math.cos(startAngle);
  // const y1 = -r * Math.sin(startAngle) + cy;
  // const x2 = cx + r * Math.cos(endAngle);
  // const y2 = -r * Math.sin(endAngle) + cy;
  // set(largeArcFlag, cond(lessOrEq(sub(angleKnob, startAngle), PI), '0', '1'));
  var sweep = '0';
  // var sweep = endAngle - startAngle <= PI ? '1' : '0';
  // var sweep = startAngle - endAngle <= PI ? '0' : '1';
  // var largeArcFlag = endAngle - startAngle <= -PI ? '0' : '1';
  const d = concat('M ', start.x, ' ', start.y, ' A ', r, ' ', r, ' 0 ', largeArcFlag, ' ', sweep, ' ', end.x, ' ', end.y);
  // const d = concat(`M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} ${sweep} ${end.x} ${end.y}`);
  // const d = `M ${x1} ${y1} A ${r} ${r} 0 1 0 ${x2} ${y2}`;
  // const d = `M ${x1} ${y1} A ${r} ${r} 0 0 0 ${x2} ${y2}`;



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
  // const circumference = r * A;
  // const α = interpolate(progress, {
  //   inputRange: [0, 1],
  //   outputRange: [0, A],
  // });
  // const strokeDashoffset = multiply(α, r);
  const rotateZ = concat(-Math.PI / 2, 'rad');
  return (
    <>
      <Animated.Code>
        {
          () => block([
            // debug('init x ', x),
            // debug('init y ', y),
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
            // set(angleKnob, add(multiply(-1, add(angleKnob, -2 * PI)), -3 * PI / 2)),

            // debug('cos α', cos(α)),
            // set(α, cond(lessThan(translateX, 0), [
            //   add(α, PI),
            // ])),
            // debug('debug α ', α),
            debug('       debug angleKnob ', angleKnob),
            // set(angle, α),
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
          backgroundColor: '#333',
        }}
        >
          <Svg width={size} height={size}>
            <Defs>
              <LinearGradient id="grad" x1="0" y1="0" x2="50%" y2="0">
                <Stop offset="0" stopColor="#f7cd46" />
                <Stop offset="1" stopColor="#46ef37" />
              </LinearGradient>
            </Defs>
            {/* <Path
              stroke="white"
              fill="none"
              // strokeDasharray={`${circumference}, ${circumference}`}
              {...{ d, strokeWidth }}
            /> */}
            <AnimatedPath
              stroke="url(#grad)"
              fill="none"
              // strokeDasharray={`${circumference}, ${circumference}`}
              {...{ d, strokeWidth }}
            />
          </Svg>
        </Animated.View>
      </TapGestureHandler>
    </>
  );
};
