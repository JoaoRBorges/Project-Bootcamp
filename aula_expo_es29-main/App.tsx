import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Ionicons from '@expo/vector-icons/Ionicons'

import MapPage from './src/pages/Map'
import ListPage from './src/pages/List'
import PlacePage from './src/pages/Place'
import LoginPage from './src/pages/Auth/Login'
import RegisterPage from './src/pages/Auth/Register'
import { AuthProvider } from './src/contexts/AuthContext'
import AuthContext from './src/contexts/AuthContext'

import ONGDetailsPage from './src/pages/Ong'; // Add this import

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

function MapStack() {
        return (
                <Stack.Navigator>
                        <Stack.Screen name="home" component={MapPage} options={{ headerShown: false }} />
                        <Stack.Screen name="place" component={PlacePage} />
                        <Stack.Screen name="ongDetails" component={ONGDetailsPage} options={{ title: 'Detalhes da ONG' }} />
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

function MainTabs() {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Map" component={MapStack} options={{ tabBarIcon: () => <Ionicons name="map" size={22} /> }} />
            <Tab.Screen name="List" component={ListStack} options={{ tabBarIcon: () => <Ionicons name="list" size={22} /> }} />
        </Tab.Navigator>
    )
}

function AuthStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginPage} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterPage} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}

export default function App() {
    return (
        <AuthProvider>
            <NavigationContainer>
                <AuthContext.Consumer>
                    {({ user }) => (user ? <MainTabs /> : <AuthStack />)}
                </AuthContext.Consumer>
            </NavigationContainer>
        </AuthProvider>
    )
}
