import React from 'react'
import { FlatList, Text, View } from "react-native"
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native'

import * as placeRepo from '../servicos/place.repo'
import ListItem from '../components/ListItem'
import { Place } from '../models'

export default function ListPage() {

    const navigation = useNavigation<NavigationProp<any>>()
    const [places, setPlaces] = React.useState<Place[]>([])

    useFocusEffect(() => {
        placeRepo.getList().then(data => setPlaces(data))
    })

    function goToEditPlace(place: Place) {
        navigation.navigate('place', place)
    }

    return (
        <View>
            <FlatList
                data={places}
                keyExtractor={item => `${item.latitude}_${item.longitude}`}
                renderItem={({ item }) => <ListItem place={item} touch={() => goToEditPlace(item)} />}
            />
            <Text style={{ margin: 20, textAlign: 'center' }}>
                Temos {places.length} lugares cadastrados.
            </Text>
        </View>
    )
}