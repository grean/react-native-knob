import React, { useEffect, useState } from 'react'
import { View, LayoutChangeEvent, StyleSheet, ViewStyle, LayoutRectangle, Text } from 'react-native'
import Svg from 'react-native-svg';

import CircularProgress from './CircularProgress'


interface ViewportProps {
  count?: number
  delays?: number[]
  durations?: number[]
  // easing?: Animated.EasingFunction[]
  radius?: number[]
  strokeWidth?: number[]
  style?: ViewStyle
  values?: number[]
}

const Viewport = ({
  count = 1,
  delays = [0, 200, 400],
  durations = [3000, 3000, 3000],
  // easing = [
  //   Easing.linear,
  //   Easing.bounce,
  //   Easing.bounce
  // ],
  radius = [0.3, 0.2, 0.1],
  strokeWidth = [2, 2, 2],
  style,
  // values = [0.75]
  values = [1.2, 0.25, 0.33, 0.75, 0.999]
}: ViewportProps) => {
  const [layout, setLayout] = useState<LayoutRectangle | null>(null);
  const width = layout?.width ?? 0
  const height = layout?.height ?? 0

  const canvasSize = Math.min(height, width)

  const margin = canvasSize * 0.07
  const texViewSize = (canvasSize - margin * values.length)
  const textViewSizeWidth = texViewSize * 0.4
  const textViewSizeHeight = texViewSize * 0.2
  const centerText = '2000'

  return (
    <View
      onLayout={({ nativeEvent: { layout } }: LayoutChangeEvent) => {
        // console.log(`Viewport LAYOUT width ${layout.width} height ${layout.height}`)
        setLayout(layout)
      }}
      style={{ flex: 1, ...style }}
    >
      {layout && <>
        <Svg
          {...{
            viewBox: `0 0  ${width} ${height}`,
            width: '100%',
            height: '100%',
            // fill: "none",
            // preserveAspectRatio: "none",
          }}
        >
          {
            values.map((value, key) =>
              <CircularProgress
                {...{
                  // radius: width / 2,
                  // delay: delays[key],
                  // duration: durations[key],
                  // easing: easing[key],
                  canvasSize,
                  key,
                  index: key,
                  margin,
                  // radius: width / key + 1,
                  // strokeWidth: strokeWidth[key],
                  // style,
                  value,
                  // width,
                }}
              />
            )
          }
        </Svg>
        <View style={{
          position: 'absolute',
          zIndex: 1000,
          height: textViewSizeHeight,
          width: textViewSizeWidth,
          top: canvasSize / 2 - textViewSizeHeight / 2,
          left: canvasSize / 2 - textViewSizeWidth / 2,
          // height: canvasSize * fontSizePercent * 2,
          // width: canvasSize * fontSizePercent * 4,
          // top: canvasSize / 2 - canvasSize * fontSizePercent,
          // left: canvasSize / 2 - canvasSize * fontSizePercent * 2 - yOffset,
          // justifyContent: 'space-evenly',
          // backgroundColor: 'green',
          // borderColor: plateColor,
          // borderWidth: 1,
          justifyContent: 'center',
          // alignContent: 'center',
          // alignSelf: 'center',
        }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: textViewSizeWidth * 0.5,
              fontFamily: 'cookie',
            }}
          >
            {centerText}
          </Text>
        </View>
      </>}
    </View>
  )
}

export default Viewport
