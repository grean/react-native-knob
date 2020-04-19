import React from 'react';
import { View, PixelRatio } from 'react-native';
import CircularProgress from './CircularProgress';
export default class Knob extends React.Component {
    constructor(props) {
        super(props);
        this.onLayoutTimeout = 0;
        this.setValue = (val) => { if (this.state.cpRef.current !== null) {
            this.state.cpRef.current.setValue(val);
        } ; };
        this.onLayout = (event) => {
            // {nativeEvent: { layout: {x, y, width, height}}}
            const { width, height } = event.nativeEvent.layout;
            // clearTimeout(this.onLayoutTimeout);
            // this.onLayoutTimeout = setTimeout(() => {
            this.setState({
                canvasSize: this.props.canvasSize ?? PixelRatio.roundToNearestPixel(Math.min(width, height)),
                refreshKey: Math.random(),
            });
            // }, 10);
        };
        this.state = {
            cpRef: React.createRef(),
            // width: Dimensions.get('window').width,
            // height: Dimensions.get('window').height,
            // isLandscape: false,
            canvasSize: props.canvasSize,
            refreshKey: Math.random(),
        };
    }
    render() {
        const { margin, strokeWidth, rotation, value, maxValue, padding, strokeWidthDecoration, negative, colors, gradientExt, gradientInt, textStyle, textDisplay, callback, style } = this.props;
        const { cpRef, canvasSize, refreshKey } = this.state;
        const canvasSizeMarged = (canvasSize ?? 0) - margin * 2;
        return (<View style={[{
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
            <CircularProgress key={refreshKey.toString()} ref={cpRef} {...{ canvasSize: canvasSizeMarged, strokeWidth, rotation, value, maxValue, padding, strokeWidthDecoration, negative, colors, gradientInt, gradientExt, textStyle, textDisplay, callback }}/>
          </View>
        </View>
      </View>);
    }
}
Knob.defaultProps = {
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
    style: {},
    callback: () => { },
};
//# sourceMappingURL=Knob.js.map