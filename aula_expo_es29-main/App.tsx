import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import MapPage from './src/pages/Map'
import ListPage from './src/pages/List'
import PlacePage from './src/pages/Place'
import LoginPage from './src/pages/Auth/Login'
import RegisterPage from './src/pages/Auth/Register'
import RegisterOngPage from './src/pages/Auth/RegisterOng'
import ProfilePage from './src/pages/Profile'
import ONGsListPage from './src/pages/ONGsList'
import ONGDetailsPage from './src/pages/Ong'
import SupportPage from './src/pages/Support'
import SettingsPage from './src/pages/Settings'
import { AuthProvider } from './src/contexts/AuthContext'
import AuthContext from './src/contexts/AuthContext'
import ChatPage from './src/pages/Chat'
const Stack = createNativeStackNavigator()

function MainStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Map" component={MapPage} options={{ headerShown: false }} />
            <Stack.Screen name="List" component={ListPage} options={{ title: 'Listagem' }} />
            <Stack.Screen name="Place" component={PlacePage} />
            <Stack.Screen name="Profile" component={ProfilePage} options={{ title: 'Perfil' }} />
            <Stack.Screen name="ONG" component={ONGsListPage} options={{ title: 'ONGs Próximas' }} />
            <Stack.Screen name="ONGDetails" component={ONGDetailsPage} options={{ title: 'Detalhes da ONG' }} />
            <Stack.Screen name="Support" component={SupportPage} options={{ title: 'Suporte' }} />
            <Stack.Screen name="Settings" component={SettingsPage} options={{ title: 'Configurações' }} />
            <Stack.Screen name="Chat" component={ChatPage} options={{ title: "Assistente IA" }} />
        </Stack.Navigator>
    )
}

function AuthStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginPage} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterPage} options={{ headerShown: false }} />
            <Stack.Screen name="RegisterOng" component={RegisterOngPage} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}

export default function App() {
    return (
        <AuthProvider>
            <NavigationContainer>
                <AuthContext.Consumer>
                    {({ user }) => (user ? <MainStack /> : <AuthStack />)}
                </AuthContext.Consumer>
            </NavigationContainer>
        </AuthProvider>
    )
}
