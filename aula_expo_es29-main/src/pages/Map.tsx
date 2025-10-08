import React from "react"
import * as Location from 'expo-location'
import { StyleSheet, View } from "react-native"
import { NavigationProp, useFocusEffect, useNavigation } from "@react-navigation/native"
import MapView, { LongPressEvent, Marker } from 'react-native-maps'

import { Place } from "../models"

import * as placeRepo from '../servicos/place.repo'

export default function MapPage() {

    const navigation = useNavigation<NavigationProp<any>>()

    const [location, setLocation] = React.useState<Location.LocationObject>()
    const [places, setPlaces] = React.useState<Place[]>([])

    async function requestLocationPermission() {
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status === 'granted') {
            Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Highest
            }).then(data => {
                setLocation(data)
            })
        } else {
            console.error('Permission to access location was denied')
        }
    }

    async function fetchPlaces() {
        setPlaces(await placeRepo.getList())
    }

    React.useEffect(() => {
        requestLocationPermission()
    }, [])
    
    useFocusEffect(() => {
        fetchPlaces()
    })

    function goToCreatePlace(event: LongPressEvent) {
        navigation.navigate('place', event.nativeEvent.coordinate)
    }

    function goToEditPlace(place: Place) {
        navigation.navigate('place', place)
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
                    heading: 0, pitch: 0, zoom: 15,
                }}
                onLongPress={goToCreatePlace}
            >
                { places.map(p => (
                    <Marker
                        key={p.latitude + p.longitude}
                        title={p.name}
                        onPress={() => goToEditPlace(p)}
                        coordinate={{ latitude: p.latitude, longitude: p.longitude }}
                    />
                )) }
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
