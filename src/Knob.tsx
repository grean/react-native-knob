import React from 'react';
import { View, LayoutChangeEvent, PixelRatio } from 'react-native';

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
  canvasSize: number | undefined,
  refreshKey: number,
}

export default class Knob extends React.Component<KnobProps, KnobState> {
  constructor(props: KnobProps) {
    super(props);
    this.state = {
      cpRef: React.createRef<CircularProgress>(),
      canvasSize: props.canvasSize,
      refreshKey: Math.random(),
    }
  }

  setValue = (val: number) => {
    if (this.state.cpRef.current !== null) {
      this.state.cpRef.current.setValue(val)
    };
  }

  initKnob = () => {
    if (this.state.cpRef.current !== null) {
      this.state.cpRef.current.initKnob();
    };
  };

  resetInit = () => {
    if (this.state.cpRef.current !== null) {
      this.state.cpRef.current.resetInit();
    }
  }

  onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    this.setState({
      canvasSize: this.props.canvasSize ?? PixelRatio.roundToNearestPixel(Math.min(width, height)),
      refreshKey: Math.random(),
    });
  }

  render() {
    const { margin, strokeWidth, rotation, value, maxValue, padding, strokeWidthDecoration, negative, colors, gradientExt, gradientInt, textStyle, textDisplay, callback, style, callbackInit, textUnit } = this.props;
    const { cpRef, canvasSize, refreshKey } = this.state;


    const marginComputed = typeof margin === 'string' ? Number.parseFloat(margin.replace('%', '')) / 100 * (canvasSize ?? 0) : margin
    const paddingComputed = typeof padding === 'string' ? Number.parseFloat(padding.replace('%', '')) / 100 * (canvasSize ?? 0) : padding
    const strokeWidthComputed = typeof strokeWidth === 'string' ? Number.parseFloat(strokeWidth.replace('%', '')) / 100 * (canvasSize ?? 0) : strokeWidth

    const canvasSizeMarged = (canvasSize ?? 0) - marginComputed * 2;

    return (
      <View style={[{
        flex: 1,
        alignSelf: 'stretch',
      }, style]}>
        <View onLayout={this.onLayout} style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <View style={{
            height: canvasSizeMarged,
            width: canvasSizeMarged,
          }}>
            <CircularProgress
              key={refreshKey.toString()}
              ref={cpRef}
              {...{ canvasSize: canvasSizeMarged, strokeWidth: strokeWidthComputed, rotation, value, maxValue, padding: paddingComputed, strokeWidthDecoration, negative, colors, gradientInt, gradientExt, textStyle, textDisplay, callback, callbackInit, textUnit }}
            />
          </View>
        </View>
      </View >
    );
  }
  static defaultProps = {
    margin: 0,
    padding: 0,
    strokeWidth: '20%',
    strokeWidthDecoration: 30,
    value: 25,
    maxValue: 100,
    rotation: -Math.PI / 2,
    negative: true,
    colors: ['#F0EFF5', '#00b5ad', '#2185D0', '#B5CC18', '#FBBD08', '#F2711C', '#DB2828', '#E03997', '#6435C9', '#A5673F', '#AAA', '#888', '#666', '#444', '#222', '#000'],
    gradientInt: [{ offset: '50%', stopColor: '#000' }, { offset: '80%', stopColor: '#fff' }],
    gradientExt: [{ offset: '100%', stopColor: '#fff' }, { offset: '90%', stopColor: '#000' }],
    textDisplay: true,
    textStyle: {},
    style: {},
    callback: () => { },
    calbackInit: () => { },
    textUnit: '',
  };
}
