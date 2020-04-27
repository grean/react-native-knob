import React from 'react';
import Animated from 'react-native-reanimated';
import { State } from 'react-native-gesture-handler';
import { StopGradient, TextStyle } from './Knob';
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
    textStyle: TextStyle;
    textDisplay: boolean;
    callback: (values: readonly number[]) => void;
    callbackInit: (values: readonly number[]) => void;
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
    counterclockwise: Animated.Value<0 | 1>;
    init: Animated.Value<0 | 1>;
}
export default class CircularProgress extends React.Component<CircularPogressProps, CircularPogressState> {
    constructor(props: CircularPogressProps);
    shouldComponentUpdate(nextProps: CircularPogressProps, nextState: CircularPogressState): boolean;
    setValue: (value: number) => void;
    initKnob: () => void;
    resetInit: () => void;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=CircularProgress.d.ts.map