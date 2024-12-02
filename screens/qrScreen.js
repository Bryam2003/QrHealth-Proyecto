import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert, Image, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { db, storage } from '../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as Print from 'expo-print';
import QRCode from 'react-native-qrcode-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function QR({ patientId, setPatientId }) {
    const [patientData, setPatientData] = useState(null);
    const [pdfUri, setPdfUri] = useState(null);
    const [qrValue, setQrValue] = useState(null);

    // Función para obtener los datos del paciente desde Firestore
    const fetchPatientData = async (id) => {
        try {
            const docRef = doc(db, 'Pacientes', id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setPatientData(docSnap.data());
            } else {
                Alert.alert('Error', 'No se encontraron datos del paciente.');
            }
        } catch (error) {
            console.error('Error al obtener los datos:', error);
            Alert.alert('Error', 'Ocurrió un problema al obtener los datos del paciente.');
        }
    };

    const fetchQrValue = async () => {
        try {
            const storedQrValue = await AsyncStorage.getItem(`pdfUrl_${patientId}`);
            if (storedQrValue) {
                setQrValue(storedQrValue); // Si existe, carga el QR con la URL guardada
            } else if (patientId) {
                await fetchPatientData(patientId); // Si no, carga los datos desde Firestore
            }
        } catch (error) {
            console.error('Error al recuperar la URL del PDF:', error);
        }
    };

    useEffect(() => {
        if (patientId) {
            fetchPatientData(patientId);
            fetchQrValue();
        }
        
    }, [patientId]);

    // Función para generar el PDF
    const generatePdf = async () => {
        if (!patientData) {
            console.log(patientId);
            Alert.alert('Error', 'No se puede generar el PDF sin los datos del paciente.');
            return;
        }
        console.log("Hola")
        const htmlContent = `
            <html>
                <body>
                    <h1>Información del Paciente</h1>
                    <p><strong>Nombre:</strong> ${patientData.nombre}</p>
                    <p><strong>Alergia:</strong> ${patientData.alergia}</p>
                    <p><strong>Estatura:</strong> ${patientData.estatura}</p>
                    <p><strong>Tipo de Sangre:</strong> ${patientData.tipoSangre}</p>
                    <p><strong>Género:</strong> ${patientData.genero}</p>
                </body>
            </html>
        `;

        try {
            const { uri } = await Print.printToFileAsync({ html: htmlContent });
            setPdfUri(uri);
            uploadPdf(uri);
        } catch (error) {
            console.error('Error al generar el PDF:', error);
            Alert.alert('Error', 'Hubo un problema al generar el PDF.');
        }
    };

    // Función para subir el PDF a Firebase Storage
    const uploadPdf = async (uri) => {
        if (!uri) {
            Alert.alert('Error', 'No se puede subir un archivo PDF sin un URI.');
            return;
        }

        try {
            const response = await fetch(uri);
            const blob = await response.blob();

            const storageRef = ref(storage, `Pacientes/${patientId}.pdf`);
            await uploadBytes(storageRef, blob);

            const downloadUrl = await getDownloadURL(storageRef);
            Alert.alert('Éxito', 'PDF generado y subido correctamente.');
            await AsyncStorage.setItem(`pdfUrl_${patientId}`, downloadUrl);
            setQrValue(downloadUrl); // Genera el QR con la URL del PDF
        } catch (error) {
            console.error('Error al subir el PDF a Storage:', error);
            Alert.alert('Error', 'Hubo un problema al subir el PDF.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image style={styles.logo} source={require('../icons/Logo.png')} />
                <Text style={styles.title}>QRHealth</Text>
            </View>
            <View style={styles.formContainer}>
                {qrValue ? (
                    <QRCode value={qrValue} size={280} />
                ) : (
                    <View style={styles.placeholder}>
                        <Text style={{ marginBottom: 10 }}>Registra tus datos primero</Text>
                    </View>
                )}
                <Pressable onPress={generatePdf}>
                    <LinearGradient colors={['#4f4ed8ff', '#00aeda']} style={styles.gradient}>
                        <Text style={styles.text}>Generar PDF y QR</Text>
                    </LinearGradient>
                </Pressable>
            </View>
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
        alignItems: 'center',
    },
    gradient: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 9999,
        padding: 15,
        marginTop: 20,
        width: 200,
    },
    text: {
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    placeholder: {
        width: 280,
        height: 280,
        backgroundColor: 'gray',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomImage: {
        resizeMode: 'stretch',
        width: '100%',
        height: 130,
        marginTop: 160,
    },
});
