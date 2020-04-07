import * as React from 'react';
export interface Props {
    margin: number;
    padding: number;
    strokeWidth: number;
    strokeWidthDecoration: number;
    defaultValue: number;
    fullKnobValue: number;
    rotation: number;
    negative: boolean;
    colors: Array<string>;
    gradientInt: Array<StopGradient>;
    gradientExt: Array<StopGradient>;
    textStyle: object;
    textDisplay: boolean;
}
export interface StopGradient {
    offset: string;
    stopColor: string;
}
export default class Knob extends React.Component<Props> {
    render(): JSX.Element;
    static defaultProps: {
        margin: number;
        padding: number;
        strokeWidth: number;
        strokeWidthDecoration: number;
        defaultValue: number;
        fullKnobValue: number;
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
    };
}
//# sourceMappingURL=Knob.d.ts.map