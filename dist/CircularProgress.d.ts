/// <reference types="react" />
import { StopGradient } from './Knob';
interface CircularPogressProps {
    canvasSize: number;
    strokeWidth: number;
    defaultValue: number;
    fullKnobValue: number;
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
declare const _default: ({ canvasSize, strokeWidth, rotation, defaultValue, fullKnobValue, padding, strokeWidthDecoration, negative, colors, gradientInt, gradientExt, textStyle, textDisplay }: CircularPogressProps) => JSX.Element;
export default _default;
//# sourceMappingURL=CircularProgress.d.ts.map