// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, setDoc, } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';  

// Credendciales de configuración que da firebase
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCf0gqq1QDFnYU-TaVxDc6FrkgUWwJAvIA",
    authDomain: "qrhealth-b3fae.firebaseapp.com",
    projectId: "qrhealth-b3fae",
    storageBucket: "qrhealth-b3fae.firebasestorage.app",
    messagingSenderId: "776020612364",
    appId: "1:776020612364:web:752958295088cd379ea529"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app); 


export const savePatientData = async (patientData, patientId = null) => {
    try {
        if (patientId) {
            // Si ya existe un ID, actualiza el documento.
            const docRef = doc(db, 'Pacientes', patientId);
            await setDoc(docRef, patientData, { merge: true }); // Merge actualiza solo los campos indicados.
            console.log('Datos actualizados exitosamente:', docRef.id);
            return patientId;
        } else {
            // Si no existe un ID, crea un nuevo documento.
            const docRef = await addDoc(collection(db, 'Pacientes'), patientData);
            console.log('Datos guardados exitosamente:', docRef.id);
            return docRef.id;
        }
    } catch (error) {
        console.error('Error al guardar o actualizar los datos:', error);
        throw error;
    }
};

export { db, storage };
