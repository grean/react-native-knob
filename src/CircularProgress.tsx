import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, {
  Defs, Stop, Path, Circle, RadialGradient, Text
} from 'react-native-svg';
import Animated, { lessThan, lessOrEq, greaterThan, useCode } from 'react-native-reanimated';
import { TapGestureHandler, State, PanGestureHandler } from 'react-native-gesture-handler';
import { ReText, string, interpolateColor } from 'react-native-redash';
import { StopGradient } from './Knob';

// import Button from './Button';


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
  callback: (values: readonly number[]) => void;
}

interface CircularPogressState {
  cx: number;
  cy: number;
  r: number;
  plateRadius: number;
  canvasRadius: number;
  startAngle: Animated.Value<number>;
  endAngle: Animated.Value<number>;
  α: Animated.Value<number>;
  startX: number;
  startY: number;
  endX: Animated.Value<number>;
  endY: Animated.Value<number>;
  x: Animated.Value<number>;
  y: Animated.Value<number>;
  aroundCount: Animated.Value<number>;
  finalValue: Animated.Value<number>;
  previousAngle: Animated.Value<number>;
  deltaSign: Animated.Value<number>;
  translateX: Animated.Value<number>;
  translateY: Animated.Value<number>;
  state: Animated.Value<State>;
  largeArcFlag: Animated.Value<number>;
  isNegative: Animated.Value<0 | 1>;
  isNegativeChanged: Animated.Value<0 | 1>;
  previousIsNegative: Animated.Value<0 | 1>;
  sweep: string;
}

const { multiply, Value, event, block, debug, set, sub, add, atan, divide, cos, sin, cond, concat, eq, tan, round, abs, and, or, onChange, call, neq } = Animated;

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedSvg = Animated.createAnimatedComponent(Svg);
// const AnimatedText = Animated.createAnimatedComponent(Text);
// Animated.addWhitelistedNativeProps({ stroke: true });
// const AnimatedStop = Animated.createAnimatedComponent(Stop);
// const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
// const AnimatedStop = Animated.createAnimatedComponent(Stop);
// const AnimatedText = Animated.createAnimatedComponent(Text);
const knobTapRef = React.createRef<TapGestureHandler>();
const knobPanRef = React.createRef<PanGestureHandler>();

export default class CircularProgress extends React.Component<CircularPogressProps, CircularPogressState> {

  constructor(props: CircularPogressProps) {
    super(props);
    const { PI } = Math;
    const { canvasSize, strokeWidth, value, maxValue, padding, strokeWidthDecoration } = this.props;
    const startAngle = 0;
    const cx = canvasSize / 2;
    const cy = canvasSize / 2;
    const r = (canvasSize - strokeWidth) / 2 - padding;
    const isNegativeValue = value < 0 ? 1 : 0;
    let rapport = Math.abs(value / maxValue)
    let aroundCountValue = Math.trunc(rapport);
    let mantisse = rapport - aroundCountValue;
    let endAngleValue = 2 * PI * mantisse;
    if (isNegativeValue) {
      endAngleValue -= 2 * PI;
    }

    this.state = {
      ...{ cx, cy, r },
      plateRadius: (canvasSize - strokeWidthDecoration) / 2,
      canvasRadius: canvasSize / 2,
      startAngle: new Value(startAngle),
      endAngle: new Value(Math.abs(endAngleValue)),
      α: new Value(0),
      startX: cx + r * Math.cos(startAngle),
      startY: cy + r * Math.sin(startAngle),
      endX: new Value(0),
      endY: new Value(0),
      x: new Value(0),
      y: new Value(0),
      aroundCount: new Value(aroundCountValue),
      finalValue: new Value(0),
      previousAngle: new Value(0),
      deltaSign: new Value(0),
      translateX: new Value(0),
      translateY: new Value(0),
      state: new Value(State.UNDETERMINED),
      largeArcFlag: new Value(0),
      sweep: '1',
      isNegative: new Value(isNegativeValue),
      isNegativeChanged: new Value(0),
      previousIsNegative: new Value(isNegativeValue),
    }
  }

  shouldComponentUpdate(nextProps: CircularPogressProps, nextState: CircularPogressState) {
    return false;
  }


  setValue = (value: number) => {
    const { maxValue } = this.props;
    const { state, endAngle, aroundCount, isNegative } = this.state;
    const { PI } = Math;
    const isNegativeValue = value < 0 ? 1 : 0;
    let rapport = Math.abs(value / maxValue)
    let aroundCountValue = Math.trunc(rapport);
    let mantisse = rapport - aroundCountValue;
    let endAngleValue = 2 * PI * mantisse;
    if (isNegativeValue) {
      endAngleValue -= 2 * PI;
    }
    aroundCount.setValue(aroundCountValue);
    isNegative.setValue(isNegativeValue);
    state.setValue(State.UNDETERMINED);
    endAngle.setValue(Math.abs(endAngleValue));
  }
  // const [gradientIndex, setGradientIndex] = useState(0);

  render() {
    const { PI } = Math;
    // const { margin } = this.props;
    const { canvasSize, strokeWidth, rotation, strokeWidthDecoration, negative, colors, gradientInt, gradientExt, textStyle, textDisplay, callback } = this.props;

    const { x, y, state, cx, cy, r, startAngle, endAngle, canvasRadius, translateX, translateY, α, largeArcFlag, endX, endY, deltaSign, aroundCount, previousAngle, finalValue, plateRadius, sweep, startX, startY, isNegative, isNegativeChanged, previousIsNegative } = this.state;

    // isLandscape, 

    const bgColor = interpolateColor(aroundCount, {
      inputRange: colors.map((v, i) => i),
      outputRange: colors,
    });
    let fgColorsTmp = [...colors];
    fgColorsTmp.shift();
    const fgColor = interpolateColor(aroundCount, {
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
              debug('BEGIN ************************************ ', aroundCount),
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

              //calculate end arcTo coordinates
              set(endX, add(cx, multiply(r, cos(endAngle)))),
              set(endY, add(cy, multiply(r, sin(endAngle)))),
              cond(eq(state, State.ACTIVE), [
                //if endAngle > previousAngle then sign is 'plus' otherwise it´s 'minus'
                //if deltaSign is positiv it means that we go through positive values
                set(deltaSign, sub(endAngle, previousAngle)),
                //we detect if we need to add or remove a roundCount
                cond(greaterThan(abs(deltaSign), 4), [
                  set(isNegativeChanged, 0),
                  set(previousIsNegative, isNegative),

                  cond(eq(aroundCount, 0), [
                    debug('test isNegative', greaterThan(deltaSign, 0)),
                    set(isNegative, greaterThan(deltaSign, 0)),

                    set(isNegativeChanged, cond(neq(isNegative, previousIsNegative), 1, 0)),
                  ]),
                  cond(eq(isNegativeChanged, 0), [
                    debug('test2 aroundCount will change', isNegativeChanged),
                    cond(greaterThan(deltaSign, 0), [
                      debug('test2 aroundCount -1', isNegativeChanged),
                      set(aroundCount, cond(eq(isNegative, 1), add(aroundCount, 1), sub(aroundCount, 1))),
                    ], [
                      debug('test2 aroundCount +1', greaterThan(deltaSign, 0)),
                      set(aroundCount, cond(eq(isNegative, 1), sub(aroundCount, 1), add(aroundCount, 1))),
                    ]),
                  ]),
                ])
              ]),
              debug('deltaSign ', deltaSign),
              debug('isNegative ', isNegative),
              debug('isNegativeChanged ', isNegativeChanged),
              debug('aroundCount ', aroundCount),

              cond(eq(isNegative, 1), [
                //inverse the logic if we are negative
                set(largeArcFlag, cond(lessOrEq(sub(endAngle, startAngle), PI), 1, 0)),
              ], [
                set(largeArcFlag, cond(lessOrEq(sub(endAngle, startAngle), PI), 0, 1)),
              ]),
              debug('largeArcFlag ', largeArcFlag),

              set(previousAngle, endAngle),

              set(finalValue, cond(eq(isNegative, 1), [
                round(add(sub(divide(multiply(endAngle, 100), 2 * PI), 100), multiply(-100, aroundCount)))
              ], [
                round(add(divide(multiply(endAngle, 100), 2 * PI), multiply(100, aroundCount)))
              ])),
              onChange(finalValue, call([finalValue], callback)),
              debug('finalValue ', finalValue),
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

                <AnimatedSvg width={canvasSize} height={canvasSize} viewBox={`0 0 ${canvasSize} ${canvasSize}`}>
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
                    {...{ strokeWidth: strokeWidthDecoration, cx, cy, r: plateRadius }}
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
                    d={cond(eq(isNegative, 1),
                      //inverse the logic if we are negative
                      string`M ${endX} ${endY} A ${r} ${r} 0 ${cond(eq(largeArcFlag, 0), '0', '1')} ${sweep} ${startX} ${startY}`,
                      string`M ${startX} ${startY} A ${r} ${r} 0 ${cond(eq(largeArcFlag, 0), '0', '1')} ${sweep} ${endX} ${endY}`
                    )}
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
                      text={concat(finalValue)}
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
                </AnimatedSvg>
              </Animated.View>
            </TapGestureHandler>
          </Animated.View>
        </PanGestureHandler>
        {/* {
          buttons.map(({ value, buttonColor, textColor, }, i) => <Button key={i} {...{ aroundCount, canvasSize, value, textColor, buttonColor }} />)
        } */}

        {/* <Button {...{ aroundCount, canvasSize }} value={1} rotation={"-3.14rad"} /> */}
        {/* <Button {...{ aroundCount, canvasSize }} value={1} rotation={"-1.57rad"} /> */}

      </>
    );
  }
};
