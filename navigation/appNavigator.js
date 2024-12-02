import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Logo from '../screens/logoScreen';
import Registro from '../screens/registroScreen';
import QR from '../screens/qrScreen';
import MainTabs from './mainTabs';

const Stack = createStackNavigator();

const AppNavigator = () => (
    <NavigationContainer>
        <Stack.Navigator initialRouteName="Logo">
            <Stack.Screen name="Logo" component={Logo} options={{ headerShown: false }} />
            <Stack.Screen name="Tabs" component={MainTabs} options={{ headerShown: false }} />
        </Stack.Navigator>
    </NavigationContainer>
);

export default AppNavigator;
