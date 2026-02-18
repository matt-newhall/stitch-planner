import { StyleSheet, Text, View } from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { colors, fonts } from '../../constants'

type Props = {
  readonly variant: 'empty' | 'allDone'
}

/**
 * Full-area empty state shown when no tasks are pending for the selected day.
 */
const EmptyState = ({ variant }: Props) => (
  <View style={styles.container}>
    <MaterialCommunityIcons
      name={variant === 'allDone' ? 'check-all' : 'weather-night'}
      size={64}
      color={colors.accent}
      style={styles.icon}
    />
    <Text style={styles.message}>
      {variant === 'allDone' ? 'Great job! Time to chill out' : 'Empty day today, chill out'}
    </Text>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingBottom: 48,
  },
  icon: {
    opacity: 0.85,
  },
  message: {
    fontSize: 15,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
  },
})

export default EmptyState
