import { Pressable, StyleSheet, Text, View } from 'react-native'
import { FONTS } from '../../constants/theme'
import Flame from '../../assets/Flame'

type Props = {
  readonly count: number
  readonly small?: boolean
  readonly onPress?: () => void
}

/**
 * Streak badge with a flame icon and count.
 * Use small for compact display within cards.
 * Optionally pressable via onPress.
 */
const StreakBadge = ({ count, small, onPress }: Props) => {
  const inner = (
    <View style={[styles.container, small && styles.containerSmall]}>
      <Flame size={small ? 14 : 24} />
      <Text style={[styles.count, small && styles.countSmall]}>{count}</Text>
    </View>
  )

  return onPress ? (
    <Pressable onPress={onPress} hitSlop={8}>{inner}</Pressable>
  ) : inner
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginRight: 28,
  },
  containerSmall: {
    gap: 3,
    marginRight: 0,
  },
  count: {
    color: '#FF9500',
    fontSize: 18,
    fontFamily: FONTS.semiBold,
  },
  countSmall: {
    fontSize: 12,
  },
})

export default StreakBadge
