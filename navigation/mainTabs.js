import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Registro from '../screens/registroScreen';
import QR from '../screens/qrScreen';
import Lector from '../screens/lectorScreen';

import { Ionicons } from '@expo/vector-icons'; // Iconos para representar cada tab

const Tab = createBottomTabNavigator();

function MainTabs () { 
    const [patientId, setPatientId] = useState(null);
    return(
        <Tab.Navigator
            initialRouteName="Registro"
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === 'Registro') iconName = 'home';
                    else if (route.name === 'QR') iconName = 'qr-code';
                    else if (route.name === 'Lector') iconName = 'scan';
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'blue',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
            })}
        >
            <Tab.Screen name="Registro">
                {() => <Registro patientId={patientId} setPatientId={setPatientId}/>}
            </Tab.Screen>
            <Tab.Screen name="QR">
                {() => <QR patientId={patientId} setPatientId={setPatientId}/>}
            </Tab.Screen>
            <Tab.Screen name="Lector" component={Lector} />
        </Tab.Navigator>
    );
};

export default MainTabs;
