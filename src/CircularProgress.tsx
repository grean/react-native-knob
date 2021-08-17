import React, { useEffect, useState } from 'react'
import { View, LayoutChangeEvent, StyleSheet, ViewStyle, LayoutRectangle } from 'react-native'
import Animated, { Easing, Extrapolate, interpolate, useAnimatedProps, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated'
import { withSpring } from 'react-native-reanimated';
import Svg, { Circle, Path, Rect, Text, TextPath } from 'react-native-svg';
import { rotateCounterClock, getSpringConfig } from './Utils'
import { processFontFamily } from 'expo-font';


const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);



interface CircularPogressProps {
  // angle in radian unit
  // angle?: Animated.SharedValue<number>
  // delay: number
  // duration: number
  // easing: Animated.EasingFunction
  canvasSize: number
  index: number
  colors?: string[]
  margin: number
  // radius?: number
  // strokeWidth?: number
  textOffsets?: number[]
  value: number
  // width: number
}

const CircularPogress = ({
  // angle = Math.PI * 1.999,
  // angle = Math.PI,
  canvasSize,
  colors = ['rgb(192,192,192)', 'rgb(0,0,255)', 'rgb(255,0,0)'],
  // angle = 3 * Math.PI / 2,
  // angle = -2 * Math.PI / 3,
  // delay,
  // duration,
  // easing,
  // height,
  index,
  margin,
  // radius,
  // strokeWidth,
  textOffsets = [4.6, 4.6, 4.6, 4.6, 4.6],
  value,
  // width,
}: CircularPogressProps) => {
  const alpha = useSharedValue(0);
  // const radius = width * radius;

  // useEffect(() => {
  //   console.log(`useEffect loader`)
  //   r.value = withRepeat(withDelay(delay, withTiming(radius, {
  //     duration,
  //     easing,
  //   })), -1, false)
  // }, [])


  // value of the radius
  const strokeWidth = 6
  const r = canvasSize / 2 - ((index + 1) * margin)
  const ox = canvasSize / 2
  const oy = ox
  const padding = ox - r
  // const padding = width / 2 - r
  // coord start x in polar system with center at (r,r)
  const sx = r + padding
  // coord start y in polar system with center at (r,r)
  const sy = padding
  // A = absolute coord from top left corner to, a = relative coord from start point
  const arcMode = 'A'
  // const arcMode = 'a'
  // rx = x radius of ellipse
  const rx = r
  // ry = y radius of ellipse
  const ry = r
  // rotation of the ellipse in degrees
  const rotation = 0
  // clockwise drawing = 1, counterclockwise drawing = 0
  const clockwiseDraw = 1

  alpha.value = withTiming(value, {
    duration: 1000,
    // easing: Easing.out(easeInOutQuad),
  })

  const arcProps = useAnimatedProps(() => {
    const absAngle = alpha.value * 2 * Math.PI
    const roundCount = Math.trunc(alpha.value)
    const angle = absAngle - (roundCount * 2 * Math.PI)
    // if angle < Pi then draw small arc (0) otherwise draw big arc (1)
    const littleArc = Math.abs(angle) < Math.PI
    const arcType = littleArc ? 0 : 1
    console.log(`index ${index} absAngle ${absAngle} angle ${angle} roundCount ${roundCount}, color ${colors[roundCount + 1]}`)
    const { x: ex, y: ey } = rotateCounterClock(sx, sy, ox, oy, -angle)

    const d = `M ${sx},${sy} ${arcMode} ${rx} ${ry} ${rotation} ${arcType} ${clockwiseDraw} ${ex},${ey}`

    return {
      d,
      stroke: colors[roundCount + 1],
    };
  });
  const circleProps = useAnimatedProps(() => {
    const roundCount = Math.trunc(alpha.value)
    return {
      stroke: colors[roundCount],
    };
  });

  return (
    <>
      <AnimatedCircle
        {...{
          animatedProps: circleProps,
          cx: ox,
          // cx: -scrollX.value / index - part / 2,
          cy: oy,
          id: `pathText${index}`,
          r: r + strokeWidth,
          // stroke: 'black',
          stroke: 'transparent',
          strokeWidth,
          fill: 'transparent',
        }}
      />
      <AnimatedCircle
        {...{
          animatedProps: circleProps,
          cx: ox,
          // cx: -scrollX.value / index - part / 2,
          cy: oy,
          r,
          // stroke: 'black',
          stroke: colors[0],
          strokeWidth,
          fill: 'transparent',
        }}
      />
      <AnimatedPath
        {...{
          // d,
          animatedProps: arcProps,
          strokeWidth,
          stroke: "blue",
          fill: 'transparent',
        }}
      />
      <Text
        {...{
          fontFamily: processFontFamily('cookie') ?? undefined,
          fontSize: canvasSize * 0.07,
          fill: 'black',
          // textAnchor,
          dy: r * 0.01,
          fontWeight: 'bold',
        }}>
        <TextPath
          {...{
            startOffset: r * textOffsets[index],
            href: `#pathText${index}`
          }}>
          {'legendText'}
        </TextPath>
      </Text>
    </>
  )
}



export default CircularPogress
