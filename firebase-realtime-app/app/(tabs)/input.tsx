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
    try {
      await addDoc(collection(db, "usuarios"), {
        matricula,
        nombre,
        semestre,
        timestamp: new Date()
      });
      setMatricula('');
      setNombre('');
      setSemestre('');
      alert('Datos guardados exitosamente');
    } catch (error) {
      console.error("Error al guardar:", error);
      alert('Error al guardar los datos');
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