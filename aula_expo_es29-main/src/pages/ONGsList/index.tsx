import React, { useState, useEffect } from 'react'
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  Linking,
  RefreshControl,
  SafeAreaView
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as Location from 'expo-location'
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../styles/DesignSystem'

interface NearbyONG {
  id: string
  name: string
  address: string
  phone?: string
  email?: string
  latitude: number
  longitude: number
  distance?: number
}

// Lista das ONGs (mesma do Map.tsx)
const BRAZIL_ONGS_BASE = [
  {
    id: 'ong-1',
    name: 'Instituto Ayrton Senna',
    address: 'Av. Paulista, 1106 - Bela Vista, São Paulo - SP, Brazil',
    phone: '+551131688000',
    email: 'contato@senna.org.br'
  },
  {
    id: 'ong-2',
    name: 'Fundação Abrinq',
    address: 'Av. Santo Amaro, 1386 - Vila Nova Conceição, São Paulo - SP, Brazil',
    phone: '+551138488999',
    email: 'fundabrinq@fundabrinq.org.br'
  },
  {
    id: 'ong-3',
    name: 'GRAACC',
    address: 'R. Botucatu, 743 - Vila Clementino, São Paulo - SP, Brazil',
    phone: '+551150808400',
    email: 'graacc@graacc.org.br'
  },
  {
    id: 'ong-4',
    name: 'Ação da Cidadania',
    address: 'Rua da Glória, 292 - Liberdade, São Paulo - SP, Brazil',
    phone: '+551131071999',
    email: 'acaodacidadania@acaodacidadania.org.br'
  },
  {
    id: 'ong-5',
    name: 'Greenpeace Brasil',
    address: 'Rua Alvaro Alvim, 21 - Centro, Rio de Janeiro - RJ, Brazil',
    phone: '+552135159600',
    email: 'supporter.br@greenpeace.org'
  },
  {
    id: 'ong-6',
    name: 'SOS Mata Atlântica',
    address: 'Av. Nossa Senhora de Copacabana, 1010 - Copacabana, Rio de Janeiro - RJ, Brazil',
    phone: '+552138240000',
    email: 'atendimento@sosma.org.br'
  },
  {
    id: 'ong-7',
    name: 'Médicos Sem Fronteiras',
    address: 'Rua Dias Ferreira, 190 - Leblon, Rio de Janeiro - RJ, Brazil',
    phone: '+552121413110',
    email: 'msf@rio.msf.org'
  },
  {
    id: 'ong-8',
    name: 'WWF Brasil',
    address: 'SHIS EQ QL 6/8 Conjunto E - Lago Sul, Brasília - DF, Brazil',
    phone: '+556134643727',
    email: 'wwfbrasil@wwf.org.br'
  },
  {
    id: 'ong-9',
    name: 'ISPN',
    address: 'SCLN 113 Bloco C - Asa Norte, Brasília - DF, Brazil',
    phone: '+556133272043',
    email: 'ispn@ispn.org.br'
  },
  {
    id: 'ong-10',
    name: 'Pastoral da Criança',
    address: 'Av. Afonso Pena, 867 - Centro, Belo Horizonte - MG, Brazil',
    phone: '+553132481800',
    email: 'contato@pastoraldacrianca.org.br'
  },
  {
    id: 'ong-11',
    name: 'IGEE',
    address: 'Av. Alberto Bins, 665 - Centro Histórico, Porto Alegre - RS, Brazil',
    phone: '+555130614600',
    email: 'igee@igee.org.br'
  },
  {
    id: 'ong-12',
    name: 'ICEP',
    address: 'Rua das Flores, 26 - Centro, Salvador - BA, Brazil',
    phone: '+557135080000',
    email: 'contato@icep.org.br'
  },
  {
    id: 'ong-13',
    name: 'Centro Josué de Castro',
    address: 'Av. Rio Branco, 1492 - Recife Antigo, Recife - PE, Brazil',
    phone: '+558132242700',
    email: 'cjc@josuedecastro.org.br'
  },
  {
    id: 'ong-14',
    name: 'Instituto das Águas',
    address: 'Rua XV de Novembro, 1299 - Centro, Curitiba - PR, Brazil',
    phone: '+554132643900',
    email: 'contato@institutodasaguas.org.br'
  },
  {
    id: 'ong-15',
    name: 'Instituto da Infância',
    address: 'Av. Santos Dumont, 2828 - Aldeota, Fortaleza - CE, Brazil',
    phone: '+558531053900',
    email: 'ifan@ifan.org.br'
  }
]

const MAPBOX_API_KEY = 'pk.eyJ1IjoiaW1wYWN0YXZpbmkiLCJhIjoiY21naXRoM2E4MGN1YjJrb2toeXBzd2huYSJ9.HjAEpTV9B7kmqm2S0urBAw'

export default function ONGsListPage() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null)
  const [nearbyONGs, setNearbyONGs] = useState<NearbyONG[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const NEARBY_RADIUS_KM = 25

  //descomentar quando for usar a API, cuidado com o limite de requisições gratuito
  // async function geocodeAddress(address: string): Promise<{ latitude: number; longitude: number } | null> {
  //   try {
  //     const encodedAddress = encodeURIComponent(address)
  //     const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${MAPBOX_API_KEY}&country=BR&limit=1`
      
  //     const response = await fetch(url)
  //     const data = await response.json()
      
  //     if (data.features && data.features.length > 0) {
  //       const [longitude, latitude] = data.features[0].center
  //       return { latitude, longitude }
  //     }
  //     return null
  //   } catch (error) {
  //     console.error(`Error geocoding address: ${address}`, error)
  //     return null
  //   }
  // }

  function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371 // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1)
    const dLon = deg2rad(lon2 - lon1)
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    const d = R * c // Distance in km
    return d
  }

  function deg2rad(deg: number) {
    return deg * (Math.PI/180)
  }

  async function requestLocationPermission() {
    const { status } = await Location.requestForegroundPermissionsAsync()
    if (status === 'granted') {
      Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest
      }).then((data: Location.LocationObject) => {
        setLocation(data)
        loadONGsWithCoordinates(data.coords.latitude, data.coords.longitude)
      })
    } else {
      console.error('Permission to access location was denied')
      loadONGsWithCoordinates(-23.5505, -46.6333) // São Paulo como fallback
    }
  }

  async function loadONGsWithCoordinates(userLat: number, userLon: number) {
    setIsLoading(true)
    const ongsWithCoords: NearbyONG[] = []
    
    //descomentar quando for usar a API, cuidado com o limite de requisições gratuito
    // for (const ong of BRAZIL_ONGS_BASE) {
    //   const coords = await geocodeAddress(ong.address)
    //   console.log('coords', coords)
    //   if (coords) {
    //     const distance = getDistanceFromLatLonInKm(
    //       userLat, userLon, 
    //       coords.latitude, coords.longitude
    //     )
        
    //     ongsWithCoords.push({
    //       ...ong,
    //       latitude: coords.latitude,
    //       longitude: coords.longitude,
    //       distance
    //     })
    //   }
    // }
    
    // Filtrar por raio e ordenar por distância
    const filteredONGs = ongsWithCoords
      .filter(ong => ong.distance && ong.distance <= NEARBY_RADIUS_KM)
      .sort((a, b) => (a.distance || 0) - (b.distance || 0))
    
    setNearbyONGs(filteredONGs)
    setIsLoading(false)
  }

  const onRefresh = async () => {
    setRefreshing(true)
    if (location) {
      await loadONGsWithCoordinates(location.coords.latitude, location.coords.longitude)
    }
    setRefreshing(false)
  }

  const openWhatsApp = (ong: NearbyONG) => {
    if (ong.phone) {
      const rawPhone = ong.phone.replace(/[^+\d]/g, '')
      const message = encodeURIComponent(`Olá ${ong.name}, gostaria de realizar uma doação.`)
      const waUrl = `whatsapp://send?phone=${rawPhone}&text=${message}`
      const waWebUrl = `https://wa.me/${rawPhone}?text=${message}`
      
      Linking.openURL(waUrl)
        .catch(() => Linking.openURL(waWebUrl))
        .catch(() => Alert.alert('WhatsApp', 'Não foi possível abrir o WhatsApp.'))
    } else {
      Alert.alert('WhatsApp', 'Número de telefone indisponível para esta ONG.')
    }
  }

  const openMaps = (ong: NearbyONG) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${ong.latitude},${ong.longitude}`
    Linking.openURL(url)
  }

  useEffect(() => {
    requestLocationPermission()
  }, [])

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <Ionicons name="location-outline" size={60} color={Colors.primary} />
          <Text style={styles.loadingText}>Carregando ONGs próximas...</Text>
          <Text style={styles.loadingSubtext}>Buscando organizações na sua região</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Ionicons name="business-outline" size={60} color="#007AFF" />
          <Text style={styles.title}>ONGs Próximas</Text>
          <Text style={styles.subtitle}>
            {nearbyONGs.length} ONGs encontradas em um raio de {NEARBY_RADIUS_KM}km
          </Text>
        </View>
  
        {nearbyONGs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="location-outline" size={80} color="#ccc" />
            <Text style={styles.emptyText}>Nenhuma ONG encontrada próxima</Text>
            <Text style={styles.emptySubtext}>
              Tente aumentar o raio de busca ou verifique sua localização
            </Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {nearbyONGs.map((ong) => (
              <View key={ong.id} style={styles.ongCard}>
                <View style={styles.ongHeader}>
                  <Text style={styles.ongName}>{ong.name}</Text>
                  <View style={styles.distanceContainer}>
                    <Ionicons name="location-outline" size={16} color="#666" />
                    <Text style={styles.distanceText}>
                      {ong.distance?.toFixed(1)} km
                    </Text>
                  </View>
                </View>
                
                <Text style={styles.ongAddress}>{ong.address}</Text>
                
                <View style={styles.ongActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => openMaps(ong)}
                  >
                    <Ionicons name="map-outline" size={20} color="#007AFF" />
                    <Text style={styles.actionButtonText}>Mapa</Text>
                  </TouchableOpacity>
                  
                  {ong.phone && (
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.whatsappButton]}
                      onPress={() => openWhatsApp(ong)}
                    >
                      <Ionicons name="logo-whatsapp" size={20} color="white" />
                      <Text style={[styles.actionButtonText, styles.whatsappButtonText]}>
                        WhatsApp
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenPadding,
  },
  loadingText: {
    ...Typography.h4,
    color: Colors.textPrimary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  loadingSubtext: {
    ...Typography.body2,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  header: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.xl,
    alignItems: 'center',
    ...Shadows.small,
  },
  title: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body1,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.xxl,
  },
  emptyText: {
    ...Typography.h4,
    color: Colors.textSecondary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptySubtext: {
    ...Typography.body2,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
  listContainer: {
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.md,
  },
  ongCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.medium,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  ongHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  ongName: {
    ...Typography.h4,
    color: Colors.textPrimary,
    flex: 1,
    marginRight: Spacing.md,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  distanceText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
  ongAddress: {
    ...Typography.body2,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  ongActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.surface,
    flex: 1,
    marginHorizontal: Spacing.xs,
    justifyContent: 'center',
    ...Shadows.small,
  },
  whatsappButton: {
    backgroundColor: Colors.whatsapp,
    borderColor: Colors.whatsapp,
  },
  actionButtonText: {
    ...Typography.button,
    color: Colors.primary,
    marginLeft: Spacing.sm,
  },
  whatsappButtonText: {
    color: Colors.textInverse,
  },
})
