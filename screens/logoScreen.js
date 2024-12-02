// Logo.js
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import QRHealth from '../icons/QRHealth';

export default function Logo({ navigation }) {
    return (
        <View style={styles.container}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
            <View style={{ height: 7, width: '25%', marginRight: 15, backgroundColor: 'white' }} />
            <QRHealth />
            <View style={{ height: 7, width: '25%', marginLeft: 15, backgroundColor: 'white' }} />
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'white', fontSize: 50 }}>QRHealth</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Tabs')}>
            <Text> Iniciar</Text>
        </TouchableOpacity>
        <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#4f4ed8ff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        borderRadius: 8,
    },
});
