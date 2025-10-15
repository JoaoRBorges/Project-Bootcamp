import React from 'react'
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Linking, 
  ScrollView,
  Alert 
} from 'react-native'
import { RouteProp, useRoute } from '@react-navigation/native'

interface NearbyONG {
  id: string
  name: string
  address: string
  phone?: string
  email?: string
  latitude: number
  longitude: number
}

type ONGDetailsRouteProp = RouteProp<{
  params: { ong: NearbyONG }
}, 'params'>

export default function ONGDetailsPage() {
  const route = useRoute<ONGDetailsRouteProp>()
  const { ong } = route.params

  const openWhatsApp = () => {
    if (ong.phone) {
      // Remove non-numeric characters from phone
      const phoneNumber = ong.phone.replace(/\D/g, '')
      const message = `Olá, encontrei vocês no mapa e gostaria de saber mais sobre doações.`
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
    } else {
      Alert.alert('Aviso', 'Número de telefone não disponível')
    }
  }

  const openEmail = () => {
    if (ong.email) {
      Linking.openURL(`mailto:${ong.email}`)
    } else {
      Alert.alert('Aviso', 'Email não disponível')
    }
  }

  const callPhone = () => {
    if (ong.phone) {
      Linking.openURL(`tel:${ong.phone}`)
    } else {
      Alert.alert('Aviso', 'Número de telefone não disponível')
    }
  }

  const openMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${ong.latitude},${ong.longitude}`
    Linking.openURL(url)
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{ong.name}</Text>
        
        <View style={styles.section}>
          <Text style={styles.label}>Endereço:</Text>
          <Text style={styles.text}>{ong.address}</Text>
          <TouchableOpacity style={styles.linkButton} onPress={openMaps}>
            <Text style={styles.linkButtonText}>📍 Ver no Mapa</Text>
          </TouchableOpacity>
        </View>

        {ong.phone && (
          <View style={styles.section}>
            <Text style={styles.label}>Telefone:</Text>
            <Text style={styles.text}>{ong.phone}</Text>
            <TouchableOpacity style={styles.linkButton} onPress={callPhone}>
              <Text style={styles.linkButtonText}>📞 Ligar</Text>
            </TouchableOpacity>
          </View>
        )}

        {ong.email && (
          <View style={styles.section}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.text}>{ong.email}</Text>
            <TouchableOpacity style={styles.linkButton} onPress={openEmail}>
              <Text style={styles.linkButtonText}>✉️ Enviar Email</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity 
          style={styles.whatsappButton} 
          onPress={openWhatsApp}
          disabled={!ong.phone}
        >
          <Text style={styles.whatsappButtonText}>
            💬 Contatar via WhatsApp
          </Text>
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
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  linkButton: {
    backgroundColor: '#e8f4f8',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  linkButtonText: {
    color: '#0066cc',
    fontSize: 14,
    fontWeight: '500',
  },
  whatsappButton: {
    backgroundColor: '#25D366',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  whatsappButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
})