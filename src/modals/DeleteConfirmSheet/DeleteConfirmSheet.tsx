import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { COLORS, FONTS } from '../../constants/theme'

type Props = {
  readonly visible: boolean
  readonly onConfirm: () => void
  readonly onCancel: () => void
}

/**
 * Bottom sheet confirmation dialog for deleting a habit stack.
 * Uses native slide animation from the bottom.
 */
const DeleteConfirmSheet = ({ visible, onConfirm, onCancel }: Props) => (
  <Modal visible={visible} animationType="slide" transparent>
    <View style={styles.overlay}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onCancel}>
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.7)']}
          style={StyleSheet.absoluteFill}
        />
      </Pressable>
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.title}>Delete habit?</Text>
        <Text style={styles.body}>This will remove the habit and cannot be undone.</Text>
        <Pressable style={styles.deleteButton} onPress={onConfirm}>
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable>
        <Pressable style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
      </View>
    </View>
  </Modal>
)

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.textSecondary,
    opacity: 0.4,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    color: COLORS.text,
    fontFamily: FONTS.bold,
    marginBottom: 8,
  },
  body: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
    textAlign: 'center',
    marginBottom: 24,
  },
  deleteButton: {
    width: '100%',
    backgroundColor: '#E53935',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  deleteText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: FONTS.bold,
  },
  cancelButton: {
    width: '100%',
    backgroundColor: COLORS.navbar,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    color: COLORS.text,
    fontFamily: FONTS.semiBold,
  },
})

export default DeleteConfirmSheet
