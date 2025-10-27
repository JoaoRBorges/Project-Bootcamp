import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export default function SupportPage() {
  const openWhatsApp = () => {
    const phoneNumber = '5511999999999' // Substitua pelo número real
    const message = 'Olá! Preciso de ajuda com o app de doações.'
    const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`
    
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url)
        } else {
          Alert.alert('Erro', 'WhatsApp não está instalado no seu dispositivo')
        }
      })
      .catch((err) => console.error('Error opening WhatsApp:', err))
  }

  const openEmail = () => {
    const email = 'suporte@doacoesapp.com' // Substitua pelo email real
    Linking.openURL(`mailto:${email}?subject=Suporte - App Doações`)
  }

  const openPhone = () => {
    const phone = '0800-123-4567' // Substitua pelo telefone real
    Linking.openURL(`tel:${phone}`)
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="help-circle-outline" size={60} color="#007AFF" />
        <Text style={styles.title}>Suporte</Text>
        <Text style={styles.subtitle}>Estamos aqui para ajudar você</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contato Direto</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={openWhatsApp}>
          <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
          <Text style={styles.menuText}>WhatsApp</Text>
          <Text style={styles.menuSubtext}>Resposta rápida</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={openEmail}>
          <Ionicons name="mail-outline" size={24} color="#666" />
          <Text style={styles.menuText}>Email</Text>
          <Text style={styles.menuSubtext}>suporte@doacoesapp.com</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={openPhone}>
          <Ionicons name="call-outline" size={24} color="#666" />
          <Text style={styles.menuText}>Telefone</Text>
          <Text style={styles.menuSubtext}>0800-123-4567</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Central de Ajuda</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="help-outline" size={24} color="#666" />
          <Text style={styles.menuText}>Perguntas Frequentes</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="book-outline" size={24} color="#666" />
          <Text style={styles.menuText}>Tutoriais</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="videocam-outline" size={24} color="#666" />
          <Text style={styles.menuText}>Vídeos de Ajuda</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Relatar Problema</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="bug-outline" size={24} color="#FF5722" />
          <Text style={styles.menuText}>Reportar Bug</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="bulb-outline" size={24} color="#FF9800" />
          <Text style={styles.menuText}>Sugerir Melhoria</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sobre o App</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="information-circle-outline" size={24} color="#666" />
          <Text style={styles.menuText}>Versão 1.0.0</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="shield-checkmark-outline" size={24} color="#666" />
          <Text style={styles.menuText}>Política de Privacidade</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="document-text-outline" size={24} color="#666" />
          <Text style={styles.menuText}>Termos de Uso</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  menuSubtext: {
    fontSize: 12,
    color: '#999',
    marginRight: 10,
  },
})

