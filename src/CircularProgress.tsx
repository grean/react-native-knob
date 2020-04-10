import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, {
  Defs, Stop, Path, Circle, RadialGradient, Text
} from 'react-native-svg';
import Animated, { lessThan, lessOrEq, greaterThan } from 'react-native-reanimated';
import { TapGestureHandler, State, PanGestureHandler } from 'react-native-gesture-handler';
import { ReText, string, interpolateColor } from 'react-native-redash';
import { StopGradient } from './Knob';

// import Cursor from './Cursor';

const { multiply, Value, event, block, debug, set, sub, add, atan, divide, cos, sin, cond, concat, eq, tan, round, abs, and, or } = Animated;

interface CircularPogressProps {
  canvasSize: number;
  strokeWidth: number;
  value: number;
  maxValue: number;
  padding: number;
  strokeWidthDecoration: number;
  rotation: number;
  negative: boolean;
  colors: Array<string>;
  gradientInt: Array<StopGradient>;
  gradientExt: Array<StopGradient>;
  textStyle: object;
  textDisplay: boolean;
}



export default ({ canvasSize, strokeWidth, rotation, value, maxValue, padding, strokeWidthDecoration, negative, colors, gradientInt, gradientExt, textStyle, textDisplay }: CircularPogressProps) => {

  // const [gradientIndex, setGradientIndex] = useState(0);

  const { PI } = Math;
  const cx = canvasSize / 2;
  const cy = canvasSize / 2;

  const r = (canvasSize - strokeWidth - padding) / 2;
  const rPlate = (canvasSize - strokeWidthDecoration) / 2;
  const canvasRadius = canvasSize / 2;
  // const p = (strokeWidth) / 2;

  const startAngle = new Value(0);
  const endAngle = new Value(maxValue !== 0 ? value * 2 * PI / maxValue : 0);
  const α = new Value(0);

  const startX = add(cx, multiply(r, cos(startAngle)));
  const startY = add(cy, multiply(r, sin(startAngle)));
  const endX = new Value(0);
  const endY = new Value(0);
  const x = new Value(0);
  const y = new Value(0);

  const aroundCountTmp = Math.round(maxValue !== 0 ? value / maxValue : 0);
  const aroundCount = new Value(aroundCountTmp);
  const colorIndex = new Value(aroundCountTmp);
  // const aroundCount = new Value(round());
  const previousAngle = new Value(0);
  const deltaSign = new Value(0);

  const translateX = new Value(0);
  const translateY = new Value(0);

  const state = new Value(State.UNDETERMINED);
  const largeArcFlag = new Value(0);
  let sweep = '1';

  // const canBeNegative = new Value(negative);

  // arcTo specifictaion => A rx ry x-axis-rotation large-arc-flag sweep-flag x y

  const AnimatedPath = Animated.createAnimatedComponent(Path);
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  const AnimatedText = Animated.createAnimatedComponent(Text);
  // Animated.addWhitelistedNativeProps({ stroke: true });
  // const AnimatedStop = Animated.createAnimatedComponent(Stop);
  // const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
  // const AnimatedStop = Animated.createAnimatedComponent(Stop);
  // const AnimatedText = Animated.createAnimatedComponent(Text);
  const knobTapRef = React.createRef<TapGestureHandler>();
  const knobPanRef = React.createRef<PanGestureHandler>();

  const bgColor = interpolateColor(abs(colorIndex), {
    inputRange: colors.map((v, i) => i),
    outputRange: colors,
  });
  let fgColorsTmp = [...colors];
  fgColorsTmp.shift();
  const fgColor = interpolateColor(abs(colorIndex), {
    inputRange: fgColorsTmp.map((v, i) => i),
    outputRange: fgColorsTmp,
  });

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
  const rotateZText = concat(multiply(rotation, -1), 'rad');

  // const grads = gradients.map((color, key) => {
  //   return (
  //     <LinearGradient id={`gradient-${key}`} {...{ key }}>
  //       <Stop
  //         stopColor={color}
  //         offset={0}
  //       />
  //       <Stop
  //         stopColor={gradients2[key + 1]}
  //         offset={1}
  //       />
  //     </LinearGradient>
  //   );
  // });

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

            //complete atan2 function with atan because redash@9.6.0 atan2 function not enough accurate
            set(α, cond(eq(translateX, 0), tan(-1), atan(divide(translateY, translateX)))),
            cond(or(
              lessThan(translateX, 0),
              and(
                eq(translateX, 0),
                greaterThan(translateY, 0)
              )), set(α, add(α, PI))),
            //for quandrant 2 and 3 we add PI to get 2PI values (first quadrant is top right)
            //tan function give us an angle of [0, PI];[-PI, 0] so we need to have 2PI radians value representation
            set(α, cond(lessOrEq(α, 0), add(α, 2 * PI), α)),
            debug('α ', α),

            //We need to add -2PI and then invert the sign in order to inverse the rotation
            set(endAngle, multiply(-1, add(α, -2 * PI))),
            //when translateY === 0 then endAngle value is -0 and abs function don´t seems to remove sign.. so in this case we have to remove it by multiply by -1
            cond(and(eq(translateY, 0), greaterThan(translateX, 0)), set(endAngle, multiply(-1, endAngle))),
            debug('endAngle ', endAngle),

            //SVG attribut computation for small or large arc. We always need large arc.
            set(largeArcFlag, cond(lessOrEq(sub(endAngle, startAngle), PI), 0, 1)),

            //calculate end arcTo coordinates
            set(endX, add(cx, multiply(r, cos(endAngle)))),
            set(endY, add(cy, multiply(r, sin(endAngle)))),
            cond(eq(state, State.ACTIVE), [
              //if endAngle > previousAngle then sign is 'plus' otherwise it´s 'minus'
              set(deltaSign, sub(endAngle, previousAngle)),
              cond(greaterThan(abs(deltaSign), 4),
                cond(greaterThan(deltaSign, 0),
                  cond(greaterThan(aroundCount, 0),
                    set(aroundCount, sub(aroundCount, 1)),
                    set(aroundCount, sub(aroundCount, negative ? 1 : 0))),
                  set(aroundCount, add(aroundCount, 1))
                )
              )]
            ),
            debug('aroundCount ', aroundCount),
            cond(lessThan(aroundCount, 0), [
              //inverse the logic if we are negative
              set(largeArcFlag, cond(lessOrEq(sub(endAngle, startAngle), PI), 1, 0)),
              set(colorIndex, add(aroundCount, 1)),
            ], [
              set(colorIndex, aroundCount),
            ]),
            // debug(concat("M ", endX, " ", endY, " A ", r, " ", r, " 0 ", largeArcFlag, " ", sweep, " ", startX, " ", startY), 0),
            debug('colorIndex ', colorIndex),
            debug('largeArcFlag ', largeArcFlag),

            // onChange(aroundCount, call([aroundCount], ([aroundCount]) => setGradientIndex(aroundCount))),
            // call([aroundCount], ([aroundCount]) => setGradientIndex(aroundCount)),
            // onChange(aroundCount, call() => ),
            set(previousAngle, endAngle),
          ])
        }
      </Animated.Code>
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
                  {/* {grads} */}
                  {/* {gradients.map((color, key) => {
                    return (
                      <LinearGradient id={`gradient-${key}`} {...{ key }} x1="0" y1="0" x2="50%" y2="0">
                        <Stop
                          stopColor={color}
                          offset={0}
                        />
                        <Stop
                          stopColor={color}
                          offset={1}
                        />
                      </LinearGradient>
                    );
                  })} */}
                  {/* <LinearGradient id="grad" x1="0" y1="0" x2="50%" y2="0">
                    <AnimatedStop offset="0" stopColor={bgColor} />
                    <Stop offset="1" stopColor={fgColor} />
                  </LinearGradient> */}
                  {/* <LinearGradient id="plate" x1="0" y1="0" x2="50%" y2="0">
                    <Stop offset="0" stopColor="#222" />
                    <Stop offset="1" stopColor="#888" />
                  </LinearGradient> */}
                  <RadialGradient id="radialPlateInt">
                    {
                      gradientInt.map(({ offset, stopColor }, i) => <Stop key={i} {...{ offset, stopColor }} />)
                    }
                  </RadialGradient>
                  <RadialGradient id="radialPlateExt">
                    {
                      gradientExt.map(({ offset, stopColor }, i) => <Stop key={i} {...{ offset, stopColor }} />)
                    }
                  </RadialGradient>
                </Defs>

                {/* circle  decoration */}
                <AnimatedCircle
                  {...{ strokeWidth: strokeWidthDecoration, cx, cy, r: rPlate }}
                  stroke="url(#radialPlateExt)"
                  // stroke={plateColor}
                  fill="none"
                />
                {/* circle  decoration center */}
                <AnimatedCircle
                  {...{ cx, cy, r }}
                  fill="url(#radialPlateInt)"
                // fill={plateColor}
                />
                <AnimatedCircle
                  {...{ strokeWidth, cx, cy, r }}
                  // stroke={`url(#gradient-${aroundCount})`}
                  // stroke={'url(#gradient-0)'}
                  // stroke="url(#plate)"
                  stroke={bgColor}
                  fill="none"
                />
                <AnimatedPath
                  // stroke={concat("url(#gradient-", aroundCount, ")")}
                  // stroke={'url(#gradient-1)'}
                  // stroke="url(#grad)"
                  stroke={fgColor}
                  fill="none"
                  // d="M 95 0 A 10 10 0 0 1 200 200"
                  d={cond(lessThan(aroundCount, 0),
                    //inverse the logic if we are negative
                    string`M ${endX} ${endY} A ${r} ${r} 0 ${cond(eq(largeArcFlag, 0), '0', '1')} ${sweep} ${startX} ${startY}`,
                    string`M ${startX} ${startY} A ${r} ${r} 0 ${cond(eq(largeArcFlag, 0), '0', '1')} ${sweep} ${endX} ${endY}`
                  )}
                  // d={cond(lessThan(aroundCount, 0),
                  //   //inverse the logic if we are negative
                  //   string`M ${endX} ${endY} A ${r} ${r} 0 ${cond(eq(largeArcFlag, 0), '0', '1')} ${sweep} ${startX} ${startY}`,
                  //   string`M ${startX} ${startY} A ${r} ${r} 0 ${largeArcFlag} ${sweep} ${endX} ${endY}`
                  // )}
                  {...{ strokeWidth }}
                />
                {textDisplay && <Animated.View style={{
                  transform: [
                    { rotateZ: rotateZText },
                  ],
                  position: 'absolute',
                  zIndex: 1000,
                  height: canvasSize * 0.2,
                  width: canvasSize * 0.4,
                  top: canvasSize / 2 - canvasSize * 0.2 / 2,
                  left: canvasSize / 2 - canvasSize * 0.4 / 2,
                  justifyContent: 'space-evenly',
                  // backgroundColor: 'red',
                  // borderColor: plateColor,
                  // borderWidth: 1,
                }}>
                  <ReText
                    text={concat(round(add(multiply(divide(endAngle, 2 * PI), 100), multiply(100, aroundCount))))}
                    style={{
                      ...{
                        color: 'white',
                        // borderColor: plateColor,
                        // borderWidth: 1,
                        // width: canvasSize * 0.5,
                        textAlign: 'center',
                        fontSize: canvasSize / 8,
                        // letterSpacing: 5,
                      }, ...textStyle
                    }}

                  />
                </Animated.View>}
              </Svg>
              {/* <Cursor {...{ x: sub(endX, p), y: sub(endY, p), strokeWidth }} /> */}
            </Animated.View>
          </TapGestureHandler>
        </Animated.View>
      </PanGestureHandler>

    </>
  );
};
