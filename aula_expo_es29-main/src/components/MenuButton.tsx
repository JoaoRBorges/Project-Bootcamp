import React, { useState, useEffect } from 'react'
import { 
  TouchableOpacity, 
  StyleSheet, 
  Animated,
  ViewStyle
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors, Spacing, BorderRadius, Shadows } from '../styles/DesignSystem'

interface MenuButtonProps {
  onPress: () => void
  isOpen?: boolean
  style?: ViewStyle
}

export default function MenuButton({ onPress, isOpen = false, style }: MenuButtonProps) {
  const [rotationAnim] = useState(new Animated.Value(0))
  const [scaleAnim] = useState(new Animated.Value(1))

  useEffect(() => {
    Animated.parallel([
      Animated.timing(rotationAnim, {
        toValue: isOpen ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: isOpen ? 0.9 : 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      })
    ]).start()
  }, [isOpen])

  const rotation = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  })

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { rotate: rotation },
            { scale: scaleAnim }
          ]
        },
        style
      ]}
    >
      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Ionicons 
          name="ellipsis-horizontal" 
          size={24} 
          color={Colors.textPrimary} 
        />
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.medium,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
})
