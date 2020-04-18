import React from 'react';
import { LayoutChangeEvent } from 'react-native';
import CircularProgress from './CircularProgress';
export interface KnobProps {
    margin: number;
    padding: number;
    strokeWidth: number;
    strokeWidthDecoration: number;
    value: number;
    maxValue: number;
    rotation: number;
    negative: boolean;
    colors: Array<string>;
    gradientInt: Array<StopGradient>;
    gradientExt: Array<StopGradient>;
    style: object;
    textStyle: object;
    textDisplay: boolean;
    callback: (values: readonly number[]) => void;
    canvasSize: number | undefined;
}
export interface StopGradient {
    offset: string;
    stopColor: string;
}
export interface KnobState {
    cpRef: React.RefObject<CircularProgress>;
    canvasSize: number | undefined;
    refreshKey: number;
}
export default class Knob extends React.Component<KnobProps, KnobState> {
    constructor(props: KnobProps);
    onLayoutTimeout: number;
    setValue: (val: number) => void;
    onLayout: (event: LayoutChangeEvent) => void;
    render(): JSX.Element;
    static defaultProps: {
        margin: number;
        padding: number;
        strokeWidth: number;
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
        style: {};
    };
}
//# sourceMappingURL=Knob.d.ts.map