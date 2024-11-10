// app/(tabs)/input.tsx
import { StyleSheet, View, TextInput, Button } from 'react-native';
import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function InputScreen() {
  const [matricula, setMatricula] = useState('');
  const [nombre, setNombre] = useState('');
  const [semestre, setSemestre] = useState('');

  const guardarDatos = async () => {
    // Guardar en Firestore
    try {
      await addDoc(collection(db, "usuarios"), {
        matricula,
        nombre,
        semestre,
        timestamp: new Date()
      });
      alert('Datos guardados en Firestore exitosamente');
    } catch (error) {
      console.error("Error al guardar en Firestore:", error);
      alert('Error al guardar en Firestore');
    }

    // Guardar en la API local
    try {
      const response = await fetch('http://localhost:3000/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ matricula, nombre, semestre }),
      });

      if (!response.ok) {
        throw new Error('Error al guardar en la API local');
      }

      alert('Datos guardados en la API local exitosamente');
      setMatricula('');
      setNombre('');
      setSemestre('');
    } catch (error) {
      console.error("Error al guardar en la API local:", error);
      alert('Error al guardar en la API local');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Matrícula"
        value={matricula}
        onChangeText={setMatricula}
      />
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Semestre"
        value={semestre}
        onChangeText={setSemestre}
      />
      <Button title="Guardar" onPress={guardarDatos} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
});