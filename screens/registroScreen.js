import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable, TextInput, Alert, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { savePatientData } from '../firebase/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Registro({ patientId, setPatientId}) {
    const navigation = useNavigation();
    
    const [patientData, setPatientData] = useState({
        nombre: '',
        alergia: '',
        estatura: '',
        tipoSangre: '',
        genero: ''
    });

    const savePatientId = async (id) => {
        try {
            await AsyncStorage.setItem('patientId', id);
        } catch (error) {
            console.error('Error al guardar el patientId:', error);
        }
    };

    const handleRegister = async () => {
        try {
            const updatedPatientId = await savePatientData(patientData, patientId); // Pasa el ID existente si lo hay
        if (updatedPatientId) {
            Alert.alert('Registro exitoso', 'Los datos del paciente han sido guardados correctamente.');
            setPatientId(updatedPatientId);
            savePatientId(updatedPatientId); // Guarda el ID para futuras actualizaciones
            navigation.navigate('QR', { patientId: updatedPatientId });
        } else {
            Alert.alert('Error', 'No se pudo registrar los datos.');
        }
    } catch (error) {
        console.error('Error al registrar datos:', error);
        Alert.alert('Error', 'Ocurrió un error al guardar los datos.');
    }
    };

    const loadPatientId = async () => {
        try {
            const id = await AsyncStorage.getItem('patientId');
            if (id) {
                setPatientId(id);
            }
        } catch (error) {
            console.error('Error al cargar el patientId:', error);
        }
    };

    useEffect(() => {
        loadPatientId();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image style={styles.logo} source={require('../icons/Logo.png')} />
                <Text style={styles.title}>QRHealth</Text>
            </View>
            <View style={styles.formContainer}>
                <Text style={styles.inputLabel}>Ingrese la información del paciente</Text>
                <View style={styles.separator} />
                <TextInput
                    style={styles.input}
                    placeholder='Nombre'
                    onChangeText={(text) => setPatientData({ ...patientData, nombre: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Alergias'
                    onChangeText={(text) => setPatientData({ ...patientData, alergia: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Estatura'
                    onChangeText={(text) => setPatientData({ ...patientData, estatura: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Tipo de Sangre'
                    onChangeText={(text) => setPatientData({ ...patientData, tipoSangre: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Género'
                    onChangeText={(text) => setPatientData({ ...patientData, genero: text })}
                />
            </View>
            <Pressable style={styles.registerButton} onPress={handleRegister}>
                <LinearGradient colors={['#4f4ed8ff', '#00aeda']} style={styles.gradient}>
                    <Text style={styles.buttonText}>Registrar información</Text>
                </LinearGradient>
            </Pressable>
            <Image style={styles.bottomImage} source={require('../assets/bottom.png')} />
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
    },
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
    formContainer: {
        marginTop: 20,
    },
    inputLabel: {
        fontSize: 15,
        color: 'black',
        marginBottom: 5,
    },
    separator: {
        width: 375,
        height: 3,
        backgroundColor: '#d9d0e5',
        marginBottom: 15,
    },
    input: {
        width: 370,
        marginVertical: 8,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#f0f0f0',
    },
    registerButton: {
        width: 200,
        height: 50,
        marginTop: 10,
    },
    gradient: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 9999,
        padding: 15,
    },
    buttonText: {
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    bottomImage: {
        resizeMode: 'stretch',
        width: '100%',
        height: 130,
        marginTop: 130,
    },
});
