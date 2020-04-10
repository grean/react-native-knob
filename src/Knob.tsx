import * as React from 'react';
import { Dimensions, View, StyleSheet, Text } from 'react-native';

import CircularProgress from './CircularProgress';

export interface Props {
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
  textStyle: object;
  textDisplay: boolean;
}

export interface StopGradient {
  offset: string;
  stopColor: string;
}

export default class Knob extends React.Component<Props> {
  render() {
    // const { margin } = this.props;
    const { margin, strokeWidth, rotation, value, maxValue, padding, strokeWidthDecoration, negative, colors, gradientExt, gradientInt, textStyle, textDisplay } = this.props;

    const { width } = Dimensions.get('window');
    const canvasSize = width - margin;

    return (
      <View style={{
        height: canvasSize,
        width: canvasSize,
      }}>
        <CircularProgress {...{ canvasSize, strokeWidth, rotation, value, maxValue, padding, strokeWidthDecoration, negative, colors, gradientInt, gradientExt, textStyle, textDisplay }} />
        {/* <CircularProgress {...{ canvasSize }} {...this.props} /> */}
      </View>
    );
  }
  static defaultProps = {
    margin: 0,
    padding: 0,
    strokeWidth: 90,
    strokeWidthDecoration: 30,
    value: 25,
    maxValue: 100,
    rotation: -Math.PI / 2,
    negative: true,
    colors: ['#F0EFF5', '#00b5ad', '#2185D0', '#B5CC18', '#FBBD08', '#F2711C', '#DB2828', '#E03997', '#6435C9', '#A5673F', '#AAA', '#888', '#666', '#444', '#222', '#000'],
    gradientInt: [{ offset: '50%', stopColor: '#000' }, { offset: '80%', stopColor: '#fff' }],
    gradientExt: [{ offset: '100%', stopColor: '#fff' }, { offset: '90%', stopColor: '#000' }],
    textDisplay: true,
  };
}
