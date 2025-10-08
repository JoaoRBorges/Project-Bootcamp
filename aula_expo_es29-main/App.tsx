import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Ionicons from '@expo/vector-icons/Ionicons'

import MapPage from './src/pages/Map'
import ListPage from './src/pages/List'
import PlacePage from './src/pages/Place'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

function MapStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="home" component={MapPage} options={{ headerShown: false }} />
            <Stack.Screen name="place" component={PlacePage} />
        </Stack.Navigator>
    )
}

function ListStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="home" component={ListPage} options={{ title: 'Listagem' }} />
            <Stack.Screen name="place" component={PlacePage} />
        </Stack.Navigator>
    )
}

export default function App() {
  return (
    <NavigationContainer>
        <Tab.Navigator>
            <Tab.Screen name="Map" component={MapStack}
                options={{
                    headerShown: false,
                    tabBarIcon: () => <Ionicons name="map" size={26} />
                }}
            />
            <Tab.Screen name="List" component={ListStack}
                options={{
                    headerShown: false,
                    tabBarIcon: () => <Ionicons name="list" size={26} />
                }}
            />
        </Tab.Navigator>
    </NavigationContainer>
  )
}
