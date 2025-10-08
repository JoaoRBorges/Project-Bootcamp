import AsyncStorage from '@react-native-async-storage/async-storage'

import { Place } from '../models'

const PLACE_REPO_KEY = 'PLACES@placeList'

async function setList(list: Place[]) {
    await AsyncStorage.setItem(PLACE_REPO_KEY, JSON.stringify(list))
}

function equals(p1: Place, p2: Place) {
    return p1.latitude === p2.latitude && p1.longitude === p2.longitude
}

export async function getList() {
    const data = await AsyncStorage.getItem(PLACE_REPO_KEY)
    if (data) {
        return JSON.parse(data) as Place[]
    } else {
        return []
    }
}

export async function save(newPlace: Place) {
    const list = await getList()

    const savedPlace = list.find(p => equals(p, newPlace))
    if (savedPlace) {
        savedPlace.name = newPlace.name
        savedPlace.description = newPlace.description
    } else {
        list.push(newPlace)
    }

    await setList(list)
}

export async function remove(place: Place) {
    const list = await getList()
    const filteredList = list.filter(p => !equals(p, place))
    await setList(filteredList)
}
