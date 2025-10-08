import React from 'react'
import { Button, Text, TextInput, View } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'

import * as placeRepo from '../../servicos/place.repo'
import { Place } from '../../models'

import styles from './styles'

export default function PlacePage() {

    const route = useRoute()
    const navigation = useNavigation()
    const param = route.params as Place

    const [name, setName] = React.useState(param.name)
    const [description, setDescription] = React.useState(param.description)

    React.useEffect(() => {
        navigation.setOptions({
            title: param?.name ? 'Editar Local' : 'Adicionar Local'
        })
    }, [])

    async function savePlace() {
        if (name.trim().length < 3) {
            alert('O nome é inválido.')
            return
        }

        await placeRepo.save({
            latitude: param.latitude,
            longitude: param.longitude,
            name, description
        })

        navigation.goBack()
    }

    async function removePlace() {
        await placeRepo.remove(param)
        navigation.goBack()
    }

    return (
        <View style={styles.container}>
            <Text>Latitude: {param.latitude}</Text>
            <Text>Longitude: {param.longitude}</Text>

            <Text style={styles.title}>Informe o nome do local referente as coordenadas acima</Text>

            <TextInput style={styles.input} placeholder='Nome' value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder='Descrição' value={description} onChangeText={setDescription} />

            <View style={styles.viewButton}>
                <Button title="Salvar" onPress={savePlace} />
                
                <Button title="Delete" color='red' onPress={removePlace} />
            </View>
        </View>
    )
}