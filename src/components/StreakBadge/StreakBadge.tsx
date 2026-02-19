import { StyleSheet, Text, View } from 'react-native'
import { fonts } from '../../constants'
import { Flame } from '../../assets/svgs'

type Props = {
  readonly count: number
}

/**
 * Streak badge with a flame icon and count.
 */
const StreakBadge = ({ count }: Props) => (
  <View style={styles.container}>
    <Flame />
    <Text style={styles.count}>{count}</Text>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginRight: 28,
  },
  count: {
    color: '#FF9500',
    fontSize: 18,
    fontFamily: fonts.semiBold,
  },
})

export default StreakBadge
