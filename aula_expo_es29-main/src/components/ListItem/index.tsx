import { Text, View } from 'react-native'

import { Place } from '../../models'
import styles from './styles'

type Props = {
    place: Place,
    touch: () => void
}

export default function ListItem({ place, touch }: Props) {
    return (
        <View style={styles.container} onTouchEnd={touch}>
            <Text style={styles.title}>{place.name}</Text>
            <Text style={styles.subTitle}>{place.description}</Text>
        </View>
    )
}