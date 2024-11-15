// App.js
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LOCATION_ACCURACY = Location.Accuracy.Balanced;
const LOCATION_UPDATE_INTERVAL = 5000; // 5 segundos
const OFFLINE_CACHE_KEY = 'offlineMapData';

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showRestaurants, setShowRestaurants] = useState(true);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [route, setRoute] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected);
      if (!state.isConnected) {
        Alert.alert(
          'Modo sin conexión',
          'La aplicación funcionará con funcionalidad limitada hasta que se restablezca la conexión.',
          [{ text: 'OK' }]
        );
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    initializeLocation();
  }, []);

  const initializeLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        handleLocationError('Se requiere permiso para acceder a la ubicación');
        return;
      }

      const locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: LOCATION_ACCURACY,
          timeInterval: LOCATION_UPDATE_INTERVAL,
          distanceInterval: 10,
        },
        (newLocation) => {
          setLocation(newLocation);
          if (isOnline) {
            generateNearbyRestaurants(newLocation.coords.latitude, newLocation.coords.longitude);
          }
        }
      );

      const initialLocation = await Location.getCurrentPositionAsync({
        accuracy: LOCATION_ACCURACY,
      });
      
      setLocation(initialLocation);
      generateNearbyRestaurants(initialLocation.coords.latitude, initialLocation.coords.longitude);
      setIsLoading(false);
      await cacheLocationData(initialLocation);

    } catch (error) {
      handleLocationError('Error al obtener la ubicación');
    }
  };

  const handleLocationError = (message) => {
    setErrorMsg(message);
    Alert.alert(
      'Error de ubicación',
      `${message}. Verifica el GPS y los permisos.`,
      [
        { text: 'Reintentar', onPress: () => initializeLocation() },
        { text: 'OK' },
      ]
    );
  };

  const cacheLocationData = async (locationData) => {
    try {
      await AsyncStorage.setItem(OFFLINE_CACHE_KEY, JSON.stringify({
        location: locationData,
        restaurants,
        timestamp: Date.now(),
      }));
    } catch (error) {
      console.error('Error caching data:', error);
    }
  };

  const generateNearbyRestaurants = (latitude, longitude) => {
    const restaurantTypes = ['Italiano', 'Mexicano', 'Japonés', 'Mediterráneo', 'Vegetariano'];
    const mockRestaurants = Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      name: `${restaurantTypes[i % restaurantTypes.length]} Restaurant`,
      coordinate: {
        latitude: latitude + (Math.random() - 0.5) * 0.01,
        longitude: longitude + (Math.random() - 0.5) * 0.01,
      },
      rating: Math.floor(Math.random() * 5) + 1,
      distance: Math.floor(Math.random() * 1000) + 100,
      isOpen: Math.random() > 0.2,
    }));
    setRestaurants(mockRestaurants);
  };

  const calculateRoute = async (destLat, destLong) => {
    if (!isOnline) {
      Alert.alert('Sin conexión', 'La función de rutas no está disponible sin conexión.');
      return;
    }
    try {
      const startPoint = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      const endPoint = { latitude: destLat, longitude: destLong };
      setRoute([startPoint, endPoint]);
      mapRef.current?.fitToCoordinates([startPoint, endPoint], {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    } catch (error) {
      Alert.alert('Error', 'No se pudo calcular la ruta.');
    }
  };

  const handleRestaurantPress = (restaurant) => {
    setSelectedRestaurant(restaurant);
    calculateRoute(restaurant.coordinate.latitude, restaurant.coordinate.longitude);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Cargando mapa...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {location ? (
        <>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            showsUserLocation
            showsMyLocationButton
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Mi ubicación"
              description="Estás aquí"
              pinColor="blue"
            />
            {showRestaurants && restaurants.map((restaurant) => (
              <Marker
                key={restaurant.id}
                coordinate={restaurant.coordinate}
                title={restaurant.name}
                description={`${restaurant.rating}★ • ${restaurant.distance}m • ${restaurant.isOpen ? 'Abierto' : 'Cerrado'}`}
                pinColor={restaurant.isOpen ? "red" : "gray"}
                onPress={() => handleRestaurantPress(restaurant)}
              />
            ))}
            {route && <Polyline coordinates={route} strokeColor="#4CAF50" strokeWidth={3} />}
          </MapView>

          <View style={styles.infoPanel}>
            <Text style={styles.infoPanelText}>
              {isOnline ? `Restaurantes cercanos: ${restaurants.length}` : 'Modo sin conexión'}
            </Text>
            {selectedRestaurant && (
              <View style={styles.selectedRestaurantInfo}>
                <Text style={styles.restaurantName}>{selectedRestaurant.name}</Text>
                <Text>{selectedRestaurant.rating}★ • {selectedRestaurant.distance}m</Text>
                <Text>{selectedRestaurant.isOpen ? '🟢 Abierto' : '🔴 Cerrado'}</Text>
              </View>
            )}
            <TouchableOpacity style={styles.button} onPress={() => setShowRestaurants(!showRestaurants)}>
              <MaterialIcons name="restaurant" size={24} color="#666" />
              <Text style={styles.buttonText}>
                {showRestaurants ? "Ocultar restaurantes" : "Mostrar restaurantes"}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.refreshButton}
            onPress={() => {
              if (isOnline) {
                generateNearbyRestaurants(location.coords.latitude, location.coords.longitude);
              } else {
                Alert.alert('Sin conexión', 'No se pueden actualizar los datos sin conexión.');
              }
            }}
          >
            <MaterialIcons name="refresh" size={24} color="white" />
          </TouchableOpacity>

          {route && (
            <TouchableOpacity style={styles.clearRouteButton} onPress={() => setRoute(null)}>
              <MaterialIcons name="clear" size={24} color="white" />
            </TouchableOpacity>
          )}
        </>
      ) : (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMsg || 'Error al cargar la ubicación'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={initializeLocation}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
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
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ff0000',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
  },
  infoPanel: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
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
  selectedRestaurantInfo: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 20,
    marginTop: 10,
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
  clearRouteButton: {
    position: 'absolute',
    bottom: 30,
    right: 90,
    backgroundColor: '#ff5722',
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