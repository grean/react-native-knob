import * as React from 'react';
import Animated from 'react-native-reanimated';
import { atan2 } from 'react-native-redash';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

const {
  Value, event, block, cond, eq, set, add, sub, multiply, sin, cos,
} = Animated;

interface CursorProps {
  radius: number;
  x: Animated.Value<number>;
  y: Animated.Value<number>;
  xOffset: Animated.Value<number>;
  yOffset: Animated.Value<number>;
  angle: Animated.Value<number>;
  translateX: Animated.Value<number>;
  translateY: Animated.Value<number>;
}

export default ({ radius, angle, x, y, xOffset, yOffset, translateX, translateY }: CursorProps) => {
  // const α = new Value(0);
  // const x = new Value(startX);
  // const y = new Value(startY);
  // const xOffset = new Value(x.);
  // const yOffset = new Value(0);
  // const translateX = new Value(0);
  // const translateY = new Value(0);
  const translationX = new Value(0);
  const translationY = new Value(0);
  const state = new Value(State.UNDETERMINED);
  const onGestureEvent = event(
    [
      {
        nativeEvent: {
          translationX,
          translationY,
          state,
        },
      },
    ],
  );
  return (
    <>
      <Animated.Code>
        {
          () => block([
            cond(eq(state, State.ACTIVE), [
              set(x, add(xOffset, translationX)),
              set(y, add(yOffset, translationY)),
            ]),
            cond(eq(state, State.END), [
              set(xOffset, x),
              set(yOffset, y),
            ]),
            set(angle, atan2(add(multiply(y, -1), radius), sub(x, radius))),
            // set(angle, α),
            set(translateX, add(multiply(radius, cos(angle)), radius)),
            set(translateY, add(multiply(-1 * radius, sin(angle)), radius)),
          ])
        }
      </Animated.Code>
      <PanGestureHandler onHandlerStateChange={onGestureEvent} {...{ onGestureEvent }}>
        <Animated.View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'white',
            width: 50,
            height: 50,
            borderRadius: 25,
            transform: [
              { translateX },
              { translateY },
            ],
          }}
        />
      </PanGestureHandler>
    </>
  );
};
