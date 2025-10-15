import React from "react"
import * as Location from 'expo-location'
import { StyleSheet, View, Alert, Linking } from "react-native"
import { NavigationProp, useFocusEffect, useNavigation } from "@react-navigation/native"
import MapView, { LongPressEvent, Marker } from 'react-native-maps'
import { Place } from "../models"
import * as placeRepo from '../servicos/place.repo'

const MAPBOX_API_KEY = 'pk.eyJ1IjoiaW1wYWN0YXZpbmkiLCJhIjoiY21naXRoM2E4MGN1YjJrb2toeXBzd2huYSJ9.HjAEpTV9B7kmqm2S0urBAw' // Replace with your actual API key

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

// Curated list of major ONGs in Brazil (addresses only - coordinates will be fetched)
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

export default function MapPage() {
  const navigation = useNavigation<NavigationProp<any>>()
  const [location, setLocation] = React.useState<Location.LocationObject>()
  const [places, setPlaces] = React.useState<Place[]>([])
  const [nearbyONGs, setNearbyONGs] = React.useState<NearbyONG[]>([])
  const [isLoadingONGs, setIsLoadingONGs] = React.useState(false)

  async function geocodeAddress(address: string): Promise<{ latitude: number; longitude: number } | null> {
    try {
      const encodedAddress = encodeURIComponent(address)
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${MAPBOX_API_KEY}&country=BR&limit=1`
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (data.features && data.features.length > 0) {
        const [longitude, latitude] = data.features[0].center
        return { latitude, longitude }
      }
      return null
    } catch (error) {
      console.error(`Error geocoding address: ${address}`, error)
      return null
    }
  }

  async function loadONGsWithCoordinates() {
    setIsLoadingONGs(true)
    const ongsWithCoords: NearbyONG[] = []
    
    for (const ong of BRAZIL_ONGS_BASE) {
      const coords = await geocodeAddress(ong.address)
      if (coords) {
        ongsWithCoords.push({
          ...ong,
          latitude: coords.latitude,
          longitude: coords.longitude
        })
      }
    }
    
    setNearbyONGs(ongsWithCoords)
    setIsLoadingONGs(false)
  }

  async function requestLocationPermission() {
    const { status } = await Location.requestForegroundPermissionsAsync()
    if (status === 'granted') {
      Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest
      }).then(data => {
        setLocation(data)
        if (nearbyONGs.length > 0) {
          calculateDistances(data.coords.latitude, data.coords.longitude)
        }
      })
    } else {
      console.error('Permission to access location was denied')
    }
  }

  function calculateDistances(userLat: number, userLon: number) {
    const ongsWithDistance = nearbyONGs.map(ong => {
      const distance = getDistanceFromLatLonInKm(
        userLat, userLon, 
        ong.latitude, ong.longitude
      )
      return { ...ong, distance }
    }).sort((a, b) => (a.distance || 0) - (b.distance || 0))
    
    setNearbyONGs(ongsWithDistance)
  }

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

  async function fetchPlaces() {
    setPlaces(await placeRepo.getList())
  }

  React.useEffect(() => {
    requestLocationPermission()
    loadONGsWithCoordinates()
  }, [])

  React.useEffect(() => {
    if (location && nearbyONGs.length > 0 && !isLoadingONGs) {
      calculateDistances(location.coords.latitude, location.coords.longitude)
    }
  }, [nearbyONGs.length, isLoadingONGs])

  useFocusEffect(() => {
    fetchPlaces()
  })

  function goToCreatePlace(event: LongPressEvent) {
    navigation.navigate('place', event.nativeEvent.coordinate)
  }

  function goToEditPlace(place: Place) {
    navigation.navigate('place', place)
  }

  function handleONGPress(ong: NearbyONG) {
    navigation.navigate('ongDetails', { ong })
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        showsUserLocation={true}
        zoomControlEnabled={true}
        cameraZoomRange={{ animated: true }}
        camera={location && {
          center: location.coords,
          heading: 0, 
          pitch: 0, 
          zoom: 13,
        }}
        onLongPress={goToCreatePlace}
      >
        {/* User's saved places */}
        {places.map((place) => (
          <Marker
            key={place.id}
            coordinate={{
              latitude: place.latitude,
              longitude: place.longitude
            }}
            title={place.name}
            onPress={() => goToEditPlace(place)}
          />
        ))}

        {/* Nearby ONGs */}
        {nearbyONGs.map((ong) => (
          <Marker
            key={ong.id}
            coordinate={{
              latitude: ong.latitude,
              longitude: ong.longitude
            }}
            title={ong.name}
            description={ong.distance ? `${ong.distance.toFixed(1)} km de distância` : 'Toque para mais informações'}
            pinColor="red"
            onPress={() => handleONGPress(ong)}
          />
        ))}
      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  }
})