import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Place } from '@conexao-ativa/shared';
import { placesService } from '../services/places';

export const ExploreScreen = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [showMap, setShowMap] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlaces();
  }, []);

  const loadPlaces = async () => {
    try {
      const data = await placesService.getPlaces();
      setPlaces(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os locais');
    } finally {
      setLoading(false);
    }
  };

  const getPlaceTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      COURT: 'Quadra',
      FIELD: 'Campo',
      TRACK: 'Pista',
      GYM: 'Ginásio',
      OTHER: 'Outro',
    };
    return labels[type] || type;
  };

  const renderPlace = ({ item }: { item: Place }) => (
    <View style={styles.placeCard}>
      <Text style={styles.placeName}>{item.name}</Text>
      <Text style={styles.placeType}>{getPlaceTypeLabel(item.type)}</Text>
      {item.address && (
        <Text style={styles.placeAddress}>{item.address}</Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Carregando locais...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explorar Locais</Text>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setShowMap(!showMap)}
        >
          <Text style={styles.toggleButtonText}>
            {showMap ? 'Lista' : 'Mapa'}
          </Text>
        </TouchableOpacity>
      </View>

      {showMap ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: -7.1917,
            longitude: -48.2073,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {places.map((place) => (
            <Marker
              key={place.id}
              coordinate={{
                latitude: place.lat,
                longitude: place.lng,
              }}
              title={place.name}
              description={getPlaceTypeLabel(place.type)}
            />
          ))}
        </MapView>
      ) : (
        <FlatList
          data={places}
          renderItem={renderPlace}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  toggleButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  map: {
    flex: 1,
  },
  listContainer: {
    padding: 20,
  },
  placeCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  placeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  placeType: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '600',
    marginBottom: 5,
  },
  placeAddress: {
    fontSize: 14,
    color: '#666',
  },
});

