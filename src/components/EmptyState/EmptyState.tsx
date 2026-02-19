import { StyleSheet, Text, View } from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { COLORS, FONTS } from '../../constants/theme'
import { EmptyStateVariant } from '../../types/task'

type Props = {
  readonly variant: EmptyStateVariant
}

type VariantConfig = {
  readonly icon: React.ComponentProps<typeof MaterialCommunityIcons>['name']
  readonly message: string
}

const VARIANT_CONFIG: Record<EmptyStateVariant, VariantConfig> = {
  [EmptyStateVariant.TodoEmpty]: { icon: 'weather-night', message: 'Empty day today, chill out' },
  [EmptyStateVariant.TodoAllDone]: { icon: 'check-all', message: 'Great job! Time to chill out' },
  [EmptyStateVariant.HabitsEmpty]: { icon: 'calendar-blank-outline', message: 'No habits scheduled today' },
}

/**
 * Full-area empty state shown when no items are available for the selected day.
 */
const EmptyState = ({ variant }: Props) => {
  const { icon, message } = VARIANT_CONFIG[variant]
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name={icon} size={64} color={COLORS.accent} style={styles.icon} />
      <Text style={styles.message}>{message}</Text>
    </View>
  )
}

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
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
  },
})

export default EmptyState
