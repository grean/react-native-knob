import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Svg, {
  Defs, LinearGradient, Stop, Path, Circle,
} from 'react-native-svg';
import Animated, { lessThan, lessOrEq } from 'react-native-reanimated';
import { TapGestureHandler, State, PanGestureHandler } from 'react-native-gesture-handler';
import { ReText } from 'react-native-redash';

import Cursor from './Cursor';

const { interpolate, multiply, Value, event, block, debug, set, sub, add, atan, divide, cos, sin, cond, greaterOrEq, concat, eq, tan, call, round } = Animated;

interface CircularPogressProps {
  canvasSize: number;
  strokeWidth: number;
  defaultAngle: number;
  rotation: number;
}

export default ({ canvasSize, strokeWidth, defaultAngle, rotation }: CircularPogressProps) => {

  const [endAngleText, setEndAngleText] = useState(defaultAngle);

  const { PI } = Math;
  const cx = canvasSize / 2;
  const cy = canvasSize / 2;
  const r = (canvasSize - strokeWidth) / 2;
  const canvasRadius = canvasSize / 2;
  const p = strokeWidth / 2;

  const startAngle = new Value(0);
  const endAngle = new Value(defaultAngle);
  const α = new Value(0);

  const startX = add(cx, multiply(r, cos(startAngle)));
  const startY = add(cy, multiply(r, sin(startAngle)));
  const endX = new Value(0);
  const endY = new Value(0);
  const x = new Value(0);
  const y = new Value(0);

  const translateX = new Value(0);
  const translateY = new Value(0);

  const state = new Value(State.UNDETERMINED);
  const largeArcFlag = new Value(0);
  let sweep = '1';

  // arcTo specifictaion => A rx ry x-axis-rotation large-arc-flag sweep-flag x y
  const d = new Animated.Value('');

  const AnimatedPath = Animated.createAnimatedComponent(Path);
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  const AnimatedText = Animated.createAnimatedComponent(Text);
  const knobTapRef = React.createRef<TapGestureHandler>();
  const knobPanRef = React.createRef<PanGestureHandler>();


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

  //for Animated.View rotation
  const rotateZ = concat(rotation, 'rad');

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
            //if component first load, init with default value, defined at the begining
            cond(eq(state, State.UNDETERMINED), [
              //set x and y in canvas coordinates
              set(x, add(cx, multiply(r, cos(endAngle)))),
              set(y, add(cy, multiply(r, sin(endAngle)))),
            ]),
            debug('x ', x),
            debug('y ', y),
            //translate x and y to polar coordinates
            set(translateX, sub(x, canvasRadius)),
            set(translateY, sub(canvasRadius, y)),
            debug('translateX  ', translateX),
            debug('translateY  ', translateY),

            //complete atan2 function with atan because redash atan2 function not enough accurate
            set(α, cond(eq(translateX, 0), tan(-1), atan(divide(translateY, translateX)))),
            //for quandrant 2 and 3 we add PI to get 2PI values (first quadrant is top right)
            cond(lessThan(translateX, 0), set(α, add(α, PI))),
            //tan function give us an angle of [0, PI];[-PI, 0] so we need to have 2PI radians value representation
            set(α, cond(lessThan(α, 0), add(α, 2 * PI), α)),
            debug('α ', α),

            //We need to add -2PI and then invert the sign in order to inverse the rotation
            set(endAngle, multiply(-1, add(α, -2 * PI))),
            debug('endAngle ', endAngle),

            //SVG attribut computation for small or large arc. We always need large arc.
            set(largeArcFlag, cond(lessOrEq(sub(endAngle, startAngle), PI), 0, 1)),

            //calculate end arcTo coordinates
            set(endX, add(cx, multiply(r, cos(endAngle)))),
            set(endY, add(cy, multiply(r, sin(endAngle)))),

            set(d, concat('M ', startX, ' ', startY, ' A ', r, ' ', r, ' 0 ', largeArcFlag, ' ', sweep, ' ', endX, ' ', endY)),
            debug('d ', d),
          ])
        }
      </Animated.Code>
      {/* <Animated.Code>
        {
          () => call([endAngle], ([endAngleText]) => setEndAngleText(endAngleText))
        }
      </Animated.Code> */}


      <Animated.View style={{
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
        {/* <AnimatedText style={{
        }}>
        {concat(endX)}
      </AnimatedText> */}
        <ReText
          text={concat(round(multiply(divide(endAngle, 2 * PI), 100)))}
          style={{
            color: 'white',
            textAlign: 'center',
            fontSize: 50,
          }}
        />

      </Animated.View>
      <PanGestureHandler
        ref={knobPanRef}
        simultaneousHandlers={knobTapRef}
        onHandlerStateChange={onGestureEvent}
        onGestureEvent={onGestureEvent}
      >
        <Animated.View style={{
          ...StyleSheet.absoluteFillObject,
          transform: [
            { rotateZ },
          ],
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
              <Cursor {...{ x: sub(endX, p), y: sub(endY, p), strokeWidth }} />
            </Animated.View>
          </TapGestureHandler>
        </Animated.View>
      </PanGestureHandler>
    </>
  );
};
