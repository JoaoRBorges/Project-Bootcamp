import React from 'react'
import { FlatList, Text, View } from "react-native"
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native'

import * as placeRepo from '../servicos/place.repo'
import ListItem from '../components/ListItem'
import { Place } from '../models'
import AuthContext from '../contexts/AuthContext'

type User = { name: string; email: string }

export default function ListPage() {

    const navigation = useNavigation<NavigationProp<any>>()
    const [places, setPlaces] = React.useState<Place[]>([])
    const [users, setUsers] = React.useState<User[]>([])

    const auth = React.useContext(AuthContext)

    useFocusEffect(
        React.useCallback(() => {
            placeRepo.getList().then(data => setPlaces(data))
        }, [])
    )

    // Carrega usuários apenas se o usuário logado for admin
    useFocusEffect(
        React.useCallback(() => {
            if (auth.user && auth.user.name === 'admin') {
                try {
                    const list = auth.getUsers()
                    setUsers(list)
                } catch (err) {
                    setUsers([])
                }
            } else {
                setUsers([])
            }
        }, [auth.getUsers, auth.user])
    )

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
            {auth.user && auth.user.name === 'admin' && (
                <View style={{ padding: 12 }}>
                    <Text style={{ fontWeight: '700', marginBottom: 8 }}>Usuarios cadastrados:</Text>
                    {users.map(u => (
                        <Text key={u.email} style={{ marginVertical: 2 }}>{u.name} — {u.email}</Text>
                    ))}
                </View>
            )}

            <Text style={{ margin: 20, textAlign: 'center' }}>
                Temos {places.length} lugares cadastrados.
            </Text>
        </View>
    )
}