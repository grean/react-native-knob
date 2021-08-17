export interface Vector<T = number> {
  x: T;
  y: T;
}

export const rotateCounterClock = (sx: number, sy: number, ox: number, oy: number, angle: number): Vector<number> => {
  'worklet'
  // changement origin
  const osx = sx - ox
  const osy = sy - oy
  // calcul matricielle rotation anti horraire
  const x = osx * Math.cos(angle) + osy * Math.sin(angle) + ox
  const y = -osx * Math.sin(angle) + osy * Math.cos(angle) + oy
  return ({ x, y });
}

export const getSpringConfig = (velocity: number = 400) => {
  'worklet'
  // console.log(velocity)
  return {
    stiffness: 10,
    damping: 5,
    mass: 1,
    overshootClamping: true,
    restSpeedThreshold: 10,
    restDisplacementThreshold: 10,
    velocity,
  }
}