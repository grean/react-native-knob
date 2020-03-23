import * as React from 'react';
import Animated from 'react-native-reanimated';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

const {
  Value, event, block, cond, eq, set, add, sub, multiply, sin, cos, debug,
} = Animated;

interface CursorProps {
  x: Animated.Node<number>;
  y: Animated.Node<number>;
  strokeWidth: number;
}

export default ({ x, y, strokeWidth }: CursorProps) => {
  // const xOffset = new Value(0);
  // set(xOffset, x);
  // const yOffset = new Value(0);
  // set(yOffset, y);
  // const translationX = new Value(0);
  // const translationY = new Value(0);
  // const state = new Value(State.UNDETERMINED);
  // const onGestureEvent = event(
  //   [
  //     {
  //       nativeEvent: {
  //         translationX,
  //         translationY,
  //         state,
  //       },
  //     },
  //   ],
  // );
  return (
    <>
      {/* <Animated.Code>
        {
          () => block([
            debug('cursor ', x),
            cond(eq(state, State.ACTIVE), [
              set(x, add(xOffset, translationX)),
              set(y, add(yOffset, translationY)),
            ]),
            cond(eq(state, State.END), [
              set(xOffset, x),
              set(yOffset, y),
            ]),
            // set(angle, atan2(add(multiply(y, -1), r), sub(x, r))),
            // set(angle, angle),
            // set(translateX, add(multiply(r, cos(angle)), r)),
            // set(translateY, add(multiply(-1 * r, sin(angle)), r)),
          ])
        }
      </Animated.Code> */}
      {/* <PanGestureHandler
        ref={knobPan}
        simultaneousHandlers={knobTap}
        onHandlerStateChange={onGestureEvent}
        {...{ onGestureEvent }}
      > */}
      <Animated.View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: 'white',
          width: strokeWidth,
          height: strokeWidth,
          borderRadius: strokeWidth / 2,
          transform: [
            { translateX: x },
            { translateY: y },
          ],
        }}
      />
      {/* </PanGestureHandler> */}
    </>
  );
};
