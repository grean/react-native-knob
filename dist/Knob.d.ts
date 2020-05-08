import React from 'react';
import { LayoutChangeEvent } from 'react-native';
import CircularProgress from './CircularProgress';
export interface KnobProps {
    margin: number | string;
    padding: number | string;
    strokeWidth: number | string;
    strokeWidthDecoration: number;
    value: number;
    maxValue: number;
    rotation: number;
    negative: boolean;
    colors: Array<string>;
    gradientInt: Array<StopGradient>;
    gradientExt: Array<StopGradient>;
    style: object;
    textStyle: TextStyle;
    textDisplay: boolean;
    callback: (values: readonly number[]) => void;
    callbackInit: (values: readonly number[]) => void;
    canvasSize: number | undefined;
    textUnit: string;
}
export interface StopGradient {
    offset: string;
    stopColor: string;
}
export interface TextStyle {
    color: string;
    textAlign: "auto" | "center" | "left" | "right" | "justify" | undefined;
    fontSize: string;
}
export interface KnobState {
    cpRef: React.RefObject<CircularProgress>;
    canvasSize: number | undefined;
    refreshKey: number;
}
export default class Knob extends React.Component<KnobProps, KnobState> {
    constructor(props: KnobProps);
    setValue: (val: number) => void;
    initKnob: () => void;
    resetInit: () => void;
    onLayout: (event: LayoutChangeEvent) => void;
    render(): JSX.Element;
    static defaultProps: {
        margin: number;
        padding: number;
        strokeWidth: string;
        strokeWidthDecoration: number;
        value: number;
        maxValue: number;
        rotation: number;
        negative: boolean;
        colors: string[];
        gradientInt: {
            offset: string;
            stopColor: string;
        }[];
        gradientExt: {
            offset: string;
            stopColor: string;
        }[];
        textDisplay: boolean;
        textStyle: {};
        style: {};
        callback: () => void;
        calbackInit: () => void;
        textUnit: string;
    };
}
//# sourceMappingURL=Knob.d.ts.map