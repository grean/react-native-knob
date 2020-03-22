import * as React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Svg, {
  Defs, LinearGradient, Stop, Path, Circle,
} from 'react-native-svg';
import Animated, { lessThan, lessOrEq } from 'react-native-reanimated';
import { TapGestureHandler, State, PanGestureHandler } from 'react-native-gesture-handler';
import { atan2 } from 'react-native-redash';

import Cursor from './Cursor';

const { interpolate, multiply, Value, event, block, debug, set, sub, add, atan, divide, cos, sin, cond, greaterOrEq, concat, eq } = Animated;

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



interface CircularPogressProps {
  canvasSize: number;
  strokeWidth: number;
  defaultAngle: number;
}

export default ({ canvasSize, strokeWidth, defaultAngle }: CircularPogressProps) => {

  const { PI } = Math;
  const cx = canvasSize / 2;
  const cy = canvasSize / 2;
  const r = (canvasSize - strokeWidth) / 2;
  const canvasRadius = r + strokeWidth / 2;

  const startAngle = new Value(0);
  const endAngle = new Value(defaultAngle);

  const x = new Value(0);
  const y = new Value(0);
  const translationX = new Value(0);
  const translationY = new Value(0);

  const α = new Value(0);
  const translateX = new Value(0);
  const translateY = new Value(0);

  const state = new Value(State.UNDETERMINED);

  let start = polarToCartesian(cx, cy, r, startAngle);
  let end = polarToCartesian(cx, cy, r, endAngle);
  const largeArcFlag = new Value(0);
  let sweep = '1';
  // A rx ry x-axis-rotation large-arc-flag sweep-flag x y
  const d = concat('M ', start.x, ' ', start.y, ' A ', r, ' ', r, ' 0 ', largeArcFlag, ' ', sweep, ' ', end.x, ' ', end.y);

  const AnimatedPath = Animated.createAnimatedComponent(Path);
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);


  const onGestureEvent = event(
    [
      {
        nativeEvent: {
          x,
          y,
          translationX,
          translationY,
          state,
        },
      },
    ],
  );
  // const onPanGestureEvent = event(
  //   [
  //     {
  //       nativeEvent: {
  //         statePan,
  //       },
  //     },
  //   ],
  // );

  const rotateZ = concat(-Math.PI / 2, 'rad');
  console.log('CircularProgress console log');
  debug('CircularProgress rotateZ ', rotateZ);
  const knobTapRef = React.createRef<TapGestureHandler>();
  const knobPanRef = React.createRef<PanGestureHandler>();
  return (
    <>
      <Animated.Code>
        {
          () => block([
            //   UNDETERMINED = 0,
            //   FAILED = 1,
            //   BEGAN = 2,
            //   CANCELLED = 3,
            //   ACTIVE = 4,
            //   END = 5,
            debug('state ', state),
            debug('x ', x),
            debug('y ', y),
            debug('translationX ', translationX),
            debug('translationY ', translationY),
            debug('d ', d),
            cond(eq(state, State.ACTIVE), [
              set(x, add(x, translationX)),
              set(y, add(y, translationY)),
            ]),
            set(translateX, sub(x, canvasRadius)),
            // debug('translateX  ', translateX),
            set(translateY, sub(canvasRadius, y)),
            // set(translateY, add(multiply(y, -1), r)),
            // debug('translateY  ', translateY),
            set(α, atan2(translateY, translateX)),
            set(endAngle, cond(lessThan(α, 0), [
              add(α, 2 * PI),
            ], [
              α,
            ])),
            debug('α ', α),
            set(endAngle, multiply(-1, add(endAngle, -2 * PI))),
            debug('endAngle ', endAngle),
            set(largeArcFlag, cond(lessOrEq(sub(endAngle, startAngle), PI), 0, 1)),
            // debug('       debug endAngle ', endAngle),
            set(x, add(multiply(r, cos(α)), r)),
            set(y, add(multiply(-1 * r, sin(α)), r)),
            // debug('translate x ', x),
            // debug('translate y ', y),
          ])
        }
      </Animated.Code>
      <View style={{
        position: 'absolute',
        zIndex: 1000,
        height: canvasSize * 0.2,
        width: canvasSize * 0.3,
        top: canvasSize / 2 - canvasSize * 0.2 / 2,
        left: canvasSize / 2 - canvasSize * 0.3 / 2,
        justifyContent: 'center',
        borderColor: 'white',
        borderWidth: 1,
      }}>
        <Text style={{
          color: 'white',
          textAlign: 'center',
          fontSize: 50,
        }}>00</Text>

      </View>
      <PanGestureHandler
        ref={knobPanRef}
        simultaneousHandlers={knobTapRef}
        onHandlerStateChange={onGestureEvent}
        onGestureEvent={onGestureEvent}
      >
        <Animated.View style={{
          ...StyleSheet.absoluteFillObject,
          // transform: [
          //   { rotateZ },
          // ],
        }}
        >
          <TapGestureHandler
            ref={knobTapRef}
            simultaneousHandlers={knobPanRef}
            onHandlerStateChange={onGestureEvent}
            onGestureEvent={onGestureEvent}
          >
            <Animated.View
              collapsable={false}
              style={{
                ...StyleSheet.absoluteFillObject,
              }}
            >
              <Svg width={canvasSize} height={canvasSize}>
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
              <Cursor {...{ x, y, strokeWidth }} />
            </Animated.View>
          </TapGestureHandler>
        </Animated.View>
      </PanGestureHandler>
    </>
  );
};
