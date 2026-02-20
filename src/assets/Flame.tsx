import Svg, { Path } from 'react-native-svg'

const OUTER = 'M 12 27 C 6 27 2 22 2 17 C 2 11 5 8 12 4 C 11 8 13.5 11 12 15 C 15.5 10 17 7 16 3.5 C 20 7 22 12 22 17 C 22 22 18 27 12 27 Z'
const INNER = 'M 12 22 C 9.5 22 8 20 8 18 C 8 15.5 9.5 14 12 12 C 11.5 14 13 15.5 12 17 C 14 15 15 13.5 14.5 12 C 16.5 13.5 16 16 16 18 C 16 20 14.5 22 12 22 Z'

type Props = {
  readonly size?: number
}

/** Flame SVG icon, proportionally scaled by width. */
const Flame = ({ size = 24 }: Props) => (
  <Svg width={size} height={Math.round(size * 28 / 24)} viewBox="0 0 24 28">
    <Path d={OUTER} fill="#FF9500" stroke="white" strokeWidth={1.8} strokeLinejoin="round" strokeLinecap="round" />
    <Path d={INNER} fill="#FFD000" />
  </Svg>
)

export default Flame
