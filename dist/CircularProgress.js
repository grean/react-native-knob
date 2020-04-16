import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Defs, Stop, Path, Circle, RadialGradient } from 'react-native-svg';
import Animated, { lessThan, lessOrEq, greaterThan } from 'react-native-reanimated';
import { TapGestureHandler, State, PanGestureHandler } from 'react-native-gesture-handler';
import { ReText, string, interpolateColor } from 'react-native-redash';
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
const knobTapRef = React.createRef();
const knobPanRef = React.createRef();
export default class CircularProgress extends React.Component {
    constructor(props) {
        super(props);
        this.setValue = (value) => {
            // console.log('testCP');
            const { state, endAngle, aroundCount, α } = this.state;
            const { maxValue } = this.props;
            state.setValue(State.UNDETERMINED);
            endAngle.setValue(maxValue !== 0 ? value * 2 * Math.PI / maxValue : 0);
            aroundCount.setValue(Math.floor(maxValue !== 0 ? value / maxValue : 0));
        };
        const { PI } = Math;
        const { canvasSize, strokeWidth, value, maxValue, padding, strokeWidthDecoration } = this.props;
        const aroundCountTmp = Math.floor(maxValue !== 0 ? value / maxValue : 0);
        const startAngle = 0;
        const cx = canvasSize / 2;
        const cy = canvasSize / 2;
        const r = (canvasSize - strokeWidth) / 2 - padding;
        this.state = {
            ...{ cx, cy, r },
            plateRadius: (canvasSize - strokeWidthDecoration) / 2,
            canvasRadius: canvasSize / 2,
            startAngle: new Value(startAngle),
            endAngle: new Value(maxValue !== 0 ? value * 2 * PI / maxValue : 0),
            α: new Value(0),
            startX: cx + r * Math.cos(startAngle),
            startY: cy + r * Math.sin(startAngle),
            endX: new Value(0),
            endY: new Value(0),
            x: new Value(0),
            y: new Value(0),
            aroundCount: new Value(aroundCountTmp),
            colorIndex: new Value(aroundCountTmp),
            finalValue: new Value(0),
            previousAngle: new Value(0),
            deltaSign: new Value(0),
            translateX: new Value(0),
            translateY: new Value(0),
            state: new Value(State.UNDETERMINED),
            largeArcFlag: new Value(0),
            isFullCircle: new Value(0),
            sweep: '1',
            testCircle: new Value(0),
        };
    }
    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }
    // const [gradientIndex, setGradientIndex] = useState(0);
    render() {
        const { PI } = Math;
        // const { margin } = this.props;
        const { canvasSize, strokeWidth, rotation, strokeWidthDecoration, negative, colors, gradientInt, gradientExt, textStyle, textDisplay, callback } = this.props;
        const { colorIndex, x, y, state, cx, cy, r, startAngle, endAngle, canvasRadius, translateX, translateY, α, largeArcFlag, endX, endY, deltaSign, aroundCount, previousAngle, finalValue, plateRadius, sweep, startX, startY, isFullCircle, testCircle } = this.state;
        // isLandscape, 
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
        const onGestureEvent = event([
            {
                nativeEvent: {
                    x,
                    y,
                    state,
                },
            },
        ]);
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
        return (<>
        <Animated.Code>
          {() => block([
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
            cond(or(lessThan(translateX, 0), and(eq(translateX, 0), greaterThan(translateY, 0))), set(α, add(α, PI))),
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
                cond(greaterThan(abs(deltaSign), 4), cond(greaterThan(deltaSign, 0), cond(greaterThan(aroundCount, 0), set(aroundCount, sub(aroundCount, 1)), set(aroundCount, sub(aroundCount, negative ? 1 : 0))), set(aroundCount, add(aroundCount, 1))))
            ]),
            debug('deltaSign ', deltaSign),
            debug('aroundCount ', aroundCount),
            cond(lessThan(aroundCount, 0), [
                //inverse the logic if we are negative
                set(largeArcFlag, cond(lessOrEq(sub(endAngle, startAngle), PI), 1, 0)),
                set(colorIndex, cond(neq(endAngle, 0), add(aroundCount, 1), aroundCount)),
            ], [
                set(colorIndex, aroundCount),
            ]),
            // debug(concat("M ", endX, " ", endY, " A ", r, " ", r, " 0 ", largeArcFlag, " ", sweep, " ", startX, " ", startY), 0),
            debug('colorIndex ', colorIndex),
            debug('largeArcFlag ', largeArcFlag),
            // call([aroundCount], ([aroundCount]) => setGradientIndex(aroundCount)),
            // onChange(aroundCount, call() => ),
            set(previousAngle, endAngle),
            // set(testCircle, abs(divide(endAngle, 2 * PI))),
            // debug('testCircle ', testCircle),
            // set(isFullCircle, eq(abs(divide(endAngle, 2 * PI)), 1)),
            // debug('isFullCircle ', isFullCircle),
            // set(finalValue, round(add(multiply(divide(endAngle, 2 * PI), 100), multiply(100,
            //   cond(isFullCircle,
            //     sub(aroundCount, 1),
            //     aroundCount
            //   )
            // )))),
            onChange(finalValue, call([finalValue], callback)),
            debug('finalValue ', finalValue),
        ])}
        </Animated.Code>
        <PanGestureHandler ref={knobPanRef} simultaneousHandlers={knobTapRef} onHandlerStateChange={onGestureEvent} onGestureEvent={onGestureEvent}>
          <Animated.View style={{
            ...StyleSheet.absoluteFillObject,
            transform: [
                { rotateZ },
            ],
        }}>
            <TapGestureHandler ref={knobTapRef} simultaneousHandlers={knobPanRef} onHandlerStateChange={onGestureEvent} onGestureEvent={onGestureEvent}>
              <Animated.View collapsable={false} style={{
            ...StyleSheet.absoluteFillObject,
        }}>

                <AnimatedSvg width={canvasSize} height={canvasSize} viewBox={`0 0 ${canvasSize} ${canvasSize}`}>
                  <Defs>
                    
                    
                    
                    
                    <RadialGradient id="radialPlateInt">
                      {gradientInt.map(({ offset, stopColor }, i) => <Stop key={i} {...{ offset, stopColor }}/>)}
                    </RadialGradient>
                    <RadialGradient id="radialPlateExt">
                      {gradientExt.map(({ offset, stopColor }, i) => <Stop key={i} {...{ offset, stopColor }}/>)}
                    </RadialGradient>
                  </Defs>

                  
                  <AnimatedCircle {...{ strokeWidth: strokeWidthDecoration, cx, cy, r: plateRadius }} stroke="url(#radialPlateExt)" 
        // stroke={plateColor}
        fill="none"/>
                  
                  <AnimatedCircle {...{ cx, cy, r }} fill="url(#radialPlateInt)"/>
                  <AnimatedCircle {...{ strokeWidth, cx, cy, r }} 
        // stroke={`url(#gradient-${aroundCount})`}
        // stroke={'url(#gradient-0)'}
        // stroke="url(#plate)"
        stroke={bgColor} fill="none"/>
                  <AnimatedPath 
        // stroke={concat("url(#gradient-", aroundCount, ")")}
        // stroke={'url(#gradient-1)'}
        // stroke="url(#grad)"
        stroke={fgColor} fill="none" 
        // d="M 95 0 A 10 10 0 0 1 200 200"
        d={cond(lessThan(finalValue, 0), 
        //inverse the logic if we are negative
        string `M ${endX} ${endY} A ${r} ${r} 0 ${cond(eq(largeArcFlag, 0), '0', '1')} ${sweep} ${startX} ${startY}`, string `M ${startX} ${startY} A ${r} ${r} 0 ${cond(eq(largeArcFlag, 0), '0', '1')} ${sweep} ${endX} ${endY}`)} 
        // d={cond(lessThan(aroundCount, 0),
        //   //inverse the logic if we are negative
        //   string`M ${endX} ${endY} A ${r} ${r} 0 ${cond(eq(largeArcFlag, 0), '0', '1')} ${sweep} ${startX} ${startY}`,
        //   string`M ${startX} ${startY} A ${r} ${r} 0 ${largeArcFlag} ${sweep} ${endX} ${endY}`
        // )}
        {...{ strokeWidth }}/>
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
        }}>
                    <ReText text={concat(finalValue)} style={{
            ...{
                color: 'white',
                // borderColor: plateColor,
                // borderWidth: 1,
                // width: canvasSize * 0.5,
                textAlign: 'center',
                fontSize: canvasSize / 8,
            }, ...textStyle
        }}/>
                  </Animated.View>}
                </AnimatedSvg>
              </Animated.View>
            </TapGestureHandler>
          </Animated.View>
        </PanGestureHandler>
        

        
        

      </>);
    }
}
;
//# sourceMappingURL=CircularProgress.js.map