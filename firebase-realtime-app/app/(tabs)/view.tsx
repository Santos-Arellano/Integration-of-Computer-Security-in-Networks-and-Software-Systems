// app/(tabs)/view.tsx
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

interface Usuario {
  id: string;
  matricula: string;
  nombre: string;
  semestre: string;
  timestamp: Date;
}

export default function ViewScreen() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "usuarios"), 
      orderBy("timestamp", "desc")
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const usuariosData: Usuario[] = [];
      querySnapshot.forEach((doc) => {
        usuariosData.push({
          id: doc.id,
          ...doc.data() as Omit<Usuario, 'id'>
        });
      });
      setUsuarios(usuariosData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>Matrícula: {item.matricula}</Text>
            <Text style={styles.title}>Nombre: {item.nombre}</Text>
            <Text>Semestre: {item.semestre}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  card: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});