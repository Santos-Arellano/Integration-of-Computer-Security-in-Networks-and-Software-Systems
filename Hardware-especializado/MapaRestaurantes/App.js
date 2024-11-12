// App.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showTraffic, setShowTraffic] = useState(false);
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Se requiere permiso para acceder a la ubicación');
        Alert.alert(
          'Permiso denegado',
          'Esta aplicación necesita acceso a la ubicación para mostrar tu posición en el mapa.',
          [{ text: 'OK' }]
        );
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setLocation(location);
        
        // Generar restaurantes de ejemplo cerca de la ubicación actual
        generateNearbyRestaurants(location.coords.latitude, location.coords.longitude);
      } catch (error) {
        Alert.alert(
          'Error de ubicación',
          'No se pudo obtener la ubicación. Por favor, verifica que el GPS esté activado.',
          [{ text: 'OK' }]
        );
      }
    })();
  }, []);

  const generateNearbyRestaurants = (latitude, longitude) => {
    // Generar 5 restaurantes aleatorios cercanos
    const mockRestaurants = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      name: `Restaurante ${i + 1}`,
      coordinate: {
        latitude: latitude + (Math.random() - 0.5) * 0.01,
        longitude: longitude + (Math.random() - 0.5) * 0.01,
      },
      rating: Math.floor(Math.random() * 5) + 1
    }));
    setRestaurants(mockRestaurants);
  };

  return (
    <View style={styles.container}>
      {location ? (
        <>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            // Usar OpenStreetMap como proveedor de mapas
            urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          >
            {/* Marcador de ubicación actual */}
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Mi ubicación"
              description="Estás aquí"
            />

            {/* Marcadores de restaurantes */}
            {restaurants.map((restaurant) => (
              <Marker
                key={restaurant.id}
                coordinate={restaurant.coordinate}
                title={restaurant.name}
                description={`Calificación: ${restaurant.rating} estrellas`}
                pinColor="red"
              />
            ))}
          </MapView>

          {/* Panel de información */}
          <View style={styles.infoPanel}>
            <Text style={styles.infoPanelText}>
              Restaurantes cercanos: {restaurants.length}
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setShowTraffic(!showTraffic)}
            >
              <MaterialIcons
                name="restaurant"
                size={24}
                color="#666"
              />
              <Text style={styles.buttonText}>
                {showTraffic ? "Ocultar restaurantes" : "Mostrar restaurantes"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Botón de actualización */}
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={() => generateNearbyRestaurants(
              location.coords.latitude,
              location.coords.longitude
            )}
          >
            <MaterialIcons name="refresh" size={24} color="white" />
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.loadingContainer}>
          <Text>Cargando ubicación...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoPanel: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  infoPanelText: {
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 20,
  },
  buttonText: {
    marginLeft: 5,
    color: '#666',
    fontWeight: 'bold',
  },
  refreshButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#4CAF50',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});