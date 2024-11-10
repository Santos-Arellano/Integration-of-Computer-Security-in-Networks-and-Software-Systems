import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

// Definir la interfaz para los registros
interface Registro {
  nombre: string;
  descripcion: string;
  cantidad: string;
}

const HomeScreen = () => {
  const [datos, setDatos] = useState({
    nombre: '',
    descripcion: '',
    cantidad: ''
  });
  // Actualizar el estado para usar el tipo Registro[]
  const [registros, setRegistros] = useState<Registro[]>([]);

  const handleSubmit = () => {
    // Agregar el nuevo registro al estado
    setRegistros([...registros, datos]);
    console.log('Guardando datos:', datos);
    // Limpiar el formulario después de guardar
    setDatos({ nombre: '', descripcion: '', cantidad: '' });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Control de Datos en Tiempo Real
        </Text>
      </View>

      {/* Formulario de captura */}
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Captura de Datos</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            value={datos.nombre}
            onChangeText={(text) => setDatos({...datos, nombre: text})}
            placeholder="Ingrese nombre"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={styles.input}
            value={datos.descripcion}
            onChangeText={(text) => setDatos({...datos, descripcion: text})}
            placeholder="Ingrese descripción"
            multiline
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Cantidad</Text>
          <TextInput
            style={styles.input}
            value={datos.cantidad}
            onChangeText={(text) => setDatos({...datos, cantidad: text})}
            placeholder="Ingrese cantidad"
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity 
          onPress={handleSubmit}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            Guardar Datos
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lista de registros */}
      <View style={styles.registrosContainer}>
        <Text style={styles.registrosTitle}>Registros en Tiempo Real</Text>
        <ScrollView style={styles.scrollView}>
          {registros.map((registro, index) => (
            <View key={index} style={styles.registro}>
              <Text style={styles.registroNombre}>{registro.nombre}</Text>
              <Text style={styles.registroDescripcion}>{registro.descripcion}</Text>
              <Text style={styles.registroCantidad}>Cantidad: {registro.cantidad}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

// Estilos (sin cambios)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { backgroundColor: '#3B82F6', padding: 16 },
  headerText: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  formContainer: { padding: 16, backgroundColor: '#FFFFFF', borderRadius: 8, margin: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.41, elevation: 2 },
  formTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
  inputContainer: { marginBottom: 16 },
  label: { color: '#4B5563', marginBottom: 4 },
  input: { borderColor: '#D1D5DB', borderWidth: 1, borderRadius: 8, padding: 8 },
  button: { backgroundColor: '#3B82F6', padding: 12, borderRadius: 8 },
  buttonText: { color: '#FFFFFF', textAlign: 'center', fontWeight: '600' },
  registrosContainer: { flex: 1, padding: 16 },
  registrosTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
  scrollView: { flex: 1 },
  registro: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 8, marginBottom: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 1.41, elevation: 1 },
  registroNombre: { fontWeight: '600' },
  registroDescripcion: { color: '#4B5563' },
  registroCantidad: { color: '#1F2937' },
});

export default HomeScreen;