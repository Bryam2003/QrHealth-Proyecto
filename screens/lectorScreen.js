// screens/Inicio.js
import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, Image, Linking } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function Lector (){
    const [permiso, solicitarPermiso] = useCameraPermissions();
    const permisoProveido = Boolean(permiso?.granted)
    const [isLoading, setIsLoading] = useState(true); // Estado de carga

    useEffect(() => {
        const checkPermissions = async () => {
            const { status } = await solicitarPermiso();
            if (status === 'granted') {
                // El permiso fue concedido
                setIsLoading(false);
            } else {
                // El permiso no fue concedido
                setIsLoading(false);
            }
        };

        checkPermissions();
    }, [solicitarPermiso]);
    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <Image style={styles.logo} source={require('../icons/Logo.png')} />
                <Text style={styles.title}>QRHealth</Text>
            </View>
            <View style={{marginTop: 20}}>
                <CameraView 
                style={{width: 280, height: 280}}
                facing='back'
                onBarcodeScanned={({data}) =>{
                    console.log("data", data)
                    Linking.openURL(data);
                }}
                />
                <Text style={[styles.boton, {opacity: !permisoProveido ? 0.5 : 1}]}>Acceso a la camara</Text>
            </View>
            
        </View>
    );
    
};

const styles = StyleSheet.create({
    container: { flex: 1,
        backgroundColor: 'white',
        alignItems: 'center', },
    text: { fontSize: 18 },
    boton: {alignSelf: 'center'},
    header: {
        height: 150,
        width: 400,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4f4ed8ff',
    },
    logo: {
        resizeMode: 'stretch',
        width: 45,
        height: 45,
        marginHorizontal: 10,
        marginTop: 15,
    },
    title: {
        color: 'white',
        fontSize: 40,
        marginTop: 10,
    },
});

