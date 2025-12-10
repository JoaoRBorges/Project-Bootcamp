import React, { useState, useEffect, useContext } from 'react'
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  Animated, 
  Dimensions,
  StatusBar,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../styles/DesignSystem'
import AuthContext from '../contexts/AuthContext'
import { SafeAreaView } from 'react-native-safe-area-context'

const { width, height } = Dimensions.get('window')

interface SideMenuProps {
  navigation: any
  visible: boolean
  onClose: () => void
}

export default function SideMenu({ navigation, visible, onClose }: SideMenuProps) {
  const [slideAnim] = useState(new Animated.Value(-width))
  const [fadeAnim] = useState(new Animated.Value(0))
  const { user, signOut } = useContext(AuthContext)
  const isOng = user?.role === 'ong'

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -width,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        })
      ]).start()
    }
  }, [visible])

  const navigateTo = (screen: string) => {
    navigation.navigate(screen)
    onClose()
  }

  const handleLogout = () => {
    onClose()
    signOut()
  }

  const baseMenuItems = [
    { 
      id: 'Map', 
      title: 'Mapa', 
      icon: 'map-outline', 
      color: Colors.primary,
      description: 'Encontre ONGs próximas'
    },
    { 
      id: 'List', 
      title: 'Lista', 
      icon: 'list-outline', 
      color: Colors.secondary,
      description: 'Seus locais salvos'
    },
    { 
      id: 'Profile', 
      title: 'Perfil', 
      icon: 'person-outline', 
      color: Colors.warning,
      description: 'Suas informações'
    },
    { 
      id: 'ONG', 
      title: 'ONGs', 
      icon: 'business-outline', 
      color: Colors.success,
      description: 'ONGs próximas'
    },
    { 
      id: 'Support', 
      title: 'Suporte', 
      icon: 'help-circle-outline', 
      color: Colors.info,
      description: 'Central de ajuda'
    },
    { 
      id: 'Settings', 
      title: 'Configurações', 
      icon: 'settings-outline', 
      color: Colors.textSecondary,
      description: 'Preferências'
    },
  ]
  const menuItems = isOng
    ? baseMenuItems.filter(item => ['Profile', 'Support', 'Settings'].includes(item.id))
    : baseMenuItems

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <StatusBar backgroundColor="rgba(0, 0, 0, 0.5)" barStyle="light-content" />
      
      <View style={styles.overlay}>
        <Animated.View 
          style={[
            styles.backdrop, 
            { opacity: fadeAnim }
          ]} 
        >
          <TouchableOpacity 
            style={styles.backdropTouch} 
            onPress={onClose}
            activeOpacity={1}
          />
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.menu, 
            { transform: [{ translateX: slideAnim }] }
          ]}
        >
          <SafeAreaView style={styles.menuContent} edges={['top', 'bottom']}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatarBackground}>
                  <Ionicons name="person-circle" size={60} color={Colors.primary} />
                </View>
              </View>
              <Text style={styles.userName}>{user?.name ?? 'Usuário'}</Text>
              <Text style={styles.userEmail}>{user?.email ?? 'usuario@email.com'}</Text>
            </View>

            {/* Menu Items */}
            <View style={styles.menuSection}>
              {menuItems.map((item, index) => (
                <TouchableOpacity 
                  key={item.id}
                  style={[
                    styles.menuItem,
                    index === menuItems.length - 1 && styles.lastMenuItem
                  ]}
                  onPress={() => navigateTo(item.id)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                    <Ionicons name={item.icon as any} size={24} color={item.color} />
                  </View>
                  <View style={styles.menuItemContent}>
                    <Text style={styles.menuItemTitle}>{item.title}</Text>
                    <Text style={styles.menuItemDescription}>{item.description}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={Colors.textTertiary} />
                </TouchableOpacity>
              ))}
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <View style={styles.footerDivider} />
              <View style={styles.footerContent}>
                <View style={styles.versionContainer}>
                  <Ionicons name="information-circle-outline" size={16} color={Colors.textTertiary} />
                  <Text style={styles.versionText}>Versão 1.0.0</Text>
                </View>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                  <Ionicons name="log-out-outline" size={16} color={Colors.error} />
                  <Text style={styles.logoutText}>Sair</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdropTouch: {
    flex: 1,
  },
  menu: {
    width: width * 0.85,
    backgroundColor: Colors.surface,
    height: '100%',
    ...Shadows.large,
  },
  menuContent: {
    flex: 1,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: Spacing.md,
  },
  avatarBackground: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.round,
    padding: Spacing.xs,
    ...Shadows.medium,
  },
  userName: {
    ...Typography.h4,
    color: Colors.textInverse,
    marginBottom: Spacing.xs,
  },
  userEmail: {
    ...Typography.body2,
    color: Colors.textInverse,
    opacity: 0.8,
  },
  menuSection: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    ...Typography.body1,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  menuItemDescription: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  footerDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginBottom: Spacing.md,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  versionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  versionText: {
    ...Typography.caption,
    color: Colors.textTertiary,
    marginLeft: Spacing.xs,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.error + '10',
  },
  logoutText: {
    ...Typography.caption,
    color: Colors.error,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
})
